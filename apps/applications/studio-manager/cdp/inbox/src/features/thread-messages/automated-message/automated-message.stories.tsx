import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import {
  AutomatedMessage,
  type AutomatedMessageProps,
  type AutomatedMessageType,
} from "./automated-message";

const EMAIL_BODY =
  "<p>New! We are changing our booking platform to <strong>Bsport</strong>.</p><p>We invite you to follow the <strong>3 steps</strong> below to register on the platform accessible on your computer and book all your next sessions.</p><ul><li>Access to Bsport</li><li>Reset your password</li></ul>";

const MESSAGE_TYPES: AutomatedMessageType[] = [
  "campaign",
  "transactional_notification",
  "auto_message",
  "automation",
  "audience",
  "franchise",
];

const baseArgs: AutomatedMessageProps = {
  channel: "email",
  messageType: "campaign",
  title: "Summer Special Campaign",
  timestamp: "10:00",
  subject: "Coolest Campaign",
  content: EMAIL_BODY,
};

const meta: Meta<typeof AutomatedMessage> = {
  title: "Inbox/AutomatedMessage",
  component: AutomatedMessage,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'A single automated/campaign message in a conversation thread, rendered as a compact card whose header expands ("Show more" / "Show less") to reveal a per-channel preview. `messageType` labels the origin and `channel` drives the header icon; `failed` replaces the timestamp with a red "Failed" label. Email previews render sanitized HTML; sms/push render plain text. Presentational only.',
      },
    },
  },
  args: baseArgs,
  argTypes: {
    channel: { control: "inline-radio", options: ["email", "sms", "push"] },
    messageType: { control: "inline-radio", options: MESSAGE_TYPES },
    status: {
      control: "inline-radio",
      options: [undefined, "success", "failed", "processing"],
    },
    defaultExpanded: { control: "boolean" },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AutomatedMessage>;

export const EmailCollapsed: Story = {};

export const EmailExpanded: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Expanded email preview. The body is sanitized with DOMPurify before rendering, so the `<script>` tag and the `onerror` attribute below are stripped.",
      },
    },
  },
  args: {
    defaultExpanded: true,
    content:
      EMAIL_BODY +
      '<script>alert("xss")</script><img src="x" onerror="alert(1)" />',
  },
};

export const Sms: Story = {
  args: {
    channel: "sms",
    subject: undefined,
    content:
      "Reminder: your spin class is at 6pm today. Reply STOP to opt out.",
    defaultExpanded: true,
  },
};

export const Push: Story = {
  args: {
    channel: "push",
    subject: "Class starting soon",
    content: "Your spin class starts in 30 minutes.",
    defaultExpanded: true,
  },
};

export const Failed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A failed (undelivered) automated message — the timestamp is replaced by a red "Failed" label, while the message type stays neutral.',
      },
    },
  },
  args: {
    status: "failed",
    defaultExpanded: true,
  },
};

export const Processing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An in-flight automated send — the timestamp is replaced by a "Sending…" label until the send resolves.',
      },
    },
  },
  args: {
    status: "processing",
    defaultExpanded: true,
  },
};

export const LongTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A title longer than the card width is truncated to a single line with an ellipsis, keeping the header on one row.",
      },
    },
  },
  args: {
    title:
      "Summer Special Campaign for all members who booked a reformer Pilates class last month",
  },
  render: (args) => (
    // Constrain the width so the long title actually overflows and truncates.
    <div className="w-[404px]">
      <AutomatedMessage {...args} />
    </div>
  ),
};

export const MessageTypeGrid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every message type side by side, so the meta label for each origin can be compared at a glance.",
      },
    },
  },
  render: (args) => (
    <div className="flex w-[404px] flex-col gap-sm">
      {MESSAGE_TYPES.map((messageType) => (
        <AutomatedMessage
          key={messageType}
          {...args}
          messageType={messageType}
        />
      ))}
    </div>
  ),
};
