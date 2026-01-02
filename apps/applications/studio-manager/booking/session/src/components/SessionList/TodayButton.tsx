import React, { useCallback, useMemo } from "react";

import {
  DateTime,
  getIsoDate,
  getLocalNow,
  isSameDay,
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

const scrollToDate = (date: DateTime) => {
  const dateString = getIsoDate(date);
  const dateElement = document.querySelector(`[data-date="${dateString}"]`);
  if (dateElement) {
    dateElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const isInRange = (
  date: DateTime,
  minDate: DateTime | null,
  maxDate: DateTime | null,
) => {
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
    () => getLocalNow({ locale: intlLocale, zone: companyTimeZone }),
    [intlLocale, companyTimeZone],
  );

  const handleTodayClick = useCallback(() => {
    if (calendarView === CalendarView.DAILY && selectedDate.type === "single") {
      const selectedDateTime = selectedDate.date;
      if (!isSameDay(selectedDateTime, today)) {
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
      label={t("dateNavigation.todayButton")}
      onClick={handleTodayClick}
      size="md"
      intent="default"
      color="main"
    />
  );
};
