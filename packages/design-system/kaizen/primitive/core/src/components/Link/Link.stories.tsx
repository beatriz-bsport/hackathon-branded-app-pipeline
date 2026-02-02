import type { Meta, StoryObj } from "@storybook/react-vite";

import { icons } from "#src/components/Icon";

import Link, { colors, weights } from "./Link";

/**
 * The Link component is used to render hyperlinks with various customization options
 * including different colors, font weights, and an optional icon on the left.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=3008-1186&t=L0dgj1SsTNjjcAKF-4" target="_blank">Figma</a>
 */
const meta: Meta<typeof Link> = {
  component: Link,
  argTypes: {
    color: {
      options: Object.keys(colors),
      control: { type: "select" },
    },
    weight: {
      options: Object.keys(weights),
      control: { type: "inline-radio" },
    },
    icon: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      type: { name: "string" },
    },
    isUnderlined: {
      control: { type: "boolean" },
      type: { name: "boolean" },
    },
    children: {
      control: { type: "text" },
    },
    href: {
      control: { type: "text" },
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
    avatarProps: {
      size: "md",
      shape: "round",
      initials: "DD",
    },
    icon: undefined,
    isUnderlined: true,
    children: "Link text here",
    href: "",
    target: "_blank",
  },
};
