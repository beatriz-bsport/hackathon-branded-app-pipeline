import React, { useEffect, useRef, useState } from "react";

import CalendarHeader from "./CalendarHeader";
import DateInputField from "./DateInputField";
import type { SelectedDate } from "./DatePicker";
import Month from "./Month";

type CalendarSingleProps = {
  id: string;
  years?: number[];
  disableDate?: (date: Date, selectedDate: SelectedDate) => boolean;
  selectedDate: Date | null;
  onSelect: (date: Date | null) => void;
  hideSelector?: boolean;
};

const CalendarSingle: React.FC<CalendarSingleProps> = ({
  id,
  years,
  disableDate,
  selectedDate,
  onSelect,
  hideSelector = false,
}) => {
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const isInputChange = useRef(false);

  useEffect(() => {
    // Same as in DateInputField: to avoid syncing inputValue from selectedDate when
    // the change originated from the input itself, preventing a visual "reset" or flicker during typing.
    if (isInputChange.current) {
      isInputChange.current = false;
      return;
    }
    if (!selectedDate) return;
    setDisplayMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    onSelect(date);
  };

  return (
    <div className="flex flex-col gap-md w-fit">
      {!hideSelector && (
        <DateInputField
          id={id}
          selectedDate={selectedDate}
          onDateChange={onSelect}
        />
      )}

      <CalendarHeader
        displayMonth={displayMonth}
        mode="single"
        years={years}
        onSelect={setDisplayMonth}
      />

      <Month
        displayMonth={displayMonth}
        selectedDate={selectedDate}
        onSelect={handleDateSelect}
        disableDate={disableDate}
      />
    </div>
  );
};

export default CalendarSingle;
