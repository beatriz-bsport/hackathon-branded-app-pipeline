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
    } else if (Array.isArray(date) && date[0] && date[1]) {
      setSelectedDate([date[0], date[1]]);
    }
  };

  const disableDate = (date: Date, selectedDate: SelectedDate) => {
    const [start] = Array.isArray(selectedDate) ? selectedDate : [];

    if (!start) return false;

    const dateDT = toDateTime(date);
    const startDT = toDateTime(start);
    const maxDT = modifyTime({
      datetime: startDT,
      duration: { month: 1 },
      operator: "plus",
    });

    return dateDT < startDT || dateDT >= maxDT;
  };

  return (
    <div className="flex pt-sm px-sm justify-center">
      <DatePicker
        id="daily-sessions-picker"
        mode={calendarView === CalendarView.DAILY ? "single" : "range"}
        displayAs="popover"
        onSelect={onDateChange}
        dateFormat="medium"
        defaultValue={
          selectedDate.type === "single"
            ? selectedDate.date
            : [selectedDate.minDate, selectedDate.maxDate]
        }
        disableDate={disableDate}
      />
    </div>
  );
};
