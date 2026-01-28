import type { Meta, StoryObj } from "@storybook/react-vite";

import ErrorFallback from "./ErrorFallback";

/**
 * The ErrorFallback component is used to display a consistent error state when something goes wrong.
 * It provides a user-friendly error message with an optional action button to help users recover from the error.
 *
 * The component includes an error illustration, title, subtitle, description, and optional action button.
 * All text content is internationalized with sensible defaults.
 *
 * @figma https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=14638-44849&m=dev
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-errorfallback--docs
 */
const meta: Meta<typeof ErrorFallback> = {
  component: ErrorFallback,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "We're sorry —" },
      },
    },
    subtitle: {
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "something went wrong on our side." },
      },
    },
    description: {
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        defaultValue: {
          summary:
            "We've logged the issue and our team is working hard to resolve it.\\nIn the meantime, try refreshing the page.",
        },
      },
    },
    actionProps: {
      control: { type: "object" },
      table: {
        type: { summary: "Partial<ButtonProps>" },
        defaultValue: { summary: "undefined" },
      },
    },
    className: {
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorFallback>;

export const Default: Story = {
  name: "Default",
  args: {},
};

export const WithActionButton: Story = {
  name: "With Action Button",
  args: {
    actionProps: {
      onClick: () => {
        console.log("Try again clicked");
        // In a real scenario, this would typically trigger a retry or redirect
      },
    },
  },
};

export const WithDefaultActionButton: Story = {
  name: "With Default Action Button (Reload)",
  args: {
    actionProps: ErrorFallback.DEFAULT_ACTION_PROPS,
  },
};

export const CustomContent: Story = {
  name: "Custom Content",
  args: {
    title: "Oops! Something broke",
    subtitle: "our servers are having a bad day.",
    description:
      "Don't worry, our team has been notified and is working on it.\nPlease try again in a few minutes.",
    actionProps: {
      label: "Reload page",
      onClick: () => {
        console.log("Reload page clicked");
        window.location.reload();
      },
    },
  },
};

export const WithoutDescription: Story = {
  name: "Without Description",
  args: {
    description: "",
    actionProps: {
      onClick: () => console.log("Try again clicked"),
    },
  },
};

export const MinimalError: Story = {
  name: "Minimal Error",
  args: {
    title: "Error",
    subtitle: "",
    description: "",
  },
};

export const NetworkError: Story = {
  name: "Network Error Example",
  args: {
    title: "Connection Lost",
    subtitle: "we couldn't reach our servers.",
    description: "Please check your internet connection and try again.",
    actionProps: {
      label: "Retry",
      iconLeft: "refresh-cw-01",
      onClick: () => console.log("Retry network request"),
    },
  },
};

export const CrashFeedbackError: Story = {
  name: "With crash report form example",
  args: {
    title: "Connection Lost",
    subtitle: "we couldn't reach our servers.",
    description: "Please check your internet connection and try again.",
    actionProps: {
      onClick: () => console.log("reload page"),
    },
    onSendFeedback: ({ feedbackContent }) =>
      console.log("Here is the user feedback : ", feedbackContent),
  },
};
