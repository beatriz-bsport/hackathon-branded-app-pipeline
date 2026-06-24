import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import Toggle from "./Toggle";

/**
 * React component implementing all the types of toggles used in Kaizen.<br>
 * The toggle is a compact component that represents a binary choice.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2069-5647&t=2SAiXqiGuDQ3LIix-4" target="_blank">Figma</a><br>
 * <a href="https://docs.infra.bsport.io/docs/kaizen/dev/components/toggle" target="_blank">Kaizen docs</a>
 */
const meta: Meta<typeof Toggle> = {
  component: Toggle,
  argTypes: {
    checked: {
      control: { type: "boolean" },
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
    fullWidth: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    onToggleChange: {
      table: { type: { summary: "function" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Primary: Story = {
  name: "Toggle",
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <Toggle
        {...args}
        checked={checked}
        onToggleChange={() => setChecked(!checked)}
      />
    );
  },
  args: {
    checked: false,
    label: "Label placeholder",
    id: "toggle-1",
    required: false,
    disabled: false,
    helperText: "",
    errorText: "",
    direction: "start",
    onToggleChange: () => console.log("onToggleChange"),
  },
};

export const FullWidth: Story = {
  name: "Toggle Full Width",
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <div className="w-[360px] rounded-md border border-stroke-thin p-md">
        <Toggle
          {...args}
          checked={checked}
          onToggleChange={() => setChecked(!checked)}
        />
      </div>
    );
  },
  args: {
    checked: false,
    label: "Enable notifications",
    id: "toggle-full-width",
    helperText: "Receive updates about your segment activity.",
    direction: "end",
    fullWidth: true,
    onToggleChange: () => console.log("onToggleChange"),
  },
};
