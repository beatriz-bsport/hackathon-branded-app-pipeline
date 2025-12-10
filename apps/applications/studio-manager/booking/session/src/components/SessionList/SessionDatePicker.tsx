import { modifyTime, toDateTime } from "@bsport/datetime-manipulation";
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
    if (date instanceof Date) {
      setSelectedDate(date);
    } else if (Array.isArray(date)) {
      setSelectedDate([date[0], date[1]]);
    }
  };

  const disableDate = (date: Date, selectedDate: SelectedDate) => {
    const [start, end] = Array.isArray(selectedDate) ? selectedDate : [];

    // Do not disable if the user is starting a new range selection
    if (!start || !!end) return false;

    const dateDT = toDateTime(date);
    const startDT = toDateTime(start);
    const maxDT = modifyTime({
      datetime: startDT,
      duration: { month: 1 },
      operator: "plus",
    });

    return dateDT < startDT || dateDT >= maxDT;
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
