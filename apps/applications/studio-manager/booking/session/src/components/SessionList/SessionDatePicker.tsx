import { useEffect, useState } from "react";

import { type DateTime, modifyTime } from "@bsport/datetime-manipulation";
import {
  DatePicker,
  type SelectedDate as DatePickerSelectedDate,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useToday } from "#src/hooks/use-today";
import {
  selectCalendarView,
  selectSelectedDate,
  setSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { CalendarView, DateSelection } from "#src/types";
import { isInRange } from "#src/utils/dates";

const isSingleDate = (date: DatePickerSelectedDate): date is DateTime =>
  !!(date && !Array.isArray(date));

const isRangeFullySet = (
  date: DatePickerSelectedDate,
): date is [DateTime, DateTime] =>
  !!(Array.isArray(date) && date[0] && date[1]);

const fromSelectedDateToDatePickerValue = (
  selectedDate: DateSelection,
): DatePickerSelectedDate =>
  selectedDate.type === "single"
    ? selectedDate.date
    : [selectedDate.minDate, selectedDate.maxDate];

const getInitialDatePickerValue = (
  selectedDate: DateSelection,
  today: DateTime,
): DatePickerSelectedDate => {
  if (selectedDate.type === "single") {
    return today;
  }
  if (isInRange(today, selectedDate.minDate, selectedDate.maxDate)) {
    return [selectedDate.minDate, selectedDate.maxDate];
  }
  return [today.startOf("week"), today.endOf("week")];
};

export const SessionDatePicker: React.FC = () => {
  const today = useToday();

  const calendarView = useSessionListStore(selectCalendarView);
  const selectedDate = useSessionListStore(selectSelectedDate);
  const [datePickerValue, setDatePickerValue] =
    useState<DatePickerSelectedDate>(
      getInitialDatePickerValue(selectedDate, today),
    );

  useEffect(() => {
    setDatePickerValue(fromSelectedDateToDatePickerValue(selectedDate));
  }, [selectedDate]);

  const onDateChange = (date: DatePickerSelectedDate) => {
    setDatePickerValue(date);

    if (isSingleDate(date) || isRangeFullySet(date)) {
      setSelectedDate(date);
    }
  };

  const disableDate = (
    date: DateTime,
    selectedDate: DatePickerSelectedDate,
  ) => {
    const [start, end] = Array.isArray(selectedDate) ? selectedDate : [];

    // Do not disable if the user is starting a new range selection
    if (!start || !!end) return false;

    const maxDate = modifyTime({
      datetime: start,
      duration: { month: 1 },
      operator: "plus",
    });

    return date < start || date >= maxDate;
  };

  const isMobile = !useMatchMedia("sm");

  return (
    <DatePicker
      id="daily-sessions-picker"
      mode={calendarView === CalendarView.DAILY ? "single" : "range"}
      displayAs="popover"
      onSelect={onDateChange}
      dateFormat={isMobile ? "short" : "medium"}
      dateValue={datePickerValue}
      disableDate={disableDate}
      popoverPlacement="bottom"
    />
  );
};
