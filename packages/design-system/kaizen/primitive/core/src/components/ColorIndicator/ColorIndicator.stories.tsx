import type { Meta, StoryObj } from "@storybook/react-vite";

import ColorIndicator from "./ColorIndicator";

/**
 * Render a visual color indication that can be either a line or a block<br>
 * As a line, it fills the entire height of the container.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=12096-5" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof ColorIndicator> = {
  component: ColorIndicator,
  argTypes: {
    color: {
      control: { type: "color" },
      table: { type: { summary: "string" } },
    },
    type: {
      options: ["line", "block"],
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    size: {
      options: ["2xs", "xs", "sm", "md", "lg"],
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ColorIndicator>;

export const Primary: Story = {
  name: "ColorIndicator",
  render: (args) => (
    <div className="h-[64px]">
      <ColorIndicator {...args} />
    </div>
  ),
  args: {
    color: "#2563eb",
    type: "block",
    size: "md",
  },
};
