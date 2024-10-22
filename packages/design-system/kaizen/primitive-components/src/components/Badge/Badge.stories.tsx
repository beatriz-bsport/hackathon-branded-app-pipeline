import type { Meta, StoryObj } from "@storybook/react";
import Badge, { colors, sizes } from "./Badge";
import { icons } from "../Icon";

const meta: Meta<typeof Badge> = {
  component: Badge,
  argTypes: {
    text: {
      control: { type: "text" },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
    },
    color: {
      options: colors,
      control: { type: "select" },
    },
    icon: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
    },
    children: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  name: "Badge",
  args: {
    text: "Badge",
    size: "lg",
    color: "main",
  },
};
