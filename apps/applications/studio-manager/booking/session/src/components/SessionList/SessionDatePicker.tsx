import { DatePicker } from "@bsport/kaizen-primitive-core";

import {
  selectCalendarView,
  selectSelectedDate,
  setSelectedDate,
  useSessionListStore,
} from "../../stores/session-list";

export const SessionDatePicker: React.FC = () => {
  const calendarView = useSessionListStore(selectCalendarView);
  const selectedDate = useSessionListStore(selectSelectedDate);

  const onDateChange = (date: Date | [Date | null, Date | null] | null) => {
    if (date instanceof Date) {
      setSelectedDate(date);
    } else if (Array.isArray(date) && date[0] && date[1]) {
      setSelectedDate([date[0], date[1]]);
    }
  };

  return (
    <div className="flex pt-sm px-sm justify-center">
      <DatePicker
        id="daily-sessions-picker"
        mode={calendarView === "daily" ? "single" : "range"}
        displayAs="popover"
        onSelect={onDateChange}
        dateFormat="medium"
        defaultValue={
          selectedDate.type === "single"
            ? selectedDate.date
            : [selectedDate.minDate, selectedDate.maxDate]
        }
      />
    </div>
  );
};
