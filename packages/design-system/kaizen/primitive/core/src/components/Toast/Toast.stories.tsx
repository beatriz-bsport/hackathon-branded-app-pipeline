import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Button from "#src/components/Button";
import { icons } from "#src/components/Icon";

import Toast, { statuses } from "./Toast";
import { dismissToast, toast } from "./ToastManager";

/**
 * Renders a toast notification.<br>
 * A toast is a short message that appears and disappears automatically after a certain duration.<br>
 *
 * <b>How?<b><br>
 * Use the `toast` function to display a toast notification.
 * This component is used by the `ToastManager` to render multiple stacked toast notifications.
 *
 * <b>Why?<b><br>
 * The ToastManager component handles showing, hiding, and managing toasts.
 * It is responsible for animating in and out new toasts and removing them when
 * the user clicks the close button or the toast is dismissed after a certain
 * duration. The component also manages the hover state of the toast group,
 * which causes the toasts to scale up and down when the user hovers over the
 * group.
 *
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
  parameters: {
    docs: {
      source: {
        code: `
import Button from "#src/components/Button";
import { toast } from "#src/components/Toast";

<Button
  label="Show Toast"
  size="md"
  intent="default"
  color="main"
  onClick={() => toast({
    status: "default",
    title: "This is a nice title here.",
    description: "This is a beautiful toast.",
    icon: "message-alert-square",
    buttonLabel: "Undo",
    onButtonClick: () => console.log("Button clicked!"),
    onDismiss: () => null,
    duration: 5000
  })}
/>;`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Toaster: Story = {
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

export const ToastFullConfiguration: Story = {
  args: {
    status: "default",
    title: "This is a nice title here.",
    description: "This is a beautiful toast.",
    icon: "message-alert-square",
    buttonIcon: "x-close",
    buttonLabel: "Close",
    onButtonClick: () => console.log("Button clicked!"),
    onDismiss: () => null,
    duration: 5000,
  },
};

export const ToastActionUndoneConfiguration: Story = {
  args: {
    status: "default",
    title: "Action undone",
    icon: "reverse-left",
    buttonIcon: "x-close",
    onButtonClick: () => console.log("Button clicked!"),
    onDismiss: () => null,
    duration: 5000,
  },
};

export const IndefiniteToaster: Story = {
  render: (args) => {
    const [toastId, setToastId] = React.useState<string | null>(null);
    const onShowClick = () => {
      if (!toastId) {
        const id = toast({
          ...args,
          duration: 0,
          onDismiss: () => setToastId(null),
        });
        setToastId(id);
      }
    };

    const onDismissClick = () => {
      if (toastId) {
        dismissToast(toastId);
        setToastId(null);
      }
    };

    return (
      <div className="flex items-center gap-md">
        <Button
          label="Show Toast"
          size="md"
          intent="default"
          color="main"
          onClick={onShowClick}
        />
        <Button
          label="Dismiss Toast"
          size="md"
          intent="call-to-action"
          color="critical"
          onClick={onDismissClick}
        />
      </div>
    );
  },
  args: {
    status: "default",
    title: "This is a nice title here.",
    description: "This is a beautiful toast.",
    icon: "message-alert-square",
    onDismiss: () => null,
    duration: 0,
  },
};
