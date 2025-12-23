import { cx } from "class-variance-authority";
import React from "react";

import Divider from "#src/components/Divider";

import CalendarRange from "./CalendarRange";
import CalendarSingle from "./CalendarSingle";
import type { SelectedDate } from "./DatePicker";
import Shortcuts, { type ShortcutItem } from "./Shortcuts";

export type DatePickerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  id: string;
  mode: "single" | "range";
  displayAs: "popover" | "modal";
  calendarYears?: number[];
  disableDate?: (date: Date, selectedDate: SelectedDate) => boolean;
  sanitizedSelected: SelectedDate;
  hideSelector?: boolean;
  shortcuts?: ShortcutItem[];
  manuallySelected: boolean;
  onCalendarSelect: (date: SelectedDate) => void;
  onShortcutSelect: (shortcutLabel: string) => void;
};

const DatePickerContent: React.FC<DatePickerContentProps> = ({
  className,
  id,
  mode,
  displayAs,
  calendarYears,
  disableDate,
  sanitizedSelected,
  hideSelector,
  shortcuts,
  manuallySelected,
  onCalendarSelect,
  onShortcutSelect,
}) => {
  return (
    <div
      data-component="Kaizen-DatePicker-Content"
      className={cx("flex gap-lg", className)}
    >
      <div
        className={cx("flex flex-1 p-lg", {
          "justify-center": !shortcuts?.length,
        })}
      >
        {mode === "single" ? (
          <CalendarSingle
            id={id}
            years={calendarYears}
            disableDate={disableDate}
            selectedDate={sanitizedSelected as Date}
            onSelect={onCalendarSelect}
            hideSelector={hideSelector}
          />
        ) : (
          <CalendarRange
            id={id}
            years={calendarYears}
            disableDate={disableDate}
            selectedDate={sanitizedSelected as [Date, Date]}
            onSelect={onCalendarSelect}
            hideSelector={hideSelector}
          />
        )}
      </div>
      {displayAs === "modal" && shortcuts && shortcuts.length > 0 && (
        <>
          <Divider orientation="vertical" weight="thin" />
          <Shortcuts
            items={shortcuts}
            onSelect={onShortcutSelect}
            resetSelection={manuallySelected}
          />
        </>
      )}
    </div>
  );
};

export default DatePickerContent;
