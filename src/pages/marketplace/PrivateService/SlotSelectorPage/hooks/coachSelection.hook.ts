import { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { getPrivateServiceWithDetails } from '#src/libs/private-service/selectors/private-service';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type {
  PrivateService,
  PrivateSlot,
} from '#src/libs/private-service/types';
import type { RootState } from '#src/reducers';

import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';

/**
 * Custom hook for managing coach selection in the context of a booking or scheduling system.
 *
 * This hook provides the logic for selecting coaches in the `SlotSelectorContext`. It retrieves
 * relevant service details from the Redux store, applies necessary transformations, and controls
 * whether a coach selector should be displayed based on the state and service attributes.
 *
 * @returns {object} - Returns functions and state flags related to coach selection:
 *  - `onSelectCoaches` - Callback to set selected coach IDs.
 *  - `showCoachSelector` - Boolean flag indicating whether the coach selector should be displayed.
 */
const useCoachSelection = () => {
  // Destructure context values for setting coach-related state
  const { setSelectedCoachesIds, setSelectedDayTimeInterval, serviceId } =
    useContext(SlotSelectorContext);

  // Retrieve `privateService` from the Redux store, which includes detailed info.
  const privateService = useSelector<
    RootState,
    PrivateService<Coach, Establishment, PrivateSlot>
  >((state) => getPrivateServiceWithDetails(state, serviceId));

  const coaches = useMemo(
    () => privateService?.coaches?.filter((coach) => !!coach?.id) ?? [],
    [privateService?.coaches],
  );

  /**
   * Callback for handling coach selection.
   *
   * This function is invoked when a user selects or changes their selected coaches. It sets the
   * `selectedCoachesIds` state in `SlotSelectorContext` with the selected coach IDs and resets
   * the selected day time interval to `null` to indicate no specific time has been chosen.
   *
   * @param {Array<{label: string, value: number, coachList?: Coach[]}>} coachOptions - Array of coach options, each containing a label, value, and optional coach list.
   */
  const onSelectCoaches = useCallback(
    (coachOptions: { label: string; value: number; coachList?: Coach[] }[]) => {
      const coachIds = coachOptions.map((coachOption) => coachOption.value);
      setSelectedCoachesIds(coachIds);
      setSelectedDayTimeInterval(null);
    },
    [setSelectedCoachesIds, setSelectedDayTimeInterval],
  );

  /**
   * Determines whether the coach selector should be displayed.
   *
   * `showCoachSelector` becomes `true` when the `privateService` has a list of coaches and the
   * coach attribution policy is set to `RESOURCE_ATTRIBUTION_CONSUMER`. Additionally, each coach
   * in the `privateService.coaches` list must contain at least one defined property.
   *
   * @type {boolean}
   */
  const showCoachSelector =
    !!privateService?.coaches?.length &&
    privateService?.coach_attribution === RESOURCE_ATTRIBUTION_CONSUMER &&
    privateService?.coaches?.some((coach) => !!Object.keys(coach).length);

  return {
    coaches,
    onSelectCoaches,
    showCoachSelector,
  };
};

export default useCoachSelection;
