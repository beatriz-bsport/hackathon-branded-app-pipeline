import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import TimePicker from "./TimePicker";

/**
 * A time picker component that allows users to select a time from a list of options.
 * The input field itself triggers the popover for time selection.
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=12337-39216" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof TimePicker> = {
  component: TimePicker,
  argTypes: {
    disabled: {
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    id: { control: "text" },
    interval: {
      control: { type: "number", min: 1, step: 1 },
      table: { defaultValue: { summary: "15" } },
    },
    label: { control: "text" },
    required: {
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    value: {
      control: "text",
      table: {
        defaultValue: { summary: "" },
      },
    },
    onChange: { table: { type: { summary: "function" } } },
  },
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Primary: Story = {
  name: "TimePicker",
  render: (args) => {
    const [value, setValue] = useState(args.value);

    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <TimePicker
        {...args}
        value={value}
        onChange={(date) => {
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          setValue(`${hours}:${minutes}`);
          console.log("Selected date:", date);
        }}
      />
    );
  },
  args: {
    id: "timepicker-1",
    interval: 30,
    label: "Select a time",
    disabled: false,
    required: false,
    value: "13:00",
  },
};
