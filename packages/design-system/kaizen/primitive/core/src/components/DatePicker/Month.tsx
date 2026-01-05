import React, { useMemo } from "react";

import {
  type DateTime,
  generateCalendarDays,
  getLocalNow,
  getWeekStartDayFromLocale,
  getWeekdays,
  isSameDay,
} from "@bsport/datetime-manipulation";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { useKaizenI18nInstance } from "#src/i18n";

import type { SelectedDate } from "./DatePicker";
import Day, { type DayStatus } from "./Day";

type MonthProps = {
  disableDate?: (date: DateTime, selectedDate: SelectedDate) => boolean;
  displayMonth: DateTime;
  onSelect?: (date: DateTime) => void;
  selectedDate: SelectedDate;
};

const Month: React.FC<MonthProps> = ({
  disableDate,
  displayMonth,
  onSelect,
  selectedDate,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const weekdays = useMemo(
    () => getWeekdays("short", i18nInstance?.language || "en-US"),
    [i18nInstance?.language],
  );
  const weekStartDay = getWeekStartDayFromLocale(
    i18nInstance?.language || "en-US",
  );

  const calendarDays = useMemo(
    () => generateCalendarDays(displayMonth, i18nInstance?.language || "en-US"),
    [displayMonth, i18nInstance?.language],
  );

  const weeks = useMemo(() => {
    if (calendarDays.length === 0) return 0;
    return Math.ceil(calendarDays.length / 7);
  }, [calendarDays]);

  const timezone = getCompanyTimezone();

  const getDayStatus = (date: DateTime): DayStatus => {
    if (disableDate?.(date, selectedDate)) return "disabled";

    if (!selectedDate) return "default";

    if (!Array.isArray(selectedDate)) {
      return isSameDay(date, selectedDate) ? "selected" : "default";
    }

    const [startDate, endDate] = selectedDate;
    if (!startDate) return "default";

    if (isSameDay(date, startDate)) {
      return endDate && isSameDay(startDate, endDate) ? "selected" : "start";
    }

    if (endDate && isSameDay(date, endDate)) return "end";
    if (endDate && date > startDate && date < endDate) {
      if (date.day === 1) return "weekStartDay";

      const nextMonth = date.plus({ months: 1 }).startOf("month");
      const lastDayOfMonth = nextMonth.minus({ days: 1 });
      if (isSameDay(date, lastDayOfMonth)) return "endOfWeek";

      const dayOfWeek = (date.weekday - weekStartDay + 7) % 7;
      if (dayOfWeek === 0) return "weekStartDay";
      if (dayOfWeek === 6) return "endOfWeek";

      return "middle";
    }
    return "default";
  };

  return (
    <table data-component="Kaizen-DatePicker-Month">
      <thead>
        <tr className="flex">
          {weekdays.map((day) => (
            <th
              key={day}
              className="text-onsurface-weaker text-center text-body-md leading-xs font-weaker w-xl h-xl"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: weeks }).map((_, weekIdx) => (
          <tr className="flex" key={weekIdx}>
            {Array.from({ length: 7 }).map((__, dayIdx) => {
              const dayIndex = weekIdx * 7 + dayIdx;
              const date = calendarDays[dayIndex];

              if (!date) {
                return <td key={dayIndex} className="w-xl h-xl" />;
              }

              const isCurrentDay = isSameDay(
                date,
                getLocalNow({ zone: timezone }),
              );
              const isDisabled = disableDate?.(date, selectedDate) ?? false;
              const status = getDayStatus(date);

              return (
                <Day
                  key={dayIndex}
                  value={date.day}
                  status={status}
                  isCurrentDay={isCurrentDay}
                  onClick={() => {
                    if (!isDisabled && onSelect) {
                      onSelect(date);
                    }
                  }}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Month;
