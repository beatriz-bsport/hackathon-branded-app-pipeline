import React, { useCallback, useMemo } from "react";

import {
  getIsoDateString,
  getTodayJSDate,
  isSameDay,
  toDateTime,
} from "@bsport/datetime-manipulation";
import { Button } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  CalendarView,
  selectCalendarView,
  selectSelectedDate,
  setSelectedDate,
  setUniqueDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

const scrollToDate = (date: Date) => {
  const dateString = getIsoDateString(date);
  const dateElement = document.querySelector(`[data-date="${dateString}"]`);
  if (dateElement) {
    dateElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const isInRange = (date: Date, minDate: Date | null, maxDate: Date | null) => {
  if (minDate && maxDate) {
    return date >= minDate && date <= maxDate;
  }
  return false;
};

export const TodayButton: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const calendarView = useSessionListStore(selectCalendarView);
  const selectedDate = useSessionListStore(selectSelectedDate);

  const today = useMemo(
    () => getTodayJSDate(intlLocale, companyTimeZone),
    [intlLocale, companyTimeZone],
  );

  const handleTodayClick = useCallback(() => {
    if (calendarView === CalendarView.DAILY && selectedDate.type === "single") {
      const selectedDateTime = toDateTime(selectedDate.date);
      const todayDateTime = toDateTime(today);
      if (!isSameDay(selectedDateTime, todayDateTime)) {
        setSelectedDate(today);
      }
      return;
    }
    if (calendarView === CalendarView.RANGE && selectedDate.type === "range") {
      if (isInRange(today, selectedDate.minDate, selectedDate.maxDate)) {
        scrollToDate(today);
        return;
      }
      // Switch to daily view with today selected
      setUniqueDate(today);
    }
  }, [calendarView, selectedDate, today]);

  return (
    <Button
      label={t("todayButton")}
      onClick={handleTodayClick}
      size="md"
      intent="default"
      color="main"
    />
  );
};
