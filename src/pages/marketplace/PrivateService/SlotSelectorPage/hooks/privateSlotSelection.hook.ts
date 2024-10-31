import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Duration } from 'luxon';
import { useSelector } from 'react-redux';
import { extractResourceIdentifierInformation } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/utils';
import { getPrivateServiceWithDetails } from '#src/libs/private-service/selectors/private-service';
import { getSlotsByDate } from '#src/libs/private-service/selectors/availability-slot';

import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type {
  PrivateService,
  PrivateSlot,
  ResourceSlotsByDate,
} from '#src/libs/private-service/types';
import type { RootState } from '#src/reducers';

import { ResourceIdentifier } from '#src/libs/private-service/constants';

/**
 * Custom hook for handling private slot selection in a booking or scheduling application.
 *
 * This hook retrieves and manages state related to private slot selection, including filtering
 * available slots based on selected establishments and coaches, and computing the duration
 * of the selected slot.
 *
 * @returns {object} - Contains functions and computed data for slot selection:
 *  - `onSelectPrivateSlot` - Callback to set the selected private slot and reset the time interval.
 *  - `filteredAvailableSlots` - Object of available slots filtered by selected establishments or coaches.
 *  - `selectedPrivateSlotDuration` - Duration object representing the length of the selected slot.
 */
const usePrivateSlotSelection = () => {
  const {
    selectedPrivateSlot,
    setSelectedPrivateSlot,
    setSelectedDayTimeInterval,
    selectedEstablishmentsIds,
    selectedCoachesIds,
    serviceId,
  } = useContext(SlotSelectorContext);

  // Retrieve all available slots grouped by date
  const availabilitySlotByDate = useSelector(getSlotsByDate);

  // Access detailed service information from the Redux store based on service ID
  const privateService = useSelector<
    RootState,
    PrivateService<Coach, Establishment, PrivateSlot>
  >((state) => getPrivateServiceWithDetails(state, serviceId));

  /**
   * Callback to select a private slot.
   *
   * Sets the selected private slot in `SlotSelectorContext` and resets the selected day time interval.
   *
   * @param {PrivateSlot} privateSlot - The private slot to be selected.
   */
  const onSelectPrivateSlot = useCallback(
    (privateSlot: PrivateSlot) => {
      setSelectedPrivateSlot(privateSlot);
      setSelectedDayTimeInterval(null);
    },
    [setSelectedDayTimeInterval, setSelectedPrivateSlot],
  );

  /**
   * Filtered available slots by date.
   *
   * Filters slots based on the selected private slot, selected establishments, and selected coaches.
   * Only slots linked to the selected establishments and coaches are returned.
   *
   * @type {ResourceSlotsByDate} - Object of dates as keys and filtered slots as values.
   */
  const filteredAvailableSlots = useMemo(() => {
    if (!selectedPrivateSlot) return {};
    return Object.entries(availabilitySlotByDate)?.reduce<ResourceSlotsByDate>(
      (slotsByDate, [date, resourceSlots]) => {
        const filteredSlots = resourceSlots.filter((resourceSlot) => {
          if (!resourceSlot.slots.length) return false;
          const resourceIdentifierInfo = extractResourceIdentifierInformation(
            resourceSlot.resource_identifier,
          );
          // Filter by coaches if resource identifier matches coach type
          if (resourceIdentifierInfo.identifier === ResourceIdentifier.COACH) {
            return (
              selectedCoachesIds.length === 0 ||
              selectedCoachesIds.includes(resourceIdentifierInfo.id)
            );
          }
          // Filter by establishments for other resources
          return (
            selectedEstablishmentsIds.length === 0 ||
            selectedEstablishmentsIds.includes(resourceIdentifierInfo.id)
          );
        });

        if (filteredSlots.length > 0) {
          slotsByDate[date] = filteredSlots;
        }

        return slotsByDate;
      },
      {},
    );
  }, [
    availabilitySlotByDate,
    selectedCoachesIds,
    selectedEstablishmentsIds,
    selectedPrivateSlot,
  ]);

  /**
   * Computes the duration of the selected private slot.
   *
   * Converts the `duration_minutes` of the selected slot into a Luxon Duration object.
   *
   * @type {Duration} - Luxon Duration representing the length of the selected slot.
   */
  const selectedPrivateSlotDuration = Duration.fromObject({
    minutes: selectedPrivateSlot?.duration_minutes ?? 0,
  });

  // Automatically select the single available slot if only one slot is defined in the service
  useEffect(() => {
    if ((privateService?.slots ?? []).length === 1) {
      onSelectPrivateSlot(privateService.slots[0]);
    }
  }, [privateService, onSelectPrivateSlot]);

  return {
    onSelectPrivateSlot,
    filteredAvailableSlots,
    selectedPrivateSlotDuration,
  };
};

export default usePrivateSlotSelection;
