import {
  DatePicker,
  type SelectedDate as DatePickerSelectedDate,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import {
  selectSelectedDate,
  setAnchorDate,
  useCalendarStore,
} from "#src/stores/calendar";
import { getAnchorDate } from "#src/stores/calendar/selection";

type CalendarDatePickerProps = {
  onDateSelectionChange?: () => void;
};

export const CalendarDatePicker = ({
  onDateSelectionChange,
}: CalendarDatePickerProps) => {
  const selectedDate = useCalendarStore(selectSelectedDate);
  const dateValue = getAnchorDate(selectedDate);

  const onSelect = (date: DatePickerSelectedDate) => {
    if (date && !Array.isArray(date)) {
      setAnchorDate(date);
      onDateSelectionChange?.();
    }
  };

  const isMobile = !useMatchMedia("sm");

  return (
    <DatePicker
      id="daily-sessions-picker"
      mode="single"
      displayAs="popover"
      onSelect={onSelect}
      dateFormat={isMobile ? "short" : "medium"}
      dateValue={dateValue}
      popoverPlacement="bottom"
    />
  );
};
