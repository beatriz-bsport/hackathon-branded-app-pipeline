import type { Meta, StoryObj } from "@storybook/react-vite";

import Body, { colors, htmlVariants, sizes, weights } from "./Body";

/**
 * The Body component is a fundamental component used to render text with various
 * styling options, including different colors, HTML variants, and font weights.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=3578-8330&t=L0dgj1SsTNjjcAKF-4" target="_blank">Figma</a>
 */
const meta: Meta<typeof Body> = {
  component: Body,
  argTypes: {
    htmlVariant: {
      options: Object.keys(htmlVariants),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "select" },
      type: { name: "string", required: true },
    },
    color: {
      options: Object.keys(colors),
      control: { type: "select" },
      type: { name: "string", required: true },
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

type Story = StoryObj<typeof Body>;

export const Primary: Story = {
  name: "Body",
  args: {
    htmlVariant: "p",
    size: "lg",
    color: "default",
    weight: "strong",
    children:
      "Lorem ipsum dolor sit amet consectetur. Elementum mauris eget donec adipiscing morbi orci. In cursus urna morbi platea ullamcorper hendrerit. Adipiscing dolor tincidunt purus velit mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
  },
};
