import React, { useCallback, useEffect, useRef, useState } from "react";

import { getIsoDateString, isValidDate } from "@bsport/datetime-manipulation";

import TextField from "#src/components/TextField";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

type DateInputFieldProps = {
  id: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  onClick?: () => void;
};

const DateInputField: React.FC<DateInputFieldProps> = ({
  id,
  selectedDate,
  onDateChange,
  onClick,
}: DateInputFieldProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [inputValue, setInputValue] = useState(
    selectedDate ? getIsoDateString(selectedDate) : "",
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
    setInputValue(selectedDate ? getIsoDateString(selectedDate) : "");
  }, [selectedDate]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value.length > 0 && value.split("-")[0].length > 4) return;

      setInputValue(value);

      if (isValidDate(value)) {
        const newDate = new Date(value);
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

  return (
    <TextField
      className="min-w-[171px]"
      type="date"
      id={`calendar-date-input-${id}`}
      status={!inputValue || isValidDate(inputValue) ? "default" : "error"}
      value={inputValue}
      // TODO: remove hardcoded label
      label={t("datePicker.selectedDay")}
      iconLeft="calendar"
      onChange={handleChange}
      onClear={handleClear}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    />
  );
};

export default DateInputField;
