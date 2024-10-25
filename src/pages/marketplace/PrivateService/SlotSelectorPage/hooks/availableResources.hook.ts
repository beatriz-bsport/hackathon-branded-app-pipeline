import { useContext, useMemo } from 'react';
import { getIntersectingSlots } from '#src/libs/private-service/interval-utils';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { usePrivateSlotSelection } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';
import type { AvailableResource } from '#src/libs/private-service/types';

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
  const { selectedDayTimeInterval } = useContext(SlotSelectorContext);
  const { filteredAvailableSlots } = usePrivateSlotSelection();

  return useMemo(() => {
    if (!selectedDayTimeInterval) return []; // No selection made, return an empty array

    const availableResources: AvailableResource[] = [];
    const startDate = selectedDayTimeInterval.start.toISODate();

    // Filter slots based on date and time intersection with selectedDayTimeInterval
    filteredAvailableSlots?.[startDate]?.forEach((resourceSlot) =>
      availableResources.push({
        resource_identifier: resourceSlot.resource_identifier,
        availableIntervals: getIntersectingSlots(
          selectedDayTimeInterval,
          resourceSlot.slots,
        ),
      }),
    );

    return availableResources;
  }, [filteredAvailableSlots, selectedDayTimeInterval]);
};

export default useAvailableResources;
