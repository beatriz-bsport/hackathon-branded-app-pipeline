import React from "react";

import { isSameDay } from "@bsport/datetime-manipulation";
import { Button, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useToday } from "#src/hooks/use-today";
import {
  selectCalendarView,
  selectSelectedDate,
  setSelectedDate,
  setUniqueDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { CalendarView } from "#src/types";
import { isInRange, scrollToDate } from "#src/utils/dates";
import { useTranslation } from "#src/utils/i18n";

export const TodayButton: React.FC = () => {
  const { t } = useTranslation("sessionList");
  const today = useToday();
  const calendarView = useSessionListStore(selectCalendarView);
  const selectedDate = useSessionListStore(selectSelectedDate);

  const handleTodayClick = () => {
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
  };

  const isMobile = !useMatchMedia("sm");

  return isMobile ? (
    <Button
      label={t("dateNavigation.todayButton")}
      onClick={handleTodayClick}
      size="md"
      intent="default"
      color="main"
      kind="icon-button"
      icon="arrow-square-right"
    />
  ) : (
    <Button
      label={t("dateNavigation.todayButton")}
      onClick={handleTodayClick}
      size="md"
      intent="default"
      color="main"
    />
  );
};
