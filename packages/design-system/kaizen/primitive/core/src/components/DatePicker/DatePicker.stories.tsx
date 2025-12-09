import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

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
  { id: "today", label: "Today", getDate: () => new Date() },
  {
    id: "tomorrow",
    label: "Tomorrow",
    getDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
  },
  {
    id: "next-week",
    label: "Next Week",
    getDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  },
  {
    id: "next-month",
    label: "Next Month",
    getDate: () => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    },
  },
  {
    id: "next-year",
    label: "Next Year",
    getDate: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    },
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
    disableDate: (date: Date, _selectedDate) => date < new Date(),
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
          const today = new Date();
          const saturday = new Date(
            today.setDate(today.getDate() + (6 - today.getDay())),
          );
          const sunday = new Date(saturday);
          sunday.setDate(saturday.getDate() + 1);
          return [saturday, sunday];
        },
      },
      {
        label: "Next Month",
        getDate: () => {
          const today = new Date();
          return [new Date(), new Date(today.setMonth(today.getMonth() + 1))];
        },
      },
      {
        label: "Last Week",
        getDate: () => {
          const today = new Date();
          const lastWeek = new Date(today.setDate(today.getDate() - 7));
          return [lastWeek, new Date()];
        },
      },
      {
        label: "Next 6 Months",
        getDate: () => {
          const today = new Date();
          return [new Date(), new Date(today.setMonth(today.getMonth() + 6))];
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
    defaultValue: new Date(),
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
    defaultValue: new Date(),
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
      (_, i) => new Date().getFullYear() - 50 + i,
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
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    return (
      <div>
        <p style={{ marginBottom: "16px" }}>
          Selected date: {selectedDate?.toLocaleDateString() || "None"}
        </p>
        <DatePicker
          {...args}
          dateValue={selectedDate}
          onSelect={(date) => {
            console.log("Date selected:", date);
            setSelectedDate(date as Date);
          }}
        />
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Button
            label="Set to Today"
            size="sm"
            intent="default"
            color="main"
            onClick={() => setSelectedDate(new Date())}
          />
          <Button
            label="Set to Tomorrow"
            size="sm"
            intent="default"
            color="main"
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
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
      [Date | null, Date | null]
    >([new Date(), null]);

    const formatRange = () => {
      if (!selectedRange[0] && !selectedRange[1]) return "None";
      if (selectedRange[0] && !selectedRange[1])
        return `${selectedRange[0].toLocaleDateString()} - (selecting...)`;
      if (selectedRange[0] && selectedRange[1])
        return `${selectedRange[0].toLocaleDateString()} - ${selectedRange[1].toLocaleDateString()}`;
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
              setSelectedRange(date as [Date | null, Date | null]);
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
              const today = new Date();
              const dayOfWeek = today.getDay();
              const startOfWeek = new Date(today);
              startOfWeek.setDate(
                today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
              );
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              setSelectedRange([startOfWeek, endOfWeek]);
            }}
          />
          <Button
            label="Next 7 Days"
            size="sm"
            intent="default"
            color="main"
            onClick={() => {
              const start = new Date();
              const end = new Date();
              end.setDate(end.getDate() + 6);
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
          const today = new Date();
          const saturday = new Date(
            today.setDate(today.getDate() + (6 - today.getDay())),
          );
          const sunday = new Date(saturday);
          sunday.setDate(saturday.getDate() + 1);
          return [saturday, sunday];
        },
      },
      {
        label: "Next Month",
        getDate: () => {
          const today = new Date();
          return [new Date(), new Date(today.setMonth(today.getMonth() + 1))];
        },
      },
    ],
  },
};
