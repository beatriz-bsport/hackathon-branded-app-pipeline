import type { Meta, StoryObj } from "@storybook/react";
import Icon, { icons, sizes } from "./Icon";

const meta: Meta<typeof Icon> = {
  component: Icon,
  argTypes: {
    icon: {
      options: Object.keys(icons),
      control: { type: "select" },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Primary: Story = {
  name: "Icon",
  args: {
    icon: "arrow-right",
    size: "xl",
    className: "onsurface-default",
  },
};
