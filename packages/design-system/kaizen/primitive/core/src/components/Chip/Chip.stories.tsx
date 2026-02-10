import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { icons } from "#src/components/Icon";

import Chip, { colors, sizes } from "./Chip";

/**
 * React component for a chip element. It is a compact component that can be used to
 * represent a small piece of information, such as a tag, a label, a status, or an action.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=490-3106" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/chip/component-overview-W7G0WBp0" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Chip> = {
  component: Chip,
  argTypes: {
    label: { control: "text" },
    type: {
      options: ["weak", "strong"],
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    color: {
      options: colors,
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    iconLeft: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    dismissible: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    customColor: {
      control: { type: "text" },
      table: { type: { summary: "string" } },
    },
    rounded: {
      options: [undefined, "lg"],
      control: { type: "inline-radio" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    onClick: {
      table: { type: { summary: "function" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Primary: Story = {
  name: "Chip",
  render: (args) => {
    const [dismissed, setDismissed] = useState(false);
    const handleDismiss = () => setDismissed(true);
    if (dismissed) {
      return <div>Dismissed</div>;
    }
    return <Chip {...args} onClick={handleDismiss} />;
  },
  args: {
    label: "Chip",
    type: "weak",
    color: "main",
    size: "lg",
    iconLeft: undefined,
    dismissible: false,
    customColor: undefined,
    rounded: undefined,
    onClick: () => console.log("Dismissed"),
  },
};

export const CustomColor: Story = {
  name: "Chip - Custom color",
  args: {
    label: "Custom color",
    type: "weak",
    color: "default",
    size: "lg",
    customColor: "#7C3AED",
    dismissible: false,
    rounded: "lg",
    iconLeft: undefined,
  },
};
