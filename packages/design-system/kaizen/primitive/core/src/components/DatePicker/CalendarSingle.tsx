import React, { useEffect, useRef, useState } from "react";

import type { WeekStartDay } from "@bsport/datetime-manipulation";

import CalendarHeader from "./CalendarHeader";
import DateInputField from "./DateInputField";
import Month from "./Month";

type CalendarSingleProps = {
  id: string;
  weekStartDay: WeekStartDay;
  years?: number[];
  disableDate?: (date: Date) => boolean;
  selectedDate: Date | null;
  onSelect: (date: Date | null) => void;
  hideSelector?: boolean;
};

const CalendarSingle: React.FC<CalendarSingleProps> = ({
  id,
  weekStartDay,
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
        weekStartDay={weekStartDay}
        disableDate={disableDate}
      />
    </div>
  );
};

export default CalendarSingle;
