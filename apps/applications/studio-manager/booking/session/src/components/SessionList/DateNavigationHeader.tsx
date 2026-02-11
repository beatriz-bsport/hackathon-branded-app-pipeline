import React from "react";

import { modifyTime } from "@bsport/datetime-manipulation";
import { Button } from "@bsport/kaizen-primitive-core";

import {
  CalendarView,
  selectCalendarView,
  selectSelectedDate,
  setUniqueDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import { SessionDatePicker } from "./SessionDatePicker";
import { TodayButton } from "./TodayButton";

export const DateNavigationHeader: React.FC = () => {
  const { t } = useTranslation("sessionList");
  const calendarView = useSessionListStore(selectCalendarView);
  const selectedDate = useSessionListStore(selectSelectedDate);
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
  };

  return (
    <div
      className={[
        // Layout
        "flex justify-center",
        // Spacing
        "p-sm",
        // Border
        "border border-stroke-weak border-b-solid border-b-stroke-thin",
        // Sticky positioning
        "w-full sticky top-0 z-10 bg-surface-page",
      ].join(" ")}
    >
      <div className="absolute left-sm top-1/2 -translate-y-1/2">
        <TodayButton />
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
        <SessionDatePicker />
        {shouldDisplayNavigationButtons && (
          <Button
            icon="chevron-right"
            onClick={handleNextClick}
            label="next"
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
