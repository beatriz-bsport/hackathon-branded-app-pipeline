import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  type DateTime,
  fromIsoString,
  getIsoDate,
  isValidDate,
} from "@bsport/datetime-manipulation";

import TextField, { type TextFieldProps } from "#src/components/TextField";

type DateInputFieldProps = {
  id: string;
  selectedDate: DateTime | null;
  onDateChange: (date: DateTime | null) => void;
  onClick?: () => void;
  required?: boolean;
} & Pick<TextFieldProps, "required" | "statusText" | "label" | "status">;

const DateInputField: React.FC<DateInputFieldProps> = ({
  id,
  selectedDate,
  onDateChange,
  onClick,
  label,
  required,
  statusText,
  status,
}: DateInputFieldProps) => {
  const [inputValue, setInputValue] = useState(
    selectedDate ? getIsoDate(selectedDate) : "",
  );
  const isInputChange = useRef(false);

  /**
   * When a date is selected, this effect updates the calendar to display
   * the month containing that date, but only if the change wasn't triggered
   * by direct input (tracked by isInputChange ref).
   *
   * This prevents circular updates when the user is manually navigating
   * through the calendar interface.
   */
  useEffect(() => {
    if (isInputChange.current) {
      isInputChange.current = false;
      return;
    }
    setInputValue(selectedDate ? getIsoDate(selectedDate) : "");
  }, [selectedDate]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value.length > 0 && value.split("-")[0].length > 4) return;

      setInputValue(value);

      if (isValidDate(value)) {
        const newDate = fromIsoString(value);
        isInputChange.current = true;
        onDateChange(newDate);
      } else if (value === "") {
        onDateChange(null);
      }
    },
    [onDateChange],
  );

  const handleClear = () => {
    setInputValue("");
    onDateChange(null);
  };

  const getStatus = (): TextFieldProps["status"] => {
    if (inputValue && !isValidDate(inputValue)) {
      return "error";
    }

    if (status) {
      return status;
    }

    return "default";
  };

  return (
    <TextField
      className="min-w-[171px]"
      type="date"
      id={`calendar-date-input-${id}`}
      status={getStatus()}
      value={inputValue}
      label={label}
      iconLeft="calendar"
      onChange={handleChange}
      onClear={handleClear}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      required={required}
      statusText={statusText}
    />
  );
};

export default DateInputField;
