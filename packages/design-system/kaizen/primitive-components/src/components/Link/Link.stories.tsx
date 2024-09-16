import type { Meta, StoryObj } from "@storybook/react";
import Link, { colors, weights } from "./Link";
import { icons } from "../Icon";

const meta: Meta<typeof Link> = {
  component: Link,
  argTypes: {
    color: {
      options: Object.keys(colors),
      control: {
        type: "select",
      },
    },
    weight: {
      options: Object.keys(weights),
      control: {
        type: "inline-radio",
      },
    },
    children: {
      control: { type: "text" },
    },
    href: {
      control: { type: "text" },
    },
    icon: {
      options: [undefined, ...Object.keys(icons)],
      control: {
        type: "select",
      },
    },
    isUnderlined: {
      control: { type: "boolean" },
    },
    style: {
      control: { type: "object" },
    },
    target: {
      options: ["_self", "_blank", "_parent", "_top"],
      control: { type: "inline-radio" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Primary: Story = {
  name: "Link",
  args: {
    color: "main",
    weight: "strong",
    children: "Link text here",
    href: "",
    isUnderlined: true,
    target: "_blank",
  },
};
