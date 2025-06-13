import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { icons } from "#src/components/Icon";
import { Placements } from "#src/hooks/placement-classes.hook";

import Select, { sizes, statuses } from "./Select";

/**
 * A custom select component that displays a button which, when clicked or activated via a keyboard,
 * reveals a popover with selectable items. This component supports both controlled and uncontrolled modes,
 * integrates well with forms by allowing submission of the selected value, and provides accessibility features.<br>
 *
 * - **Controlled Mode**: Pass the `value` prop to control the selected value externally. Use `onSelect` to handle changes.<br>
 * - **Uncontrolled Mode**: Pass the `defaultValue` prop to initialize the selected value internally. The component manages its own state.<br>
 *
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=331-23641" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Select> = {
  component: Select,
  argTypes: {
    id: { control: { type: "text" } },
    name: { control: { type: "text" } },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
    },
    status: {
      options: Object.keys(statuses),
      control: { type: "select" },
      table: { defaultValue: { summary: "default" } },
    },
    value: { control: { type: "text" } },
    defaultValue: { control: { type: "text" } },
    items: {
      table: {
        type: {
          summary: "(TitleItem | DividerItem | MenuOption)[]",
        },
      },
    },
    iconLeft: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    disabled: {
      control: { type: "boolean" },
    },
    helperText: {
      control: { type: "text" },
    },
    errorText: {
      control: { type: "text" },
    },
    popoverPlacement: {
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"bottom-left"' },
      },
      options: [undefined, ...Object.values(Placements)],
      control: { type: "select" },
    },
    onSelect: {
      table: { type: { summary: "function" } },
    },
  },
  parameters: {
    docs: {
      story: {
        height: "30vh",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  name: "Select",
  args: {
    id: "select-1",
    name: "select-1",
    size: "md",
    status: "default",
    defaultValue: "Select an option",
    items: [
      { id: "option-1", label: "Option 1" },
      { id: "option-2", label: "Option 2" },
      { id: "option-3", label: "Option 3" },
    ],
    iconLeft: "arrow-right",
    disabled: false,
    helperText: "",
    errorText: "",
    popoverPlacement: undefined,
    onSelect: (option) => console.log(`Selected option: ${option}`),
    fullWidth: false,
  },
};

/**
 * This example demonstrates selecting an option and displaying a modified, abbreviated value.
 */
export const ControlledValue: Story = {
  name: "Controlled value",
  render: (args) => {
    const [value, setValue] = useState(args.value);

    const handleSelect = (option: string) => {
      setValue(option.replace("Option", "Opt. "));
    };

    return <Select {...args} value={value} onSelect={handleSelect} />;
  },
  args: {
    id: "select-1",
    name: "select-1",
    size: "md",
    status: "default",
    value: "Select an option",
    items: [
      { id: "option-1", label: "Option 1" },
      { id: "option-2", label: "Option 2" },
      { id: "option-3", label: "Option 3" },
    ],
    iconLeft: "arrow-right",
    disabled: false,
    helperText: "",
    errorText: "",
    popoverPlacement: undefined,
    onSelect: (option) => console.log(`Selected option: ${option}`),
  },
};
