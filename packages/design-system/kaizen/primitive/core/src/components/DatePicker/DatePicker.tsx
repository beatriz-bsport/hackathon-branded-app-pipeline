import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { type WeekStartDay, toDateTime } from "@bsport/datetime-manipulation";

import Button from "#src/components/Button";
import Modal from "#src/components/Modal";
import Popover from "#src/components/Popover";
import "#src/globals.css";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import DateInputField from "./DateInputField";
import DatePickerContent from "./DatePickerContent";
import { type ShortcutItem } from "./Shortcuts";

export type SelectedDate = Date | [Date | null, Date | null] | null;

export type DatePickerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "defaultValue"
> & {
  id: string;
  mode: "single" | "range";
  displayAs: "popover" | "modal";
  isInputField?: boolean;
  open?: boolean;
  dateFormat?: "short" | "medium";
  onConfirm?: (selectedDate: SelectedDate) => void;
  onClose?: () => void;
  onSelect?: (date: Date | null) => void;
  weekStartDay?: WeekStartDay;
  calendarYears?: number[];
  disableDate?: (date: Date) => boolean;
  shortcuts?: ShortcutItem[];
  popoverClassNames?: {
    container?: string;
    content?: string;
  };
  defaultValue?: SelectedDate;
};

/**
 * A configurable date picker component supporting single date or date range selection.
 * Can be displayed as a popover or modal with optional shortcut presets and localization support.
 * @param props.className Additional CSS classes to style the component.
 * @param props.id Unique ID for the date picker element.
 * @param props.mode The mode of the date picker, either "single" or "range".
 * @param props.displayAs The display mode of the date picker, either "popover" or "modal". The popover doesn't require any anchor element.
 * @param props.isInputField Whether the date picker is used as an input field. Only applicable when displayAs is "popover" and mode "single".
 * @param props.open Whether the date picker is open or not.
 * @param props.onConfirm Callback function to call when a date is selected.
 * @param props.onClose Callback function to call when the date picker is closed.
 * @param props.weekStartDay The day of the week to start the week, defaults to Monday.
 * @param props.calendarYears The number of years to display in the calendar, defaults to 10.
 * @param props.disableDate A comparison function to disable specific dates in the calendar.
 * @param props.shortcuts An array of shortcut items to display in the date picker.
 * @param props.popoverClassNames Custom classes to provide to the popover container and content
 * @param props.dateFormat The format to display dates for popover, either "short" or "medium".
 * @param props.defaultValue Optional: the initial selected date or date range.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-datepicker--docs
 */
const DatePicker: React.FC<DatePickerProps> = ({
  className,
  id,
  mode,
  displayAs,
  isInputField = false,
  open = false,
  onConfirm,
  onClose,
  weekStartDay = 1,
  calendarYears,
  disableDate,
  shortcuts,
  popoverClassNames = {},
  onSelect,
  defaultValue = null,
  dateFormat = "short",
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [selectedDate, setSelectedDate] = useState<SelectedDate>(defaultValue);
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
    if (!Array.isArray(date)) {
      onSelect?.(date);
    }
  };

  const onPopoverCalendarSelect = (
    date: SelectedDate,
    setIsPopoverOpened: (open: boolean) => void,
  ) => {
    handleCalendarSelect(date);
    if (!Array.isArray(date) || date[1] !== null) {
      setIsPopoverOpened(false);
    }
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

  const formatDate = (date: Date | null) => {
    return date
      ? formatDateTimeFromDate(
          toDateTime(date).setLocale(i18nInstance?.language ?? "en-US"),
          dateFormat === "medium"
            ? DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY
            : DATETIME_FORMATS.SHORT_DATE,
        )
      : t("datePicker.datePlaceholder");
  };

  if (displayAs === "popover")
    return (
      <Popover className={popoverClassNames.container ?? ""}>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => {
            if (mode === "range" || Array.isArray(selectedDate)) {
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
                  iconLeft="calendar"
                  onClick={() => setIsPopoverOpened(true)}
                />
              );
            }
            return isInputField ? (
              <DateInputField
                id={id}
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  onSelect?.(date);
                }}
                onClick={() => setIsPopoverOpened(true)}
              />
            ) : (
              // Button used as Popover trigger for single mode without input field
              <Button
                label={formatDate(selectedDate as Date | null)}
                size="md"
                intent="default"
                color="main"
                iconLeft="calendar"
                onClick={() => setIsPopoverOpened(true)}
              />
            );
          }}
        </Popover.Anchor>
        <Popover.Content className={popoverClassNames.content ?? ""}>
          {({ setIsPopoverOpened }) => (
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
              onCalendarSelect={(date) =>
                onPopoverCalendarSelect(date, setIsPopoverOpened)
              }
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
