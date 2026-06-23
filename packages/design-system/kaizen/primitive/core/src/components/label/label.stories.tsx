import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";

/**
 * Accessible field label text paired with form controls.<br>
 * Label associates visible text with a form control via htmlFor.
 * <br>
 * <a href="https://docs.infra.bsport.io/docs/kaizen/dev/components/label" target="_blank">Kaizen docs</a>
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
