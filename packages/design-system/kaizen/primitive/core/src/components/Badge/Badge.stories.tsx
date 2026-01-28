import type { Meta, StoryObj } from "@storybook/react-vite";

import { icons } from "#src/components/Icon";

import Badge, { colors, sizes } from "./Badge";

/**
 * React component to render a badge with customizable text and icon.<br>
 * This component is different from Indicator and is meant to be placed alongside other elements.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=4776-21978&t=ZtkrBznxVQLOUSjH-4" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/button/component-overview-QBd7W5N2" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Badge> = {
  component: Badge,
  argTypes: {
    text: {
      control: { type: "text" },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    color: {
      options: colors,
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    icon: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: { type: { summary: "string" } },
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
