import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Divider, { orientations, weights } from "./Divider";

/**
 * The Divider component is a visual element used to separate content into distinct sections
 * styling options, including different orientations and weights.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=1198-1943&node-type=canvas&t=TZLBnY8RXKPKitW4-0" target="_blank">Figma</a>
 */
const meta: Meta<typeof Divider> = {
  component: Divider,
  argTypes: {
    orientation: {
      options: Object.keys(orientations),
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
    },
    weight: {
      options: Object.keys(weights),
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Divider>;

/**
 * On this story we added a decorator so that we could test the Divider component with a real height set
 */
export const Primary: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: "100px" }}>
        <Story />
      </div>
    ),
  ],
  name: "Divider",
  args: {
    orientation: "horizontal",
    weight: "thin",
  },
};
