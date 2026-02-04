import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Icon from "#src/components/Icon";

import Indicator, { colors, positions, sizes } from "./Indicator";

/**
 * React component to display an Indicator for numeric notifications or status updates,
 * appearing beside the content it accompanies.<br>
 * If the value provided is greater than 99, it renders automatically as 99+.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=4704-20301&t=ZtkrBznxVQLOUSjH-4" target="_blank">Figma</a>
 */
const meta: Meta<typeof Indicator> = {
  component: Indicator,
  argTypes: {
    value: {
      control: { type: "number" },
    },
    position: {
      options: Object.keys(positions),
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
    },
    color: {
      options: colors,
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
      type: { name: "string", required: true },
    },
    children: {
      options: [undefined, "icon"],
      control: { type: "inline-radio" },
      mapping: {
        undefined: undefined,
        icon: <Icon icon="message-alert-square" size="lg" />,
      },
      table: { type: { summary: "ReactNode" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Indicator>;

export const IndicatorWithChildren: Story = {
  name: "Indicator with children",
  args: {
    value: 100,
    position: "top",
    size: "sm",
    color: "critical",
    children: "icon",
  },
};

export const IndicatorOnly: Story = {
  name: "Indicator only",
  args: {
    value: 42,
    position: "top",
    size: "lg",
    color: "main",
  },
};

export const IndicatorDot: Story = {
  name: "Indicator dot",
  args: {
    position: "bottom",
    size: "lg",
    color: "main",
  },
};
