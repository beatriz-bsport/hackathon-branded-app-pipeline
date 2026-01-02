import React, { useMemo } from "react";

import {
  DateTime,
  getLocalNow,
  getMonths,
} from "@bsport/datetime-manipulation";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import Button from "#src/components/Button";
import Select from "#src/components/Select";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const MIN_ABBREVIATION_LENGTH = 3;
const YEARS_RANGE = 11;
const YEARS_OFFSET = 5;
const BASE_MONTH_COUNT = 12;

type CalendarHeaderProps = {
  displayMonth: DateTime;
  mode: "single" | "range";
  years?: number[];
  onSelect: (date: DateTime) => void;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayMonth,
  mode,
  years,
  onSelect,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const handlePrevMonth = () => onSelect(displayMonth.minus({ months: 1 }));

  const handleNextMonth = () => onSelect(displayMonth.plus({ months: 1 }));

  const handleMonthChange = (id: string) => {
    const monthIndex = months.indexOf(id);
    if (monthIndex >= 0) {
      // Luxon months are 1-indexed
      onSelect(displayMonth.set({ month: monthIndex + 1, day: 1 }));
    }
  };

  const handleYearChange = (id: string) =>
    onSelect(displayMonth.set({ year: parseInt(id, 10), day: 1 }));

  const timezone = getCompanyTimezone();
  const currentYear = getLocalNow({ zone: timezone }).year;
  const yearsRendered =
    years ||
    Array.from(
      { length: YEARS_RANGE },
      (_, i) => currentYear - YEARS_OFFSET + i,
    );

  const months = useMemo(
    () => getMonths("long", i18nInstance?.language),
    [i18nInstance?.language],
  );

  const selectLabel = useMemo(() => {
    // Luxon months are 1-indexed
    const month = months[displayMonth.month - 1];
    if (!month) return "";
    return month.length > MIN_ABBREVIATION_LENGTH
      ? month.slice(0, MIN_ABBREVIATION_LENGTH) + "."
      : month;
  }, [displayMonth, months]);

  const getMonthYearDisplay = (delta: number) => {
    const monthIndex = (displayMonth.month - 1 + delta) % BASE_MONTH_COUNT;
    const yearDelta =
      displayMonth.month - 1 + delta >= BASE_MONTH_COUNT ? 1 : 0;
    return `${months[monthIndex]} ${displayMonth.year + yearDelta}`;
  };

  return (
    <div
      data-component="Kaizen-DatePicker-CalendarHeader"
      className="flex justify-between items-center self-stretch"
    >
      {mode === "single" ? (
        <div className="flex center gap-xs">
          <Select
            className={`min-w-[73px]`}
            value={selectLabel}
            items={months.map((month, idx) => ({
              id: String(idx),
              label: month,
            }))}
            onSelect={handleMonthChange}
          />
          <Select
            className={`min-w-[82px]`}
            value={String(displayMonth.year)}
            items={yearsRendered.map((year) => ({
              id: String(year),
              label: String(year),
            }))}
            onSelect={handleYearChange}
          />
        </div>
      ) : (
        <div className="flex">
          <div className={`flex center gap-xs w-[258px]`}>
            {getMonthYearDisplay(0)}
          </div>
          <div className="flex center gap-xs">{getMonthYearDisplay(1)}</div>
        </div>
      )}

      <div className="flex items-center gap-2xs">
        <Button
          kind="icon-button"
          intent="flat"
          color="default"
          size="sm"
          icon="chevron-left"
          label={t("datePicker.previousMonth")}
          onClick={handlePrevMonth}
        />
        <Button
          kind="icon-button"
          intent="flat"
          color="default"
          size="sm"
          icon="chevron-right"
          label={t("datePicker.nextMonth")}
          onClick={handleNextMonth}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
