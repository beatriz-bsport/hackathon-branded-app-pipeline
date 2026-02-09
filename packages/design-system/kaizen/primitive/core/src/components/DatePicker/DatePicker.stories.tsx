import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { type DateTime, getLocalNow } from "@bsport/datetime-manipulation";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import DetailDrawer from "#src/components/DetailDrawer";
import Modal from "#src/components/Modal";
import { Placements } from "#src/hooks/placement-classes.hook";

import DatePicker from "./DatePicker";
import type { ShortcutItem } from "./Shortcuts";
import { getSanitizedDate } from "./datePickerValidation";
import {
  LAST_WEEK_SHORTCUT,
  NEXT_MONTH_RANGE_SHORTCUT,
  NEXT_WEEK_RANGE_SHORTCUT,
} from "./shortcutUtils";

/**
 * A configurable date picker component supporting single date or date range selection.<br>
 * Can be displayed as a popover, modal, or content-only with optional shortcut presets and localization support.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=5920-373124" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  argTypes: {
    id: { control: "text" },
    mode: { options: ["single", "range"], control: { type: "inline-radio" } },
    displayAs: {
      options: ["popover", "modal", "content"],
      control: { type: "inline-radio" },
    },
    isInputField: { control: { type: "boolean" } },
    open: { control: { type: "boolean" } },
    onConfirm: { table: { type: { summary: "function" } } },
    onClose: { table: { type: { summary: "function" } } },
    onSelect: { table: { type: { summary: "function" } } },
    calendarYears: { control: "object" },
    disableDate: { table: { type: { summary: "function" } } },
    shortcuts: { control: "object" },
    dateFormat: {
      options: ["short", "medium"],
      control: { type: "inline-radio" },
    },
    label: { control: "text" },
    popoverPlacement: {
      table: { type: { summary: "string" } },
      options: [undefined, ...Object.values(Placements)],
      control: { type: "select" },
    },
    required: { control: { type: "boolean" } },
    statusText: { control: "text" },
    status: {
      options: [undefined, "default", "positive", "error"],
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

const shortcuts = [
  { id: "today", label: "Today", getDate: () => getLocalNow({}) },
  {
    id: "tomorrow",
    label: "Tomorrow",
    getDate: () => getLocalNow({}).plus({ days: 1 }),
  },
  {
    id: "next-week",
    label: "Next Week",
    getDate: () => getLocalNow({}).plus({ weeks: 1 }),
  },
  {
    id: "next-month",
    label: "Next Month",
    getDate: () => getLocalNow({}).plus({ months: 1 }),
  },
  {
    id: "next-year",
    label: "Next Year",
    getDate: () => getLocalNow({}).plus({ years: 1 }),
  },
];

/**
 * Basic usage of a DatePicker in a modal.<br>
 * Only a button alongside is required to trigger the open/close of the modal
 */
export const DatePickerModal: Story = {
  name: "DatePicker modal",
  render: (args) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);

    return (
      <>
        <Button
          label="Open Modal"
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          loading={false}
        />
        <DatePicker
          open={open}
          onConfirm={(dates) => {
            console.log("Date selected: ", dates);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          {...args}
        />
      </>
    );
  },
  args: {
    id: "datepicker-1",
    mode: "single",
    displayAs: "modal",
    shortcuts,
  },
};

/**
 * This example shows how the DatePicker behaves when dates are disabled.<br>
 * It demonstrates how to disable specific dates using the `disableDate` prop.
 * In this case, all past dates are disabled.
 */
export const DatePickerModalWithDisabledPastDates: Story = {
  name: "DatePicker modal with disabled past dates",
  render: (args) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);

    return (
      <>
        <Button
          label="Open Modal"
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          loading={false}
        />
        <DatePicker
          open={open}
          onConfirm={(dates) => {
            console.log("Date selected: ", dates);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          {...args}
        />
      </>
    );
  },
  args: {
    id: "datepicker-2",
    mode: "single",
    displayAs: "modal",
    disableDate: (date: DateTime) => date < getLocalNow({}).startOf("day"),
    shortcuts,
  },
};

/**
 * This example shows how the DatePicker behaves when no shortcuts are provided.
 */
export const DatePickerModalWithNoShortcuts: Story = {
  name: "DatePicker modal with no shortcuts",
  render: (args) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);

    return (
      <>
        <Button
          label="Open Modal"
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          loading={false}
        />
        <DatePicker
          open={open}
          onConfirm={(dates) => {
            console.log("Date selected: ", dates);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          {...args}
        />
      </>
    );
  },
  args: {
    id: "datepicker-3",
    mode: "single",
    displayAs: "modal",
    shortcuts: [],
  },
};

/**
 * This example shows how to use shortcuts as a range.<br>
 * Each shortcut need to return an array of two dates
 */
export const DatePickerRangeWithShortcuts: Story = {
  name: "DatePicker range with shortcuts",
  render: (args) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);

    return (
      <>
        <Button
          label="Open Modal"
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          loading={false}
        />
        <DatePicker
          open={open}
          onSelect={(dates) => console.log(dates)}
          onConfirm={(dates) => {
            console.log("Dates selected: ", dates);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          {...args}
        />
      </>
    );
  },
  args: {
    id: "datepicker-4",
    mode: "range",
    displayAs: "modal",
    shortcuts: [
      {
        id: "this-weekend",
        label: "This Weekend",
        getDate: () => {
          const today = getLocalNow({});
          const daysUntilSaturday = (6 - today.weekday + 7) % 7;
          const saturday = today.plus({ days: daysUntilSaturday });
          const sunday = saturday.plus({ days: 1 });
          return [saturday, sunday];
        },
      },
      NEXT_MONTH_RANGE_SHORTCUT,
      LAST_WEEK_SHORTCUT,
      {
        id: "next-6-months",
        label: "Next 6 Months",
        getDate: () => {
          const today = getLocalNow({});
          return [today, today.plus({ months: 6 })];
        },
      },
    ],
  },
};

/**
 * In this case, we don't need to provide any trigger to open the DatePicker.<br>
 * It's automatically an input date field that acts as a button to trigger the opening of the popover.<br>
 */
export const DatePickerInputPopover: Story = {
  name: "DatePicker input field popover",
  render: (args) => <DatePicker {...args} />,
  args: {
    id: "datepicker-5",
    mode: "single",
    displayAs: "popover",
    isInputField: true,
    shortcuts,
  },
};

/**
 * In this case, we don't need to provide any trigger to open the DatePicker.<br>
 * It's automatically a button to trigger the opening of the popover.<br>
 * We use the initial selected date to show how the button label updates accordingly.
 */
export const DatePickerPopover: Story = {
  name: "DatePicker popover",
  render: (args) => <DatePicker {...args} />,
  args: {
    id: "datepicker-5",
    mode: "single",
    displayAs: "popover",
    shortcuts,
    defaultValue: getLocalNow({}),
  },
};

/**
 * In this case, we don't need to provide any trigger to open the DatePicker.<br>
 * It's automatically a button to trigger the opening of the popover.<br>
 * We use the initial selected date to show how the button label updates accordingly.
 */
export const DatePickerPopoverCustom: Story = {
  name: "DatePicker popover with custom label and placement",
  render: (args) => (
    <div className="flex flex-row justify-end">
      <DatePicker {...args} />
    </div>
  ),
  args: {
    id: "datepicker-6",
    mode: "single",
    displayAs: "popover",
    shortcuts,
    defaultValue: getLocalNow({}),
    isInputField: true,
    label: "My datepicker label",
    popoverPlacement: "bottom-right",
    required: true,
    statusText: "There is an error",
  },
};

/**
 * In the range mode, the popover is rendered with a button as a trigger, displaying both dates in the label.<br>
 * A single input field is not sufficient, so this button is used instead.<br>
 * TODO: Find a way to display an input type date with two editable dates inside
 */
export const DatePickerPopoverRange: Story = {
  name: "DatePicker popover range",
  args: {
    id: "datepicker-7",
    mode: "range",
    displayAs: "popover",
    shortcuts,
  },
};

/**
 * The DatePicker supports a custom range of years.<br>
 * This example shows the last 50 years rendered in the selector, either in popover or modal.<br>
 * TODO: Fix the popover in the Select so that it allows scrolling when there are too many options, currently we can't scroll below the screen height.
 */
export const DatePickerWithCustomRangeOfYears: Story = {
  name: "DatePicker with custom range of years",
  render: (args) => <DatePicker {...args} />,
  args: {
    id: "datepicker-8",
    mode: "single",
    displayAs: "popover",
    calendarYears: Array.from(
      { length: 50 },
      (_, i) => getLocalNow({}).year - 50 + i,
    ),
    shortcuts,
  },
};

/**
 * This example demonstrates a controlled DatePicker in single mode.<br>
 * The parent component manages the selected date state using the `value` prop.<br>
 * Changes are handled via the `onSelect` callback, allowing full control over the date selection.
 */
export const ControlledSingleDatePicker: Story = {
  name: "Controlled single date picker",
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<DateTime | null>(
      getLocalNow({}),
    );

    return (
      <div>
        <p style={{ marginBottom: "16px" }}>
          Selected date: {selectedDate?.toLocaleString() || "None"}
        </p>
        <DatePicker
          {...args}
          dateValue={selectedDate}
          onSelect={(date) => {
            console.log("Date selected:", date);
            setSelectedDate(date as DateTime);
          }}
        />
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Button
            label="Set to Today"
            size="sm"
            intent="default"
            color="main"
            onClick={() => setSelectedDate(getLocalNow({}))}
          />
          <Button
            label="Set to Tomorrow"
            size="sm"
            intent="default"
            color="main"
            onClick={() => {
              const tomorrow = getLocalNow({}).plus({ days: 1 });
              setSelectedDate(tomorrow);
            }}
          />
          <Button
            label="Clear"
            size="sm"
            intent="default"
            color="main"
            onClick={() => setSelectedDate(null)}
          />
        </div>
      </div>
    );
  },
  args: {
    id: "datepicker-controlled-single",
    mode: "single",
    displayAs: "popover",
    shortcuts,
  },
};

/**
 * This example demonstrates a controlled DatePicker in range mode.<br>
 * The parent component manages the selected date range state using the `value` prop.<br>
 * The component handles partial selections (when only the first date is selected) and allows<br>
 * programmatic updates to the date range from external controls.
 */
export const ControlledRangeDatePicker: Story = {
  name: "Controlled range date picker",
  render: (args) => {
    const [selectedRange, setSelectedRange] = useState<
      [DateTime | null, DateTime | null]
    >([getLocalNow({}), null]);

    const formatRange = () => {
      if (!selectedRange[0] && !selectedRange[1]) return "None";
      if (selectedRange[0] && !selectedRange[1])
        return `${selectedRange[0].toLocaleString()} - (selecting...)`;
      if (selectedRange[0] && selectedRange[1])
        return `${selectedRange[0].toLocaleString()} - ${selectedRange[1].toLocaleString()}`;
      return "Invalid range";
    };

    return (
      <div>
        <p style={{ marginBottom: "16px" }}>Selected range: {formatRange()}</p>
        <DatePicker
          {...args}
          dateValue={selectedRange}
          onSelect={(date) => {
            console.log("Range selected:", date);
            if (Array.isArray(date)) {
              setSelectedRange(date as [DateTime | null, DateTime | null]);
            }
          }}
        />
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Button
            label="This Week"
            size="sm"
            intent="default"
            color="main"
            onClick={() => {
              const today = getLocalNow({});
              const startOfWeek = today.startOf("week");
              const endOfWeek = today.endOf("week");
              setSelectedRange([startOfWeek, endOfWeek]);
            }}
          />
          <Button
            label="Next 7 Days"
            size="sm"
            intent="default"
            color="main"
            onClick={() => {
              const start = getLocalNow({});
              const end = start.plus({ days: 7 });
              setSelectedRange([start, end]);
            }}
          />
          <Button
            label="Clear"
            size="sm"
            intent="default"
            color="main"
            onClick={() => setSelectedRange([null, null])}
          />
        </div>
      </div>
    );
  },
  args: {
    id: "datepicker-controlled-range",
    mode: "range",
    displayAs: "popover",
    shortcuts: [
      {
        id: "this-weekend",
        label: "This Weekend",
        getDate: () => {
          const today = getLocalNow({});
          const daysUntilSaturday = (6 - today.weekday + 7) % 7;
          const saturday = today.plus({ days: daysUntilSaturday });
          const sunday = saturday.plus({ days: 1 });
          return [saturday, sunday];
        },
      },
      NEXT_MONTH_RANGE_SHORTCUT,
    ],
  },
};

/**
 * Renders only the date picker content (calendar + optional shortcuts) with no popover or modal.<br>
 * Use displayAs="content" to embed the picker in your own layout (e.g. custom modal, drawer, or inline).<br>
 * Selection is handled via onSelect/onConfirm; use getSanitizedDate(mode, value) when you need to normalize values elsewhere.
 */
export const DatePickerContentSingle: Story = {
  name: "DatePicker content only (single)",
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);

    return (
      <div className="rounded-lg border border-solid border-luna-grey-200 p-lg">
        <p className="mb-md text-sm text-luna-grey-700">
          Embedded content – no wrapper. Selected:{" "}
          {selectedDate?.toLocaleString() ?? "None"}
        </p>
        <DatePicker
          {...args}
          displayAs="content"
          dateValue={selectedDate}
          onSelect={(date) => setSelectedDate(date as DateTime)}
        />
      </div>
    );
  },
  args: {
    id: "datepicker-content-single",
    mode: "single",
    displayAs: "content",
    shortcuts,
  },
};

/**
 * Content-only mode in range selection with shortcuts.<br>
 * Same as content single but shows how shortcuts and range selection work when embedded.
 */
export const DatePickerContentRange: Story = {
  name: "DatePicker content only (range)",
  render: (args) => {
    const [selectedRange, setSelectedRange] = useState<
      [DateTime | null, DateTime | null]
    >([null, null]);

    const formatRange = () => {
      if (!selectedRange[0] && !selectedRange[1]) return "None";
      if (selectedRange[0] && !selectedRange[1])
        return `${selectedRange[0].toLocaleString()} – (select end date)`;
      if (selectedRange[0] && selectedRange[1])
        return `${selectedRange[0].toLocaleString()} – ${selectedRange[1].toLocaleString()}`;
      return "Invalid range";
    };

    return (
      <div className="rounded-lg border border-solid border-luna-grey-200 p-lg">
        <p className="mb-md text-sm text-luna-grey-700">
          Embedded range picker. Selected: {formatRange()}
        </p>
        <DatePicker
          {...args}
          displayAs="content"
          dateValue={selectedRange}
          onSelect={(date) => {
            if (Array.isArray(date)) {
              setSelectedRange(date as [DateTime | null, DateTime | null]);
            }
          }}
        />
      </div>
    );
  },
  args: {
    id: "datepicker-content-range",
    mode: "range",
    displayAs: "content",
    shortcuts: [
      {
        id: "this-weekend",
        label: "This Weekend",
        getDate: () => {
          const today = getLocalNow({});
          const daysUntilSaturday = (6 - today.weekday + 7) % 7;
          const saturday = today.plus({ days: daysUntilSaturday });
          const sunday = saturday.plus({ days: 1 });
          return [saturday, sunday];
        },
      },
      NEXT_MONTH_RANGE_SHORTCUT,
    ],
  },
};

/**
 * Demonstrates using getSanitizedDate when integrating the selected value in another context (e.g. form submit).<br>
 * The helper ensures range mode always gets [start, end] and single mode gets a single value or null.
 */
export const DatePickerContentWithValidationHelper: Story = {
  name: "DatePicker content with getSanitizedDate",
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<DateTime | null>(
      getLocalNow({}),
    );

    const handleSimulatedSubmit = () => {
      const sanitized = getSanitizedDate("single", selectedDate);
      console.log("Sanitized value for submit:", sanitized);
      alert(`Sanitized value: ${sanitized?.toLocaleString() ?? "null"}`);
    };

    return (
      <div className="rounded-lg border border-solid border-luna-grey-200 p-lg">
        <p className="mb-md text-sm text-luna-grey-700">
          Content mode + getSanitizedDate(mode, value) for use in forms or other
          contexts.
        </p>
        <DatePicker
          {...args}
          displayAs="content"
          dateValue={selectedDate}
          onSelect={(date) => setSelectedDate(date as DateTime)}
        />
        <div className="mt-md flex gap-sm">
          <Button
            label="Simulate submit (log sanitized value)"
            size="sm"
            intent="default"
            color="main"
            onClick={handleSimulatedSubmit}
          />
        </div>
      </div>
    );
  },
  args: {
    id: "datepicker-content-validation",
    mode: "single",
    displayAs: "content",
    shortcuts,
  },
};

/**
 * DatePicker content embedded in a fully customized Kaizen Modal.<br>
 * Uses displayAs="content" and custom footer buttons. Fake validation on confirm:
 * date is required, and (for demo) date must be today or in the future.
 */
export const DatePickerContentInCustomModal: Story = {
  name: "DatePicker content in custom Modal",
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleClose = () => {
      setOpen(false);
      setValidationError(null);
    };

    const handleConfirm = () => {
      const sanitized = getSanitizedDate("single", selectedDate);

      // Fake validation: required
      if (sanitized === null) {
        setValidationError("Please select a date.");
        return;
      }

      // Fake validation: date must be today or in the future
      const today = getLocalNow({}).startOf("day");
      if (sanitized < today) {
        setValidationError("Date must be today or in the future.");
        return;
      }

      setValidationError(null);
      setOpen(false);
      alert(`Confirmed date: ${sanitized?.toLocaleString() ?? "null"}`);
    };

    return (
      <div className="p-md">
        <Button
          intent="default"
          color="main"
          size="md"
          label="Open date picker modal"
          onClick={() => setOpen(true)}
        />

        <Modal
          open={open}
          size="md"
          title="Choose a date"
          description="Select a date for your booking. It must be today or a future date."
          onClose={handleClose}
          cancelButton={{
            label: "Cancel",
            onClick: handleClose,
          }}
          confirmButton={{
            label: "Confirm",
            onClick: handleConfirm,
          }}
          footerDirection="row"
        >
          <div className="space-y-md">
            {validationError && (
              <Body size="sm" color="critical">
                {validationError}
              </Body>
            )}
            <DatePicker
              {...args}
              id="datepicker-custom-modal"
              displayAs="content"
              mode="single"
              dateValue={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date as DateTime);
                setValidationError(null);
              }}
              shortcuts={shortcuts}
            />
          </div>
        </Modal>
      </div>
    );
  },
  args: {
    id: "datepicker-custom-modal",
    mode: "single",
    displayAs: "content",
    shortcuts,
  },
};

const rangeShortcuts: ShortcutItem[] = [
  {
    id: "this-weekend",
    label: "This Weekend",
    getDate: (): [DateTime, DateTime] => {
      const today = getLocalNow({});
      const daysUntilSaturday = (6 - today.weekday + 7) % 7;
      const saturday = today.plus({ days: daysUntilSaturday });
      const sunday = saturday.plus({ days: 1 });
      return [saturday, sunday];
    },
  },
  NEXT_WEEK_RANGE_SHORTCUT,
];

/**
 * DatePicker content embedded in a Kaizen Detail Drawer.<br>
 * Uses displayAs="content" with range mode. Fake validation on Apply:
 * both dates required and end date must be after start date.
 */
export const DatePickerContentInDetailDrawer: Story = {
  name: "DatePicker content in Detail Drawer",
  render: (args) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<
      [DateTime | null, DateTime | null]
    >([null, null]);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleClose = () => {
      setIsDrawerOpen(false);
      setValidationError(null);
    };

    const handleApply = () => {
      const sanitized = getSanitizedDate("range", selectedRange);

      if (!Array.isArray(sanitized)) {
        setValidationError("Invalid range.");
        return;
      }

      const [start, end] = sanitized;

      // Fake validation: both dates required
      if (!start || !end) {
        setValidationError("Please select both start and end dates.");
        return;
      }

      // Fake validation: end must be after start
      if (end <= start) {
        setValidationError("End date must be after start date.");
        return;
      }

      setValidationError(null);
      setIsDrawerOpen(false);
      alert(
        `Applied range: ${start.toLocaleString()} - ${end.toLocaleString()}`,
      );
    };

    return (
      <div className="p-md min-h-[400px]">
        <Button
          intent="default"
          color="main"
          size="md"
          label="Open date range drawer"
          onClick={() => setIsDrawerOpen(true)}
        />

        <DetailDrawer
          id="datepicker-detail-drawer"
          isOpen={isDrawerOpen}
          onClose={handleClose}
          actionsConfig={[
            {
              id: "drawer-cancel",
              label: "Cancel",
              size: "md",
              intent: "flat",
              color: "default",
              onClick: handleClose,
            },
            {
              id: "drawer-apply",
              label: "Apply",
              size: "md",
              intent: "call-to-action",
              color: "main",
              onClick: handleApply,
            },
          ]}
        >
          <div className="space-y-md">
            <h2 className="text-lg font-semibold">Select date range</h2>
            <Body size="sm" color="weak">
              Choose a start and end date. End date must be after start date.
            </Body>
            {validationError && (
              <Body size="sm" color="critical">
                {validationError}
              </Body>
            )}
            <DatePicker
              {...args}
              id="datepicker-detail-drawer"
              displayAs="content"
              mode="range"
              dateValue={selectedRange}
              onSelect={(date) => {
                if (Array.isArray(date)) {
                  setSelectedRange(date as [DateTime | null, DateTime | null]);
                  setValidationError(null);
                }
              }}
              shortcuts={rangeShortcuts}
            />
          </div>
        </DetailDrawer>
      </div>
    );
  },
  args: {
    id: "datepicker-detail-drawer",
    mode: "range",
    displayAs: "content",
    shortcuts: rangeShortcuts,
  },
};
