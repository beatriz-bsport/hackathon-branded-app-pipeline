import { useContext, useMemo } from 'react';
import { getIntersectingSlots } from '#src/libs/private-service/interval-utils';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { usePrivateSlotSelection } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';
import type { AvailableResource } from '#src/libs/private-service/types';
import { Duration, Interval } from 'luxon';

/**
 * Custom hook for retrieving available resources within a selected day and time interval.
 *
 * This hook filters available resources based on the `selectedDayTimeInterval` from `SlotSelectorContext`
 * and computes intersections between available slots and the selected time interval.
 *
 * @returns {AvailableResource[]} - Array of available resources, each containing:
 *   - `resource_identifier`: Unique identifier for the resource (e.g., coach or establishment).
 *   - `availableIntervals`: Array of intersecting time intervals between available slots and the selected day interval.
 */
const useAvailableResources = () => {
  const { selectedDayTimeInterval, selectedPrivateSlot } =
    useContext(SlotSelectorContext);
  const { filteredAvailableSlots } = usePrivateSlotSelection();

  return useMemo(() => {
    if (!selectedDayTimeInterval) return []; // No selection made, return an empty array

    const availableResources: AvailableResource[] = [];
    const startDate = selectedDayTimeInterval.start.toISODate();

    /*
     * Example : selectedPrivateSlot.duration_minutes = 60mn
     * We want a session starting at 11:20 and ending at 12:20
     * being included in the morning DayTimeInterval, even if it ends
     * at 12:00.
     * extendedEndDateTime allows us to do that without having to
     * consider the starting time of the session as reference.
     */
    const extendedEndDateTime = selectedDayTimeInterval.end.plus(
      Duration.fromObject({ minutes: selectedPrivateSlot?.duration_minutes }),
    );

    const extendedSelectedDayTimeInterval = Interval.fromDateTimes(
      selectedDayTimeInterval.start,
      extendedEndDateTime,
    );

    // Filter slots based on date and time intersection with selectedDayTimeInterval
    filteredAvailableSlots?.[startDate]?.forEach((resourceSlot) =>
      availableResources.push({
        resource_identifier: resourceSlot.resource_identifier,
        availableIntervals: getIntersectingSlots(
          extendedSelectedDayTimeInterval,
          resourceSlot.slots,
        ),
      }),
    );

    return availableResources;
  }, [
    filteredAvailableSlots,
    selectedDayTimeInterval,
    selectedPrivateSlot?.duration_minutes,
  ]);
};

export default useAvailableResources;
