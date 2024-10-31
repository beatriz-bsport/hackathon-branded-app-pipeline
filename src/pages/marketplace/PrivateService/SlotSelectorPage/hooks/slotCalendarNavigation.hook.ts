import { DateTime, Interval } from 'luxon';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { useSelector } from 'react-redux';
import {
  getNextDateAvailableSlot,
  getSlotsByDateLoading,
} from '#src/libs/private-service/selectors/availability-slot';
import { useTranslation } from 'react-i18next';
import usePrivateSlotSelection from './privateSlotSelection.hook';

import type { RootState } from '#src/reducers';

/**
 * Custom hook to manage slot calendar navigation functionality.
 *
 * This hook provides date navigation functionality for a calendar, such as selecting
 * previous or next dates, navigating to the first available session, and displaying
 * calendar-related information. It uses context for accessing and updating slot-related
 * state and pulls in additional information from Redux.
 *
 * @returns {Object} Returns an object with:
 * - `datesToDisplay` {DateTime[]} - Array of dates to be shown in the calendar view.
 *
 *
 * - `goToFirstAvailableSession` {() => void} - Callback to jump to the first available session based on availability.
 * - `isCalendarLoading` {boolean} - Flag indicating whether calendar data is still loading.
 * - `isEmptyCalendar` {boolean} - Flag indicating whether the calendar has any available slots.
 * - `isWithoutNextAvailableSlot` {boolean} - Flag indicating if there's no upcoming slot available.
 * - `nextDateAvailableLabel` {string} - Label showing the next available slot's date and time.
 * - `onSelectDayTimeInterval` {(dayTimeInterval: Interval) => () => void} - Callback to select a time interval for a day.
 * - `availableSlotFromPreviousWeeksLabel` {string} - Label showing the previous available slot's date and time.
 * - `selectNextDate` {() => void} - Callback to advance to the next date in the calendar view.
 * - `selectPreviousDate` {() => void} - Callback to go back to the previous date in the calendar view.
 * - `shouldDisplayAvailableSlotFromPreviousWeeks` {boolean} - Flag to show the previous available slot indicator.
 */
const useSlotCalendarNavigation = () => {
  const { t } = useTranslation('privateService');

  // SlotSelectorContext values and setters for managing calendar states
  const {
    getCalendarDateRange, // Callback to retrieve the range of dates in the calendar
    numberOfDayToShow, // Number of days displayed in the calendar view
    selectedDate, // Currently selected date in the calendar
    selectedPrivateSlot, // Currently selected private slot, if any
    setCalendarDateRange, // Setter to update the date range in the calendar
    setSelectedDate, // Setter to update selected date
    setSelectedDayTimeInterval, // Setter to update the selected time interval for a day
  } = useContext(SlotSelectorContext);

  // Get next available date from Redux for slot availability
  const nextDateAvailableSlot = useSelector(getNextDateAvailableSlot);

  // Loading states from Redux for both general slots and next available slots
  const availableSlotsLoading = useSelector<RootState, boolean>(
    getSlotsByDateLoading,
  );
  const nextAvailableSlotLoading = useSelector<RootState, boolean>(
    (state) => state.privateService.availabilitySlot.next.loading,
  );

  // Filtered slots by resource identifiers, coaches, and establishments, it's an object of resource slots organized by date.
  const { filteredAvailableSlots } = usePrivateSlotSelection();

  /**
   * Callback to handle changes in selected date.
   * Updates selected date, calendar date range, and resets day time interval selection.
   *
   * @param {DateTime} date - The date to switch to in the calendar
   */
  const onChangeDate = useCallback(
    (date: DateTime) => {
      setSelectedDate(date);
      const newCalendarDateRange = getCalendarDateRange(date);
      setCalendarDateRange(newCalendarDateRange);
      setSelectedDayTimeInterval(null);
    },
    [
      getCalendarDateRange,
      setSelectedDate,
      setCalendarDateRange,
      setSelectedDayTimeInterval,
    ],
  );

  /**
   * Moves the calendar backward by the specified `numberOfDayToShow`.
   */
  const selectPreviousDate = useCallback(() => {
    const newDate = selectedDate.minus({ days: numberOfDayToShow });
    onChangeDate(newDate);
  }, [numberOfDayToShow, onChangeDate, selectedDate]);

  /**
   * Moves the calendar forward by the specified `numberOfDayToShow`.
   */
  const selectNextDate = useCallback(() => {
    const newDate = selectedDate.plus({ days: numberOfDayToShow });
    onChangeDate(newDate);
  }, [numberOfDayToShow, onChangeDate, selectedDate]);

  /**
   * Selects a specific day time interval, usually indicating a specific time slot within a day.
   *
   * @param {Interval} dayTimeInterval - The time interval to select
   */
  const onSelectDayTimeInterval = useCallback(
    (dayTimeInterval: Interval) => () => {
      setSelectedDayTimeInterval(dayTimeInterval);
    },
    [setSelectedDayTimeInterval],
  );

  /**
   * Navigates the calendar to the first available session, if there is one.
   * Parses the next available slot date from Redux and updates the selected date.
   */
  const goToFirstAvailableSession = useCallback(() => {
    const dateTime = DateTime.fromISO(nextDateAvailableSlot);
    onChangeDate(dateTime);
  }, [nextDateAvailableSlot, onChangeDate]);

  // List of dates to display in the slot calendar, generated based on the selected date.
  const datesToDisplay = useMemo(
    () =>
      Array.from({ length: numberOfDayToShow }, (_, index) =>
        selectedDate.plus({ days: index }),
      ),
    [numberOfDayToShow, selectedDate],
  );

  /**
   * Determines if a previous available slot should be shown, used in the slot calendar
   * to display the button that triggers goToFirstAvailableSession.
   */
  const shouldDisplayAvailableSlotFromPreviousWeeks =
    !!selectedPrivateSlot &&
    nextDateAvailableSlot !== null &&
    DateTime.fromISO(nextDateAvailableSlot) < selectedDate;

  // Label displaying the previous available slot date and time, formatted for display.
  const availableSlotFromPreviousWeeksLabel = t('slotSearcher.previousOffer', {
    date: DateTime.fromISO(nextDateAvailableSlot).toLocaleString(
      DateTime.DATE_SHORT,
    ),
    hour: DateTime.fromISO(nextDateAvailableSlot).toLocaleString(
      DateTime.TIME_SIMPLE,
    ),
  });

  // Checks if the calendar is empty by evaluating if there are any slots available.
  const isEmptyCalendar =
    !!selectedPrivateSlot &&
    !availableSlotsLoading &&
    !Object.values(filteredAvailableSlots).some((resourceSlots) =>
      resourceSlots.some((resourceSlot) => resourceSlot.slots.length > 0),
    );

  // Indicates if there is no next available slot, if true we display a message in the calendar.
  const isWithoutNextAvailableSlot = !nextDateAvailableSlot;

  // Label for the next available slot, showing the date and time.
  const nextDateAvailableLabel = t('slotSearcher.nextOffer', {
    date: DateTime.fromISO(nextDateAvailableSlot).toLocaleString(
      DateTime.DATE_SHORT,
    ),
    hour: DateTime.fromISO(nextDateAvailableSlot).toLocaleString(
      DateTime.TIME_SIMPLE,
    ),
  });

  // Combines loading flags from both general slots and the next available slot.
  const isCalendarLoading = availableSlotsLoading || nextAvailableSlotLoading;

  /**
   * Effect to reset the selected day time interval whenever the `numberOfDayToShow`
   * changes, ensuring time intervals reset on view updates.
   */
  useEffect(() => {
    setSelectedDayTimeInterval(null);
  }, [numberOfDayToShow, setSelectedDayTimeInterval]);

  return {
    datesToDisplay,
    goToFirstAvailableSession,
    isCalendarLoading,
    isEmptyCalendar,
    isWithoutNextAvailableSlot,
    nextDateAvailableLabel,
    onSelectDayTimeInterval,
    availableSlotFromPreviousWeeksLabel,
    selectNextDate,
    selectPreviousDate,
    shouldDisplayAvailableSlotFromPreviousWeeks,
  };
};

export default useSlotCalendarNavigation;
