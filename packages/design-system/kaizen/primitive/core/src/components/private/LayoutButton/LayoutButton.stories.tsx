import type { Meta, StoryObj } from "@storybook/react-vite";

import LayoutButton from "./LayoutButton";

const meta = {
  title: "Components/Private/LayoutButton",
  component: LayoutButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["call-to-action", "default", "flat"],
    },
    color: {
      control: "select",
      options: ["main", "default", "critical", "onstrong", "selected"],
    },
    desktopSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    mobileSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof LayoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CallToAction: Story = {
  args: {
    label: "Add Item",
    iconLeft: "plus",
    intent: "call-to-action",
    color: "main",
    desktopSize: "md",
    mobileSize: "md",
  },
};

export const Default: Story = {
  args: {
    label: "Create",
    intent: "default",
    color: "main",
    desktopSize: "md",
    mobileSize: "md",
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Edit",
    iconLeft: "pencil-02",
    intent: "default",
    color: "main",
    desktopSize: "md",
    mobileSize: "md",
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "Next",
    iconRight: "chevron-right",
    intent: "default",
    color: "main",
    desktopSize: "md",
    mobileSize: "md",
  },
};

export const Flat: Story = {
  args: {
    label: "Cancel",
    intent: "flat",
    color: "default",
    desktopSize: "md",
    mobileSize: "md",
  },
};

export const Critical: Story = {
  args: {
    label: "Delete",
    iconLeft: "trash-01",
    intent: "call-to-action",
    color: "critical",
    desktopSize: "md",
    mobileSize: "md",
  },
};
