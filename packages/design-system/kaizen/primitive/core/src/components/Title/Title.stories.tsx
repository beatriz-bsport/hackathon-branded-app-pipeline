import type { Meta, StoryObj } from "@storybook/react-vite";

import Title, { colors, htmlVariants, weights } from "./Title";

/**
 * The Title component is a fundamental component used to render text with various
 * styling options, including different colors, HTML variants, and font weights.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=3578-8855&t=L0dgj1SsTNjjcAKF-4" target="_blank">Figma</a>
 */
const meta: Meta<typeof Title> = {
  component: Title,
  argTypes: {
    htmlVariant: {
      options: Object.keys(htmlVariants),
      control: { type: "select" },
      type: { name: "string", required: true },
    },
    color: {
      options: Object.keys(colors),
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    weight: {
      options: Object.keys(weights),
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
    },
    children: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Title>;

export const Primary: Story = {
  name: "Title",
  args: {
    htmlVariant: "h1",
    color: "default",
    weight: "strong",
    children: "Any title you might think",
  },
};
