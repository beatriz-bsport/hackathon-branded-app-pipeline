import type { Meta, StoryObj } from "@storybook/react";
import Icon, { icons, sizes } from "./Icon";

/**
 * Generic Icon React component allowing to render any<br>
 * Tutorial <a href="https://medium.com/@mateuszpalka/creating-your-custom-svg-icon-library-in-react-a5ff1c4c704a" target="_blank">here</a>
 */
const meta: Meta<typeof Icon> = {
  component: Icon,
  argTypes: {
    icon: {
      options: Object.keys(icons),
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "select" },
      type: { name: "string", required: true },
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
