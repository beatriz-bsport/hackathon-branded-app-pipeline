import React, { useCallback, useContext, useMemo } from 'react';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import useAvailabilityByEstablishmentIdAndCoachId from './availabilityByEstablishmentIdAndCoachId.hook';

import type { Establishment } from '#src/libs/establishment/types';
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods.js';
import { SlotSelectorStoreContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelectorStore.context';

/**
 * Custom hook for managing establishment selection within a booking or scheduling context.
 *
 * This hook provides logic for selecting establishments in the `SlotSelectorContext`. It retrieves
 * relevant service details from the Redux store, applies transformations, and manages the visibility
 * of the establishment selector based on the current state and service attributes.
 *
 * @returns {object} - Functions and state flags for establishment selection:
 *  - `onSelectEstablishment` - Callback to set selected establishment IDs.
 *  - `showEstablishmentSelector` - Boolean flag indicating whether the establishment selector should be displayed.
 */
const useEstablishmentSelection = () => {
  // Access context functions for setting establishment-related states
  const {
    setSelectedEstablishmentsIds,
    setSelectedDayTimeInterval,
    setActiveEstablishment,
    selectedEstablishmentsIds,
    selectedPrivateSlot,
  } = useContext(SlotSelectorContext);

  const { privateService } = useContext(SlotSelectorStoreContext);

  const availabilityByEstablishmentAndCoach =
    useAvailabilityByEstablishmentIdAndCoachId();

  /**
   * Callback for handling establishment selection.
   *
   * This function updates the `selectedEstablishmentsIds` state in `SlotSelectorContext` based on
   * the selected establishments and resets the selected day time interval to `null`, indicating no
   * specific time has been chosen.
   *
   * @param {Array<{label: string, value: number, establishmentList?: Establishment[]}>} establishmentOptions - Array of establishment options, each containing a label, value, and optional list of establishments.
   */
  const onSelectEstablishment = useCallback(
    (
      establishmentOptions: {
        label: string;
        value: number;
        establishmentList?: Establishment[];
      }[],
    ) => {
      const establishmentIds = establishmentOptions.map(
        (establishmentOption) => establishmentOption.value,
      );
      setSelectedEstablishmentsIds(establishmentIds);
      setSelectedDayTimeInterval(null);
    },
    [setSelectedEstablishmentsIds, setSelectedDayTimeInterval],
  );

  /**
   * Determines if the establishment selector should be displayed.
   *
   * `showEstablishmentSelector` is `true` when:
   * - `privateService` contains multiple establishments,
   * - the service is not configured for home service (`is_home_service` is `false`),
   * - establishment attribution policy is set to `RESOURCE_ATTRIBUTION_CONSUMER`, and
   * - each establishment in the `privateService.establishments` list has at least one defined property.
   *
   * @type {boolean}
   */
  const showEstablishmentSelector =
    !!privateService &&
    privateService.establishments?.length > 1 &&
    !privateService.is_home_service &&
    privateService.establishment_attribution ===
      RESOURCE_ATTRIBUTION_CONSUMER &&
    privateService?.establishments?.some(
      (establishment) => !!Object.keys(establishment).length,
    );

  const establishments = useMemo(
    () => privateService?.establishments ?? [],
    [privateService?.establishments],
  );

  const selectedAssociatedEstablishmentsIds = establishments
    .filter(({ id }) => selectedEstablishmentsIds.includes(id))
    .map(({ associatedestablishment_set }) => associatedestablishment_set?.[0])
    ?.filter(Boolean);

  /**Memoized array of establishments that have available slots based
   * on availabilityByEstablishmentAndCoach. This array is filtered to
   * include only establishments with at least one availability window
   * long enough to fit the selected session duration.
   */
  const availableEstablishments = useMemo(
    () =>
      establishments.filter((establishment) => {
        const associatedEstablishmentId =
          establishment.associatedestablishment_set?.[0];
        if (!associatedEstablishmentId) {
          return false;
        }
        const availabilities =
          availabilityByEstablishmentAndCoach[associatedEstablishmentId]
            ?.establishmentAvailabilities;
        const durationMinutes = selectedPrivateSlot?.duration_minutes ?? 0;
        return availabilities?.some(
          (interval) => interval.length('minutes') >= durationMinutes,
        );
      }),
    [availabilityByEstablishmentAndCoach, establishments, selectedPrivateSlot],
  );

  /**
   * Callback function to handle the selection of an establishment.
   * When triggered (e.g., by a tab change), it finds the establishment
   * with the specified activeEstablishmentId from availableEstablishments
   * and sets it as the new activeEstablishment.
   */
  const handleSelectEstablishment = useCallback(
    (event: React.ChangeEvent<{}>, activeEstablishmentId: number) => {
      const newActiveEstablishment = availableEstablishments.find(
        (establishment) => establishment.id === activeEstablishmentId,
      );
      setActiveEstablishment(newActiveEstablishment);
    },
    [availableEstablishments, setActiveEstablishment],
  );

  return {
    establishments,
    onSelectEstablishment,
    showEstablishmentSelector,
    availableEstablishments,
    handleSelectEstablishment,
    selectedAssociatedEstablishmentsIds,
  };
};

export default useEstablishmentSelection;
