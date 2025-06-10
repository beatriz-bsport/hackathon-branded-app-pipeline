import { cx } from "class-variance-authority";
import React, { useCallback, useMemo, useState } from "react";

import Menu from "#src/components/Menu";
import type { MenuOption } from "#src/components/Menu/types";
import Popover from "#src/components/Popover";
import Select from "#src/components/Select";
import TextField from "#src/components/TextField";
import "#src/globals.css";

import {
  buildDateFromSelection,
  generateTimeOptions,
  getMenuValue,
} from "./utils";

const MIN_TIME_PICKER_INTERVAL = 1;
const TIME_PICKER_VISIBLE_MENU_ITEMS = 5;
const MENU_ITEM_CENTER_OFFSET = Math.floor(TIME_PICKER_VISIBLE_MENU_ITEMS / 2);
const TIME_PICKER_DEFAULT_INTERVAL = 15;

// Calculate the maximum height of the menu based on the number of items
const TIME_PICKER_MENU_ITEMS = 5;
const MENU_ITEM_HEIGHT = 32;
const MENU_ITEM_GAP = 8;
const MENU_MAX_HEIGHT_PX =
  TIME_PICKER_MENU_ITEMS * MENU_ITEM_HEIGHT +
  (TIME_PICKER_MENU_ITEMS - 1) * MENU_ITEM_GAP;

type Meridiem = "AM" | "PM";

export type TimePickerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  disabled?: boolean;
  id: string;
  interval?: number;
  label?: string;
  meridiem?: boolean;
  onChange?: (date: Date) => void;
  required?: boolean;
  value?: string;
};

/**
 * A time picker component that allows users to select a time from a list of options.
 * The input field itself triggers the popover for time selection.
 * @param props.className Additional CSS classes to style the component.
 * @param props.disabled Whether the time picker is disabled.
 * @param props.id Unique identifier for the time picker.
 * @param props.interval Minute interval between time options (default: 15).
 * @param props.meridiem Whether to use 12-hour format with AM/PM.
 * @param props.onChange Callback when the time changes. Receives a Date object.
 * @param props.required Whether the field is required.
 * @param props.value The selected time in `HH:mm` format.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-timepicker--docs
 */
const TimePicker: React.FC<TimePickerProps> = ({
  className,
  disabled,
  id,
  interval = TIME_PICKER_DEFAULT_INTERVAL,
  label,
  meridiem,
  onChange,
  required,
  value,
  ...props
}) => {
  const [selectedMeridiem, setSelectedMeridiem] = useState<Meridiem>("AM");

  const timeOptions = useMemo(
    () =>
      generateTimeOptions(
        interval,
        meridiem,
        meridiem ? selectedMeridiem : undefined,
      ),
    [interval, meridiem, selectedMeridiem],
  );

  const handleUpdate = useCallback(
    (newTime?: string, newMeridiem?: Meridiem) => {
      const time = newTime ?? value ?? "00:00";
      const mer = newMeridiem ?? selectedMeridiem ?? "AM";
      const date = buildDateFromSelection(time, mer, meridiem);
      if (date && onChange) onChange(date);
    },
    [meridiem, onChange, selectedMeridiem, value],
  );

  const menuValue = useMemo(
    () => getMenuValue(value, meridiem),
    [meridiem, value],
  );

  const focusedMenuItemIndex = useMemo(
    () =>
      menuValue
        ? timeOptions.findIndex((opt) => (opt as MenuOption).id === menuValue)
        : 0,
    [menuValue, timeOptions],
  );

  const selectedValues = useMemo(
    () => (menuValue ? [menuValue] : []),
    [menuValue],
  );

  if (interval < MIN_TIME_PICKER_INTERVAL) {
    console.error("TimePicker: `interval` must be >= 1");
    return null;
  }

  const formatDisplayTime = (time: string | undefined): string | undefined => {
    if (!time || !meridiem) return time;
    const [hourStr, min] = time.split(":");
    let hour = Number(hourStr);
    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }
    return `${hour.toString().padStart(2, "0")}:${min}`;
  };

  const getMenuScrollTop = (
    focusedIndex: number,
    centerOffset: number,
    itemHeight: number,
    itemGap: number,
  ) => {
    return (focusedIndex - centerOffset) * (itemHeight + itemGap) + itemGap;
  };

  return (
    <div
      className={cx(className, "flex flex-col gap-2xs", {
        "opacity-sm pointer-events-none": disabled,
      })}
      {...props}
    >
      {label && (
        <label
          htmlFor={`timepicker-${id}`}
          className="flex gap-2xs text-onsurface-default text-body-md leading-sm"
        >
          <span>{label}</span>
          {required && (
            <span className="text-onsurface-status-critical-strong text-body-sm leading-xs">
              *
            </span>
          )}
        </label>
      )}
      <div className="flex items-end gap-sm">
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <TextField
                id={`timepicker-${id}`}
                type="time"
                value={formatDisplayTime(value)}
                onClick={() => setIsPopoverOpened(true)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleUpdate(e.target.value);
                }}
              />
            )}
          </Popover.Anchor>
          <Popover.Content
            maxHeightPx={MENU_MAX_HEIGHT_PX}
            focusedMenuItemIndex={focusedMenuItemIndex}
          >
            {({ setIsPopoverOpened, isPopoverOpened, contentRef }) => {
              if (isPopoverOpened && contentRef.current) {
                contentRef.current.scrollTop = getMenuScrollTop(
                  focusedMenuItemIndex,
                  MENU_ITEM_CENTER_OFFSET,
                  MENU_ITEM_HEIGHT,
                  MENU_ITEM_GAP,
                );
              }

              return (
                <Menu
                  items={timeOptions}
                  onSelectOption={(time) => {
                    handleUpdate(time);
                    setIsPopoverOpened(false);
                  }}
                  selectedValues={selectedValues}
                />
              );
            }}
          </Popover.Content>
        </Popover>
        {meridiem && (
          <Select
            id={`timepicker-meridiem-${id}`}
            items={[
              { id: "AM", label: "AM" },
              { id: "PM", label: "PM" },
            ]}
            value={selectedMeridiem}
            onSelect={(val) => {
              setSelectedMeridiem(val as Meridiem);
              handleUpdate(undefined, val as Meridiem);
            }}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

TimePicker.displayName = "KaizenTimePicker";

export default TimePicker;
