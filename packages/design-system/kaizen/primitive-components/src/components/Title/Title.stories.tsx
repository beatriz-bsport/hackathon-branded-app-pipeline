import type { Meta, StoryObj } from "@storybook/react";
import Title, { colors, htmlVariants, weights } from "./Title";

const meta: Meta<typeof Title> = {
  component: Title,
  argTypes: {
    htmlVariant: {
      options: Object.keys(htmlVariants),
      control: { type: "select" },
    },
    children: {
      control: { type: "text" },
    },
    color: {
      options: Object.keys(colors),
      control: { type: "select" },
    },
    weight: {
      options: Object.keys(weights),
      control: { type: "inline-radio" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Title>;

export const Primary: Story = {
  name: "Title",
  args: {
    children: "Any title you might think",
    htmlVariant: "h1",
    color: "default",
    weight: "strong",
  },
};
