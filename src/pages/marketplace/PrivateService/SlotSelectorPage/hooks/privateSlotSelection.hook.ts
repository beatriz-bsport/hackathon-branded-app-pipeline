import { useCallback, useContext, useMemo } from 'react';
import { Duration } from 'luxon';
import { useSelector } from 'react-redux';
import { getSlotsByDate } from '#src/libs/private-service/selectors/availability-slot';

import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';

import type {
  PrivateSlot,
  ResourceSlotsByDate,
} from '#src/libs/private-service/types';

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
  } = useContext(SlotSelectorContext);

  // Retrieve all available slots grouped by date
  const availabilitySlotByDate = useSelector(getSlotsByDate);

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
        const filteredSlots = resourceSlots.filter(
          (resourceSlot) => resourceSlot.slots.length,
        );
        if (filteredSlots.length > 0) {
          slotsByDate[date] = filteredSlots;
        }

        return slotsByDate;
      },
      {},
    );
  }, [availabilitySlotByDate, selectedPrivateSlot]);
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

  return {
    onSelectPrivateSlot,
    filteredAvailableSlots,
    selectedPrivateSlotDuration,
  };
};

export default usePrivateSlotSelection;
