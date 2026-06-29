import { Button, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useToday } from "#src/hooks/use-today";
import {
  selectSelectedDate,
  setAnchorDate,
  useCalendarStore,
} from "#src/stores/calendar";
import { isTodayInSelection } from "#src/stores/calendar/selection";
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
  const selectedDate = useCalendarStore(selectSelectedDate);

  const handleTodayClick = () => {
    if (behavior === "select-day") {
      setAnchorDate(today);
      onDateSelectionChange?.();
      return;
    }

    if (isTodayInSelection(selectedDate, today)) {
      if (onScrollToNow) {
        onScrollToNow();
      } else {
        scrollToDate(today);
      }
      return;
    }

    // Jump to the unit containing today in the active view (view unchanged).
    setAnchorDate(today);
    onDateSelectionChange?.();
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
