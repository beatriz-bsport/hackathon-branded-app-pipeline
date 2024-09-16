import type { Meta, StoryObj } from "@storybook/react";
import Body, { colors, htmlVariants, sizes, weights } from "./Body";

const meta: Meta<typeof Body> = {
  component: Body,
  argTypes: {
    size: {
      options: Object.keys(sizes),
      control: {
        type: "select",
      },
    },
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
    htmlVariant: {
      options: Object.keys(htmlVariants),
      control: {
        type: "inline-radio",
      },
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
    children:
      "Lorem ipsum dolor sit amet consectetur. Elementum mauris eget donec adipiscing morbi orci. In cursus urna morbi platea ullamcorper hendrerit. Adipiscing dolor tincidunt purus velit mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
    size: "lg",
    color: "default",
    weight: "strong",
  },
};
