import type { Meta, StoryObj } from "@storybook/react-vite";

import Loader, { sizes } from "./Loader";

/**
 * Rendering an animated loader with three circles.
 * It's wrapped inside a centered container where you can add custom classes to position it. * @param props.className Classname to add to the wrapper of the loader.
 */
const meta: Meta<typeof Loader> = {
  component: Loader,
  argTypes: {
    className: {
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

type Story = StoryObj<typeof Loader>;

/**
 * This example demonstrates the Loader component centered within its container.
 */
export const Primary: Story = {
  name: "Loader",
  args: {
    className:
      "h-[500px] w-[500px] border-stroke-default border-stroke-thin text-onsurface-default",
    size: "xl",
  },
};
