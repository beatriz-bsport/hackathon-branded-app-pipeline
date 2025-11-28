import React, { useMemo } from "react";

import {
  generateCalendarDays,
  getWeekStartDayFromLocale,
  getWeekdays,
  isSameDay,
  toDate,
  toDateTime,
} from "@bsport/datetime-manipulation";

import { useKaizenI18nInstance } from "#src/i18n";

import type { SelectedDate } from "./DatePicker";
import Day, { type DayStatus } from "./Day";

type MonthProps = {
  disableDate?: (date: Date) => boolean;
  displayMonth: Date;
  onSelect?: (date: Date) => void;
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
  const displayDateTime = toDateTime(displayMonth);
  const weekStartDay = getWeekStartDayFromLocale(
    i18nInstance?.language || "en-US",
  );
  const calendarDays = useMemo(
    () => generateCalendarDays(displayDateTime, weekStartDay),
    [displayDateTime, weekStartDay],
  );

  const weeks = useMemo(() => {
    if (calendarDays.length === 0) return 0;
    return Math.ceil(calendarDays.length / 7);
  }, [calendarDays]);

  const getDayStatus = (date: Date): DayStatus => {
    if (disableDate?.(date)) return "disabled";

    if (!selectedDate) return "default";

    if (selectedDate instanceof Date) {
      return isSameDay(toDateTime(date), toDateTime(selectedDate))
        ? "selected"
        : "default";
    }

    if (Array.isArray(selectedDate)) {
      const [startDate, endDate] = selectedDate;
      if (!startDate) return "default";

      const current = toDateTime(date);
      const start = toDateTime(startDate);
      const end = endDate ? toDateTime(endDate) : undefined;

      if (isSameDay(current, start)) {
        return end && isSameDay(start, end) ? "selected" : "start";
      }

      if (end && isSameDay(current, end)) return "end";

      if (end && current > start && current < end) {
        const dayOfWeek = (date.getDay() - weekStartDay + 7) % 7;

        if (date.getDate() === 1) return "weekStartDay";

        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const lastDayOfMonth = new Date(nextMonth.getTime() - 1);
        if (date.getDate() === lastDayOfMonth.getDate()) return "endOfWeek";

        if (dayOfWeek === 0) return "weekStartDay";
        if (dayOfWeek === 6) return "endOfWeek";

        return "middle";
      }
    }

    return "default";
  };

  return (
    <table>
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
              const dt = calendarDays[dayIndex];

              if (!dt) {
                return <td key={dayIndex} className="w-xl h-xl" />;
              }

              const date = toDate(dt);
              const isCurrentDay = isSameDay(dt, toDateTime(new Date()));
              const isDisabled = disableDate?.(date) ?? false;
              const status = getDayStatus(date);

              return (
                <Day
                  key={dayIndex}
                  value={date.getDate()}
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
