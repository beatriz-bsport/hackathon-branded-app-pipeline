import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";

/**
 * Accessible field label text paired with form controls.<br>
 * Label associates visible text with a form control via htmlFor.
 */
const meta: Meta<typeof Label> = {
  component: Label,
  title: "Components/Label",
  args: {
    required: false,
    label: "This is my label",
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};
