import { modifyTime } from "@bsport/datetime-manipulation";
import { Button } from "@bsport/kaizen-primitive-core";

import {
  selectCalendarView,
  selectSelectedDate,
  setUniqueDate,
  useCalendarStore,
} from "#src/stores/calendar";
import { CalendarView } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { CalendarDatePicker } from "./calendar-date-picker";
import { TodayButton, type TodayButtonBehavior } from "./today-button";

type DateNavigationHeaderProps = {
  onDateSelectionChange?: () => void;
  onScrollToNow?: () => void;
  todayBehavior?: TodayButtonBehavior;
};

export const DateNavigationHeader = ({
  onDateSelectionChange,
  onScrollToNow,
  todayBehavior,
}: DateNavigationHeaderProps) => {
  const { t } = useTranslation("sessionList");
  const calendarView = useCalendarStore(selectCalendarView);
  const selectedDate = useCalendarStore(selectSelectedDate);
  const shouldDisplayNavigationButtons =
    calendarView === CalendarView.DAILY && selectedDate.type === "single";

  const handlePreviousClick = () => {
    if (!shouldDisplayNavigationButtons) {
      return;
    }
    const previousDate = modifyTime({
      datetime: selectedDate.date,
      duration: { day: 1 },
      operator: "minus",
    });
    setUniqueDate(previousDate);
    onDateSelectionChange?.();
  };

  const handleNextClick = () => {
    if (!shouldDisplayNavigationButtons) {
      return;
    }
    const nextDate = modifyTime({
      datetime: selectedDate.date,
      duration: { day: 1 },
      operator: "plus",
    });
    setUniqueDate(nextDate);
    onDateSelectionChange?.();
  };

  return (
    <div
      data-id="date-nav-header"
      className="flex justify-center p-sm border border-stroke-weak border-b-solid border-b-stroke-thin w-full sticky top-0 z-10 bg-surface-page"
    >
      <div className="absolute left-sm top-1/2 -translate-y-1/2">
        <TodayButton
          behavior={todayBehavior}
          onDateSelectionChange={onDateSelectionChange}
          onScrollToNow={onScrollToNow}
        />
      </div>
      <div className="flex justify-center gap-xs">
        {shouldDisplayNavigationButtons && (
          <Button
            icon="chevron-left"
            onClick={handlePreviousClick}
            label={t("dateNavigation.previousButton")}
            kind="icon-button"
            size="md"
            intent="default"
            color="main"
          />
        )}
        <CalendarDatePicker onDateSelectionChange={onDateSelectionChange} />
        {shouldDisplayNavigationButtons && (
          <Button
            icon="chevron-right"
            onClick={handleNextClick}
            label={t("dateNavigation.nextButton")}
            kind="icon-button"
            size="md"
            intent="default"
            color="main"
          />
        )}
      </div>
    </div>
  );
};
