import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Button from "#src/components/Button";
import { Placements } from "#src/hooks/placement-classes.hook";

import Tooltip from "./Tooltip";

/**
 * React component for a tooltip element. It is a compact component that can be used to
 * represent a small piece of information, such as a hint or a description.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=490-3106" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  argTypes: {
    label: {
      control: "text",
    },
    chip: {
      control: "object",
    },
    placement: {
      options: [undefined, ...Placements],
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    children: {
      control: "object",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const TooltipWithChip: Story = {
  name: "Tooltip with chip",
  args: {
    label: "This is a tooltip",
    placement: "top",
    chip: {
      label: "Chip",
      type: "weak",
      size: "lg",
      color: "main",
    },
  },
  render: (args) => (
    <div className="flex items-center justify-center min-h-3xl">
      <Tooltip {...args}>
        <Button size="md" intent="default" color="main" label="Hover me!" />
      </Tooltip>
    </div>
  ),
};

export const TooltipSimple: Story = {
  name: "Tooltip simple",
  args: {
    label: "Simple",
    placement: "top",
  },
  render: (args) => (
    <div className="flex items-center justify-center min-h-3xl">
      <Tooltip {...args}>
        <Button size="md" intent="default" color="main" label="Hover me!" />
      </Tooltip>
    </div>
  ),
};
