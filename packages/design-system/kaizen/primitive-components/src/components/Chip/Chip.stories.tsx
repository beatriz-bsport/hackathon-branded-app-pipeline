import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Chip, { colors, sizes, types } from "./Chip";
import { icons } from "../Icon";

const meta: Meta<typeof Chip> = {
  component: Chip,
  argTypes: {
    label: { control: "text", required: true },
    type: {
      options: Object.keys(types),
      control: { type: "inline-radio" },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
    },
    color: {
      options: colors,
      control: { type: "select" },
    },
    iconLeft: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: { defaultValue: { summary: "undefined" } },
    },
    dismissible: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
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
    size: "lg",
    color: "main",
    iconLeft: undefined,
    dismissible: false,
    onClick: () => console.log("Dismissed"),
  },
};
