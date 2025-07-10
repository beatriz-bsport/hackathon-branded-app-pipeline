import type { Meta, StoryObj } from "@storybook/react";

import CopyToClipboard from "./CopyToClipboard";

const meta: Meta<typeof CopyToClipboard> = {
  component: CopyToClipboard,
  title: "Components/CopyToClipboard",
  argTypes: {
    value: { control: "text" },
    toastMessage: { control: "text" },
    label: { control: "text" },
    tooltip: { control: "text" },
    placement: {
      control: { type: "select" },
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
    },
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "md", "lg"],
    },
    color: {
      control: { type: "select" },
      options: ["default", "main", "critical", "onstrong"],
    },
    intent: {
      control: { type: "select" },
      options: ["flat", "default", "call-to-action"],
    },
    iconLeft: { control: "text" },
    className: { control: "text" },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A button that copies a value to the clipboard and shows a toast confirmation. The button is wrapped in a tooltip for accessibility.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CopyToClipboard>;

export const Primary: Story = {
  name: "Primary",
  args: {
    value: "hello@kaizen.com",
    toastMessage: "Copied!",
    tooltip: "Copy email",
    label: undefined,
    placement: "bottom",
    size: "md",
    color: "default",
    intent: "flat",
    iconLeft: "copy-07",
    disabled: false,
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    value: "disabled@kaizen.com",
    toastMessage: "Copied!",
    tooltip: "Copy email",
    label: undefined,
    placement: "bottom",
    size: "md",
    color: "default",
    intent: "flat",
    iconLeft: "copy-07",
    disabled: true,
  },
};

export const CustomLabelAndColor: Story = {
  name: "Custom label and color",
  args: {
    value: "+33 6 12 34 56 78",
    toastMessage: "Phone copied!",
    tooltip: "Copy phone number",
    label: "Copy phone",
    placement: "bottom",
    size: "md",
    color: "main",
    intent: "flat",
    iconLeft: "copy-07",
    disabled: false,
  },
};
