import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { WeekStartDay } from "@bsport/datetime-manipulation";

import Button from "#src/components/Button";
import Modal from "#src/components/Modal";
import Popover from "#src/components/Popover";
import "#src/globals.css";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import DateInputField from "./DateInputField";
import DatePickerContent from "./DatePickerContent";
import { type ShortcutItem } from "./Shortcuts";

export type SelectedDate = Date | [Date | null, Date | null] | null;

export type DatePickerProps = React.HTMLAttributes<HTMLDivElement> & {
  id: string;
  mode: "single" | "range";
  displayAs: "popover" | "modal";
  open?: boolean;
  onConfirm?: (selectedDate: SelectedDate) => void;
  onClose?: () => void;
  onSelect?: (date: Date | null) => void;
  weekStartDay?: WeekStartDay;
  calendarYears?: number[];
  disableDate?: (date: Date) => boolean;
  shortcuts?: ShortcutItem[];
};

/**
 * A configurable date picker component supporting single date or date range selection.
 * Can be displayed as a popover or modal with optional shortcut presets and localization support.
 * @param props.className Additional CSS classes to style the component.
 * @param props.id Unique ID for the date picker element.
 * @param props.mode The mode of the date picker, either "single" or "range".
 * @param props.displayAs The display mode of the date picker, either "popover" or "modal". The popover doesn't require any anchor element.
 * @param props.open Whether the date picker is open or not.
 * @param props.onConfirm Callback function to call when a date is selected.
 * @param props.onClose Callback function to call when the date picker is closed.
 * @param props.weekStartDay The day of the week to start the week, defaults to Monday.
 * @param props.calendarYears The number of years to display in the calendar, defaults to 10.
 * @param props.disableDate A comparison function to disable specific dates in the calendar.
 * @param props.shortcuts An array of shortcut items to display in the date picker.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-datepicker--docs
 */
const DatePicker: React.FC<DatePickerProps> = ({
  className,
  id,
  mode,
  displayAs,
  open = false,
  onConfirm,
  onClose,
  weekStartDay = 1,
  calendarYears,
  disableDate,
  shortcuts,
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [selectedDate, setSelectedDate] = useState<SelectedDate>(null);
  const [isManuallySelected, setIsManuallySelected] = useState(false);

  useEffect(() => {
    if (mode === "single" && Array.isArray(selectedDate)) {
      setSelectedDate(null);
    } else if (mode === "range" && !Array.isArray(selectedDate)) {
      setSelectedDate([null, null]);
    }
  }, [mode, selectedDate]);

  const getSanitizedDate = useCallback(
    (value: SelectedDate): SelectedDate => {
      if (mode === "single") {
        return value;
      }
      return Array.isArray(value) ? value : [null, null];
    },
    [mode],
  );

  const sanitizedSelected: SelectedDate = useMemo(
    () => getSanitizedDate(selectedDate),
    [getSanitizedDate, selectedDate],
  );

  const handleModalConfirm = () => {
    if (onConfirm) {
      onConfirm(sanitizedSelected);
    }
  };

  const handleCalendarSelect = (date: SelectedDate) => {
    setSelectedDate(date);
    setIsManuallySelected(true);
  };

  const handleShortcutSelect = (shortcutLabel: string) => {
    const shortcut = shortcuts?.find((s) => s.label === shortcutLabel);
    if (!shortcut) return;

    const dateValue = shortcut.getDate();
    setSelectedDate(getSanitizedDate(dateValue));
    setIsManuallySelected(false);
  };

  const modalSize = useMemo(
    () =>
      mode === "single"
        ? shortcuts?.length
          ? "md"
          : "sm"
        : shortcuts?.length
          ? "lg"
          : "md",
    [mode, shortcuts],
  );

  if (displayAs === "popover")
    return (
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => {
            if (mode === "range" || Array.isArray(selectedDate)) {
              const formatDate = (date: Date | null) => {
                if (date) return date.toLocaleDateString();

                // Check locale date format using a sample date
                const sampleDate = new Date().toLocaleDateString();
                return sampleDate.indexOf("/") === 2
                  ? "DD/MM/YYYY"
                  : "MM/DD/YYYY";
              };

              const [start, end] = Array.isArray(selectedDate)
                ? selectedDate
                : [null, null];

              return (
                <Button
                  label={t("datePicker.rangeLabel", {
                    start: formatDate(start),
                    end: formatDate(end),
                  })}
                  size="md"
                  intent="default"
                  color="main"
                  onClick={() => setIsPopoverOpened(true)}
                />
              );
            }

            return (
              <DateInputField
                id={id}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onClick={() => setIsPopoverOpened(true)}
              />
            );
          }}
        </Popover.Anchor>
        <Popover.Content>
          {() => (
            <DatePickerContent
              className={className}
              id={id}
              mode={mode}
              displayAs={displayAs}
              weekStartDay={weekStartDay}
              calendarYears={calendarYears}
              disableDate={disableDate}
              sanitizedSelected={sanitizedSelected}
              hideSelector={true}
              shortcuts={shortcuts}
              manuallySelected={isManuallySelected}
              onCalendarSelect={handleCalendarSelect}
              onShortcutSelect={handleShortcutSelect}
              {...props}
            />
          )}
        </Popover.Content>
      </Popover>
    );

  return (
    <Modal
      open={open}
      size={modalSize}
      title={t("datePicker.modalTitle")}
      footerDirection={modalSize === "sm" ? "column" : "row"}
      confirmButton={{
        label: "Confirm",
        onClick: handleModalConfirm,
      }}
      cancelButton={{
        label: "Cancel",
        onClick: onClose,
      }}
      onClose={onClose}
    >
      <DatePickerContent
        className={className}
        id={id}
        mode={mode}
        displayAs={displayAs}
        weekStartDay={weekStartDay}
        calendarYears={calendarYears}
        disableDate={disableDate}
        sanitizedSelected={sanitizedSelected}
        hideSelector={false}
        shortcuts={shortcuts}
        manuallySelected={isManuallySelected}
        onCalendarSelect={handleCalendarSelect}
        onShortcutSelect={handleShortcutSelect}
      />
    </Modal>
  );
};

DatePicker.displayName = "KaizenDatePicker";

export default DatePicker;
