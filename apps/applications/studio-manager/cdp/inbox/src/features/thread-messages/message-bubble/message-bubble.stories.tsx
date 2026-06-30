import type { Meta, StoryObj } from "@storybook/react-vite";

import { CHANNEL_TYPES } from "#src/components/channel/constants";
import { storybookDecorator } from "#src/utils/storybook-decorator";

import { MessageBubble, type MessageBubbleProps } from "./message-bubble";

const EMAIL_BODY =
  "Hi,\n\nI was trying to book the 9am reformer Pilates tomorrow but it shows as full on the app. Is there a waitlist I can join? Or do you have any other morning slots available?\n\nThanks!\nEmma\n\n--\nSent from my iPhone";

const baseArgs: MessageBubbleProps = {
  sender: "member",
  channel: "email",
  title: "Re: Refund request",
  content: EMAIL_BODY,
  timestamp: "12:00",
};

const meta: Meta<typeof MessageBubble> = {
  title: "Inbox/MessageBubble",
  component: MessageBubble,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A single message in a conversation thread, rendered as a chat bubble. `sender` picks the green (studio/outbound) vs grey (member/inbound) variant; `channel` drives the header/footer marker. SMS and in_app are title-less, and in_app has no channel header. The body is rendered as sanitized rich text (HTML for email).",
      },
    },
  },
  args: baseArgs,
  argTypes: {
    sender: { control: "inline-radio", options: ["studio", "member"] },
    channel: {
      control: "inline-radio",
      options: [...CHANNEL_TYPES],
    },
    status: {
      control: "inline-radio",
      options: [undefined, "success", "failed", "processing"],
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MessageBubble>;

export const MemberEmail: Story = {};

export const StudioEmail: Story = {
  args: {
    sender: "studio",
    status: "success",
  },
};

export const SmsNoTitle: Story = {
  args: {
    channel: "sms",
    title: undefined,
    content: "Thanks for the reminder",
  },
};

export const Push: Story = {
  args: {
    channel: "push",
    title: "Class starting soon",
    content: "Your spin class starts in 30 minutes.",
  },
};

export const Chat: Story = {
  args: {
    channel: "in_app",
    title: undefined,
    content: "I am helping you here!",
  },
};

export const StudioFailed: Story = {
  args: {
    sender: "studio",
    channel: "sms",
    title: undefined,
    content: "Reminder: your spin class is at 6pm today.",
    status: "failed",
  },
};

export const StudioProcessing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An in-flight outbound message — the footer shows a "Sending…" affordance in place of the timestamp until the send resolves.',
      },
    },
  },
  args: {
    sender: "studio",
    channel: "sms",
    title: undefined,
    content: "On my way, see you in 5!",
    status: "processing",
  },
};

export const AgentNoChannel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An agent reply carries no channel, so it folds to an outbound bubble with no channel header or footer marker — just the timestamp.",
      },
    },
  },
  args: {
    sender: "studio",
    channel: null,
    title: undefined,
    content: "Happy to help — I've found three morning slots for you.",
    status: "success",
  },
};

export const LongTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A title longer than the bubble width is truncated to a single line with an ellipsis, matching the thread list item.",
      },
    },
  },
  args: {
    title:
      "Re: Refund request for the 9am reformer Pilates class I could not attend last Tuesday morning",
  },
  render: (args) => (
    // Constrain the width so the long title actually overflows and truncates.
    <div className="w-[360px]">
      <MessageBubble {...args} />
    </div>
  ),
};

export const RichHtmlBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Email body containing HTML. It is sanitized with DOMPurify before rendering, so the `<script>` tag and the `onerror` attribute below are stripped.",
      },
    },
  },
  args: {
    content:
      '<p>Great news! We added a <strong>new Zumba class</strong> with Ricardo on Tuesdays at 6 PM.</p><ul><li>Sign up now</li><li>Bring a friend</li></ul><script>alert("xss")</script><img src="x" onerror="alert(1)" />',
  },
};

export const SenderChannelGrid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every sender × channel combination side by side. The bubble is block-level, so each column constrains its width while the bubbles fill it.",
      },
    },
  },
  render: (args) => {
    const samples: Record<
      (typeof CHANNEL_TYPES)[number],
      Partial<MessageBubbleProps>
    > = {
      email: { title: "Re: Refund request", content: EMAIL_BODY },
      sms: { title: undefined, content: "Thanks for the reminder" },
      push: {
        title: "Class starting soon",
        content: "Your spin class starts in 30 minutes.",
      },
      in_app: { title: undefined, content: "I am helping you here!" },
    };

    return (
      <div className="flex gap-md">
        {(["studio", "member"] as const).map((sender) => (
          <div key={sender} className="flex w-[360px] flex-col gap-sm">
            {CHANNEL_TYPES.map((channel) => (
              <MessageBubble
                key={channel}
                {...args}
                sender={sender}
                channel={channel}
                status={sender === "studio" ? "success" : undefined}
                {...samples[channel]}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};
