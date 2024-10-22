import type { Meta, StoryObj } from "@storybook/react";
import Indicator, { colors, positions, sizes } from "./Indicator";
import Icon from "../Icon";

const meta: Meta<typeof Indicator> = {
  component: Indicator,
  argTypes: {
    value: {
      control: { type: "number" },
      table: { defaultValue: { summary: "undefined" } },
    },
    position: {
      options: Object.keys(positions),
      control: { type: "inline-radio" },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "select" },
    },
    color: {
      options: colors,
      control: { type: "select" },
    },
    children: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Indicator>;

export const IndicatorWithChildren: Story = {
  name: "Indicator with children",
  args: {
    value: 100,
    position: "top-right",
    size: "sm",
    color: "critical",
    children: <Icon icon="message-alert-square" size="lg" />,
  },
};

export const IndicatorOnly: Story = {
  name: "Indicator only",
  args: {
    value: 42,
    position: "top-right",
    size: "lg",
    color: "main",
  },
};

export const IndicatorDot: Story = {
  name: "Indicator dot",
  args: {
    position: "top-right",
    size: "lg",
    color: "main",
  },
};
