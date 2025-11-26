import React, { useState } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";

import Divider from "#src/components/Divider";
import TextField from "#src/components/TextField";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import CalendarHeader from "./CalendarHeader";
import Month from "./Month";

type CalendarRangeProps = {
  id: string;
  years?: number[];
  disableDate?: (date: Date) => boolean;
  selectedDate: [Date | null, Date | null] | null;
  onSelect: (dates: [Date | null, Date | null]) => void;
  hideSelector?: boolean;
};

const CalendarRange: React.FC<CalendarRangeProps> = ({
  id,
  disableDate,
  years,
  selectedDate,
  onSelect,
  hideSelector = false,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [displayMonth, setDisplayMonth] = useState(
    selectedDate?.[0] || new Date(),
  );
  const [errors, setErrors] = useState<[string | null, string | null]>([
    null,
    null,
  ]);

  const handleInputChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(event.target.value);
      if (isNaN(date.getTime())) return;

      const updatedDates: [Date | null, Date | null] = [
        ...(selectedDate || [null, null]),
      ];
      updatedDates[index] = date;

      const [start, end] = updatedDates;
      if (index === 0 && start && end && start > end) {
        setErrors([t("datePicker.invalidStartDate"), null]);
      } else if (index === 1 && start && end && start > end) {
        setErrors([null, t("datePicker.invalidEndDate")]);
      } else {
        setErrors([null, null]);
      }

      onSelect(updatedDates);
    };

  const handleClear = (index: number) => {
    setErrors([null, null]);
    const updatedDates: [Date | null, Date | null] = [
      ...(selectedDate || [null, null]),
    ];
    updatedDates[index] = null;
    onSelect(updatedDates);
  };

  const handleDateSelect = (date: Date) => {
    if (!selectedDate || (!selectedDate[0] && !selectedDate[1])) {
      onSelect([date, null]);
    } else if (selectedDate[0] && !selectedDate[1]) {
      onSelect(
        selectedDate[0] < date
          ? [selectedDate[0], date]
          : [date, selectedDate[0]],
      );
    } else {
      onSelect([date, null]);
    }
    setErrors([null, null]);
  };

  return (
    <div className="flex flex-col gap-md w-fit">
      {!hideSelector && (
        <div className="flex gap-md">
          <TextField
            className="min-w-[171px]"
            id={`calendar-date-input-${id}`}
            label={t("datePicker.startDate")}
            type="date"
            value={selectedDate?.[0] ? getIsoDateString(selectedDate[0]) : ""}
            iconLeft="calendar"
            status={errors[0] ? "error" : "default"}
            statusText={errors[0] || ""}
            onChange={handleInputChange(0)}
            onClear={() => handleClear(0)}
          />
          <TextField
            className="min-w-[171px]"
            id={`calendar-date-input-end-${id}`}
            label={t("datePicker.endDate")}
            type="date"
            value={selectedDate?.[1] ? getIsoDateString(selectedDate[1]) : ""}
            iconLeft="calendar"
            status={errors[1] ? "error" : "default"}
            statusText={errors[1] || ""}
            onChange={handleInputChange(1)}
            onClear={() => handleClear(1)}
          />
        </div>
      )}

      <CalendarHeader
        displayMonth={displayMonth}
        mode="range"
        years={years}
        onSelect={setDisplayMonth}
      />

      <div className="flex gap-md">
        <Month
          displayMonth={displayMonth}
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          disableDate={disableDate}
        />
        <Divider orientation="vertical" weight="thin" />
        <Month
          displayMonth={
            new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1)
          }
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          disableDate={disableDate}
        />
      </div>
    </div>
  );
};

export default CalendarRange;
