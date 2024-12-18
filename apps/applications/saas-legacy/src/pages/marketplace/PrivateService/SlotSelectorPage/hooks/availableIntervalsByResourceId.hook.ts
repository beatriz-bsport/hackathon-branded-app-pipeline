import { useCallback, useMemo } from 'react';
import { extractResourceIdentifierInformation } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/utils';
import useAvailableResources from './availableResources.hook';

import type {
  AvailableIntervalByCoachId,
  AvailableIntervalByEstablishmentId,
  AvailableResource,
} from '#src/libs/private-service/types';
import { ResourceIdentifier } from '#src/libs/private-service/constants';

/**
 * Custom hook to organize available intervals by resource type (Establishment or Coach).
 *
 * This hook leverages `useAvailableResources` to retrieve available resources within a specified time interval,
 * and organizes the intersecting intervals by `resource_identifier` for each resource type.
 *
 * @returns {object} - Object containing available intervals by resource type:
 *   - `availableIntervalByEstablishmentId`: Mapping of establishment IDs to available intervals.
 *   - `availableIntervalByCoachId`: Mapping of coach IDs to available intervals.
 */
const useAvailableIntervalsByResourceId = () => {
  const availableResources = useAvailableResources();

  const getIntervalsByIdentifier = useCallback(
    (resources: AvailableResource[], identifier: ResourceIdentifier) => {
      if (!resources?.length) return {};
      return resources
        .filter(
          (resource) =>
            extractResourceIdentifierInformation(resource.resource_identifier)
              .identifier === identifier,
        )
        .reduce(
          (intervalsByResourceId, resource) => ({
            ...intervalsByResourceId,
            [extractResourceIdentifierInformation(resource.resource_identifier)
              .id]: resource.availableIntervals,
          }),
          {} as AvailableIntervalByCoachId | AvailableIntervalByEstablishmentId,
        );
    },
    [],
  );

  const availableIntervalsByResource: {
    availableIntervalByEstablishmentId: AvailableIntervalByEstablishmentId;
    availableIntervalByCoachId: AvailableIntervalByCoachId;
  } = useMemo(() => {
    return {
      availableIntervalByEstablishmentId: getIntervalsByIdentifier(
        availableResources,
        ResourceIdentifier.ESTABLISHMENT,
      ),
      availableIntervalByCoachId: getIntervalsByIdentifier(
        availableResources,
        ResourceIdentifier.COACH,
      ),
    };
  }, [getIntervalsByIdentifier, availableResources]);

  return availableIntervalsByResource;
};

export default useAvailableIntervalsByResourceId;
