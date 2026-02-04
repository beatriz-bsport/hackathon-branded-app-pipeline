import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";

import Checkbox from "./Checkbox";

/**
 * React component implementing all the types of checkboxes used in Kaizen.<br>
 * A checkbox is represented by 3 possible states: checked, indeterminate, and unchecked.<br>
 * Indeterminate is a checkbox that is neither checked nor unchecked, and used to indicate that an option is partially selected.<br>
 * The change of state is managed outside the component.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=101-2833&t=ILcpgvtnyTJVg8PE-4" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/form-controls/checkbox/component-overview-Lp4DvbRG" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  argTypes: {
    value: {
      control: { type: "inline-radio" },
    },
    label: {
      control: { type: "text" },
    },
    id: {
      control: { type: "text" },
    },
    required: {
      control: { type: "boolean" },
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
    direction: {
      options: ["start", "end"],
      control: { type: "inline-radio" },
    },
    onChange: {
      table: { type: { summary: "function" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const CheckboxCheckedUnchecked: Story = {
  name: "Checkbox checked-unchecked",
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Checkbox
        {...args}
        value={value}
        onChange={(checked) => setValue(checked ? "checked" : "unchecked")}
      />
    );
  },
  args: {
    value: "checked",
    label: "Label placeholder",
    id: "checkbox-1",
    required: false,
    disabled: false,
    helperText: "",
    errorText: "",
    direction: "start",
    onChange: () => console.log("onChange"),
  },
};

export const CheckboxIndeterminateUnchecked: Story = {
  name: "Checkbox indeterminate-unchecked",
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Checkbox
        {...args}
        value={value}
        onChange={(checked) =>
          setValue(checked ? "indeterminate" : "unchecked")
        }
      />
    );
  },
  args: {
    value: "indeterminate",
    label: "Label placeholder",
    id: "checkbox-2",
    required: false,
    disabled: false,
    helperText: "",
    errorText: "",
    direction: "start",
    onChange: () => console.log("onChange"),
  },
};

export const CheckboxIndeterminateChecked: Story = {
  name: "Checkbox indeterminate-checked",
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Checkbox
        {...args}
        value={value}
        onChange={() =>
          setValue(value === "indeterminate" ? "checked" : "indeterminate")
        }
      />
    );
  },
  args: {
    value: "indeterminate",
    label: "Label placeholder",
    id: "checkbox-3",
    required: false,
    disabled: false,
    helperText: "",
    errorText: "",
    direction: "start",
    onChange: () => console.log("onChange"),
  },
};
