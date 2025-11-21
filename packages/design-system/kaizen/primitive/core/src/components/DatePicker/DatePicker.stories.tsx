import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Button from "#src/components/Button";

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
    weekStartDay: { control: { type: "number", min: 0, max: 6 } },
    calendarYears: { control: "object" },
    disableDate: { table: { type: { summary: "function" } } },
    shortcuts: { control: "object" },
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
    weekStartDay: 1,
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
    weekStartDay: 1,
    disableDate: (date: Date) => date < new Date(),
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
    weekStartDay: 1,
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
    weekStartDay: 1,
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
    weekStartDay: 1,
    shortcuts,
  },
};

/**
 * In this case, we don't need to provide any trigger to open the DatePicker.<br>
 * It's automatically a button to trigger the opening of the popover.<br>
 */
export const DatePickerPopover: Story = {
  name: "DatePicker popover",
  render: (args) => <DatePicker {...args} />,
  args: {
    id: "datepicker-5",
    mode: "single",
    displayAs: "popover",
    weekStartDay: 1,
    shortcuts,
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
    id: "datepicker-6",
    mode: "range",
    displayAs: "popover",
    weekStartDay: 1,
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
    id: "datepicker-7",
    mode: "single",
    displayAs: "popover",
    weekStartDay: 1,
    calendarYears: Array.from(
      { length: 50 },
      (_, i) => new Date().getFullYear() - 50 + i,
    ),
    shortcuts,
  },
};
