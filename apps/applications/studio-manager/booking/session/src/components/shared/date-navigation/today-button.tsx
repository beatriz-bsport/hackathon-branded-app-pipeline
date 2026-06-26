import { isSameDay } from "@bsport/datetime-manipulation";
import { Button, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useToday } from "#src/hooks/use-today";
import {
  selectCalendarView,
  selectSelectedDate,
  setSelectedDate,
  setUniqueDate,
  useCalendarStore,
} from "#src/stores/calendar";
import { CalendarView } from "#src/types";
import { isInRange } from "#src/utils/dates";
import { useTranslation } from "#src/utils/i18n";
import { scrollToDate } from "#src/utils/scroll";

export type TodayButtonBehavior = "scroll-when-visible" | "select-day";

type TodayButtonProps = {
  behavior?: TodayButtonBehavior;
  onDateSelectionChange?: () => void;
  onScrollToNow?: () => void;
};

export const TodayButton = ({
  behavior = "scroll-when-visible",
  onDateSelectionChange,
  onScrollToNow,
}: TodayButtonProps) => {
  const { t } = useTranslation("sessionList");
  const today = useToday();
  const calendarView = useCalendarStore(selectCalendarView);
  const selectedDate = useCalendarStore(selectSelectedDate);

  const handleTodayClick = () => {
    if (behavior === "select-day") {
      setUniqueDate(today);
      onDateSelectionChange?.();
      return;
    }

    if (calendarView === CalendarView.DAILY && selectedDate.type === "single") {
      const selectedDateTime = selectedDate.date;
      if (!isSameDay(selectedDateTime, today)) {
        setSelectedDate(today);
        onDateSelectionChange?.();
      } else {
        onScrollToNow?.();
      }
      return;
    }
    if (calendarView === CalendarView.RANGE && selectedDate.type === "range") {
      if (isInRange(today, selectedDate.minDate, selectedDate.maxDate)) {
        if (onScrollToNow) {
          onScrollToNow();
        } else {
          scrollToDate(today);
        }
        return;
      }

      setUniqueDate(today);
      onDateSelectionChange?.();
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
