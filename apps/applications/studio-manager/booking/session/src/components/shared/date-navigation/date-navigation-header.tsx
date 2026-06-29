import { Button } from "@bsport/kaizen-primitive-core";

import {
  selectCalendarView,
  selectSelectedDate,
  setAnchorDate,
  useCalendarStore,
} from "#src/stores/calendar";
import { getSteppedAnchor } from "#src/stores/calendar/selection";
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

  const handlePreviousClick = () => {
    setAnchorDate(getSteppedAnchor(calendarView, selectedDate, "minus"));
    onDateSelectionChange?.();
  };

  const handleNextClick = () => {
    setAnchorDate(getSteppedAnchor(calendarView, selectedDate, "plus"));
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
        <Button
          icon="chevron-left"
          onClick={handlePreviousClick}
          label={t("dateNavigation.previousButton")}
          kind="icon-button"
          size="md"
          intent="default"
          color="main"
        />
        <CalendarDatePicker onDateSelectionChange={onDateSelectionChange} />
        <Button
          icon="chevron-right"
          onClick={handleNextClick}
          label={t("dateNavigation.nextButton")}
          kind="icon-button"
          size="md"
          intent="default"
          color="main"
        />
      </div>
    </div>
  );
};
