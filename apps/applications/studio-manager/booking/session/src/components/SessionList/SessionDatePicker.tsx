import { DateTime, modifyTime } from "@bsport/datetime-manipulation";
import { DatePicker, type SelectedDate } from "@bsport/kaizen-primitive-core";

import {
  CalendarView,
  selectCalendarView,
  selectSelectedDate,
  setSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";

export const SessionDatePicker: React.FC = () => {
  const calendarView = useSessionListStore(selectCalendarView);
  const selectedDate = useSessionListStore(selectSelectedDate);

  const onDateChange = (date: SelectedDate) => {
    if (!date) return;
    if (Array.isArray(date)) {
      setSelectedDate([date[0], date[1]]);
    } else {
      setSelectedDate(date);
    }
  };

  const disableDate = (date: DateTime, selectedDate: SelectedDate) => {
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

  const datePickerValue: SelectedDate =
    selectedDate.type === "single"
      ? selectedDate.date
      : [selectedDate.minDate, selectedDate.maxDate];

  return (
    <DatePicker
      id="daily-sessions-picker"
      mode={calendarView === CalendarView.DAILY ? "single" : "range"}
      displayAs="popover"
      onSelect={onDateChange}
      dateFormat="medium"
      dateValue={datePickerValue}
      disableDate={disableDate}
    />
  );
};
