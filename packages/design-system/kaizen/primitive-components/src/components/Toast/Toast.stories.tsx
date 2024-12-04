import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { icons } from "#src/components/Icon";
import Button from "#src/components/Button";
import Toast, { statuses } from "./Toast";
import { toast, ToastProvider } from "./ToastProvider";

/**
 * A component that renders a toast notification.<br>
 * A toast is a short message that appears and disappears automatically after a certain duration.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=1144-13311" target="_blank">Figma</a>
 */
const meta: Meta<typeof Toast> = {
  component: Toast,
  argTypes: {
    status: {
      options: Object.keys(statuses),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
    icon: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    buttonLabel: {
      control: { type: "text" },
    },
    onButtonClick: {
      table: { type: { summary: "function" } },
    },
    duration: {
      control: { type: "number" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Primary: Story = {
  name: "Toast",
  render: (args) => {
    return (
      <div>
        <Button
          label="Show Toast"
          size="md"
          intent="default"
          color="main"
          onClick={() => toast(args)}
        />
        <ToastProvider />
      </div>
    );
  },
  args: {
    status: "default",
    title: "This is a nice title here.",
    description: "This is a beautiful toast.",
    icon: "message-alert-square",
    buttonLabel: "Undo",
    onButtonClick: () => console.log("Button clicked!"),
    onDismiss: () => null,
    duration: 5000,
  },
};
