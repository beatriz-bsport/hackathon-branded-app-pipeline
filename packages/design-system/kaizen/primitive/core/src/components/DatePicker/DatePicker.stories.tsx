import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { type DateTime, getLocalNow } from "@bsport/datetime-manipulation";

import Button from "#src/components/Button";
import { Placements } from "#src/hooks/placement-classes.hook";

import DatePicker from "./DatePicker";

/**
 * A configurable date picker component supporting single date or date range selection.<br>
 * Can be displayed as a popover or modal with optional shortcut presets and localization support.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=5920-373124" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  argTypes: {
    id: { control: "text" },
    mode: { options: ["single", "range"], control: { type: "inline-radio" } },
    displayAs: {
      options: ["popover", "modal"],
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disableDate: (date: DateTime, _selectedDate) =>
      date < getLocalNow({}).startOf("day"),
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
        label: "This Weekend",
        getDate: () => {
          const today = getLocalNow({});
          const daysUntilSaturday = (6 - today.weekday + 7) % 7;
          const saturday = today.plus({ days: daysUntilSaturday });
          const sunday = saturday.plus({ days: 1 });
          return [saturday, sunday];
        },
      },
      {
        label: "Next Month",
        getDate: () => {
          const today = getLocalNow({});
          return [today, today.plus({ months: 1 })];
        },
      },
      {
        label: "Last Week",
        getDate: () => {
          const today = getLocalNow({});
          const lastWeek = today.minus({ days: 7 });
          return [lastWeek, today];
        },
      },
      {
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
        label: "This Weekend",
        getDate: () => {
          const today = getLocalNow({});
          const daysUntilSaturday = (6 - today.weekday + 7) % 7;
          const saturday = today.plus({ days: daysUntilSaturday });
          const sunday = saturday.plus({ days: 1 });
          return [saturday, sunday];
        },
      },
      {
        label: "Next Month",
        getDate: () => {
          const today = getLocalNow({});
          return [today, today.plus({ months: 1 })];
        },
      },
    ],
  },
};
