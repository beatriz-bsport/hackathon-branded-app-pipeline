import React, { useEffect, useRef, useState } from "react";

import { type DateTime, getLocalNow } from "@bsport/datetime-manipulation";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import CalendarHeader from "./CalendarHeader";
import DateInputField from "./DateInputField";
import type { SelectedDate } from "./DatePicker";
import Month from "./Month";

type CalendarSingleProps = {
  id: string;
  years?: number[];
  disableDate?: (date: DateTime, selectedDate: SelectedDate) => boolean;
  selectedDate: DateTime | null;
  onSelect: (date: DateTime | null) => void;
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
  const timezone = getCompanyTimezone();
  const [displayMonth, setDisplayMonth] = useState<DateTime>(
    getLocalNow({ zone: timezone }),
  );
  const isInputChange = useRef(false);

  useEffect(() => {
    // Same as in DateInputField: to avoid syncing inputValue from selectedDate when
    // the change originated from the input itself, preventing a visual "reset" or flicker during typing.
    if (isInputChange.current) {
      isInputChange.current = false;
      return;
    }
    if (!selectedDate) return;
    setDisplayMonth(selectedDate.startOf("month"));
  }, [selectedDate]);

  const handleDateSelect = (date: DateTime) => {
    onSelect(date);
  };

  return (
    <div
      data-component="Kaizen-DatePicker-CalendarSingle"
      className="flex flex-col gap-md w-fit"
    >
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
