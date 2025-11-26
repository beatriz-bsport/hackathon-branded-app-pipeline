import React, { useMemo } from "react";

import { getMonths } from "@bsport/datetime-manipulation";

import Button from "#src/components/Button";
import Select from "#src/components/Select";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const MIN_ABBREVIATION_LENGTH = 3;
const YEARS_RANGE = 11;
const YEARS_OFFSET = 5;
const BASE_MONTH_COUNT = 12;

type CalendarHeaderProps = {
  displayMonth: Date;
  mode: "single" | "range";
  years?: number[];
  onSelect: (date: Date) => void;
  locale?: string;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayMonth,
  mode,
  years,
  onSelect,
  locale = "en",
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const handlePrevMonth = () =>
    onSelect(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1),
    );

  const handleNextMonth = () =>
    onSelect(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1),
    );

  const handleMonthChange = (id: string) => {
    const monthIndex = months.indexOf(id);
    if (monthIndex >= 0) {
      onSelect(new Date(displayMonth.getFullYear(), monthIndex, 1));
    }
  };

  const handleYearChange = (id: string) =>
    onSelect(new Date(parseInt(id, 10), displayMonth.getMonth(), 1));

  const currentYear = new Date().getFullYear();
  const yearsRendered =
    years ||
    Array.from(
      { length: YEARS_RANGE },
      (_, i) => currentYear - YEARS_OFFSET + i,
    );

  const months = useMemo(() => getMonths("long", locale), [locale]);

  const selectLabel = useMemo(() => {
    const month = months[displayMonth.getMonth()];
    if (!month) return "";
    return month.length > MIN_ABBREVIATION_LENGTH
      ? month.slice(0, MIN_ABBREVIATION_LENGTH) + "."
      : month;
  }, [displayMonth, months]);

  const getMonthYearDisplay = (delta: number) => {
    const monthIndex = (displayMonth.getMonth() + delta) % BASE_MONTH_COUNT;
    const yearDelta =
      displayMonth.getMonth() + delta >= BASE_MONTH_COUNT ? 1 : 0;
    return `${months[monthIndex]} ${displayMonth.getFullYear() + yearDelta}`;
  };

  return (
    <div className="flex justify-between items-center self-stretch">
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
            value={String(displayMonth.getFullYear())}
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
