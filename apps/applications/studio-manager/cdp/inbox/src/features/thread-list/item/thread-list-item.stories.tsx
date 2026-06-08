import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadListItem, type ThreadListItemProps } from "./thread-list-item";

const baseArgs: ThreadListItemProps = {
  contactName: "Abigail Stone",
  preview:
    "Hello, I'm new. I was trying to book the 9am reformer Pilates tomorrow but it shows as full on the app. Is there a waitlist I can join?",
  channel: "email",
  timestamp: "Thursday",
  avatarInitials: "AS",
};

const meta: Meta<typeof ThreadListItem> = {
  title: "Inbox/ThreadListItem",
  component: ThreadListItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A single row in the Inbox thread list: avatar, contact name, channel + message preview, timestamp and an unread indicator. Hovering reveals a 3-dots menu to mark the thread as read / unread.",
      },
    },
  },
  args: baseArgs,
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadListItem>;

export const Default: Story = {};

export const Unread: Story = {
  args: {
    isUnread: true,
    unreadCount: 5,
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const HighUnreadCount: Story = {
  args: {
    isUnread: true,
    unreadCount: 120,
  },
};

export const InColumn: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Rendered inside a width-constrained column to show truncation and the hover-revealed overflow menu.",
      },
    },
  },
  render: (args) => (
    <div className="w-[320px] border border-stroke-thin border-stroke-weak">
      <ThreadListItem {...args} isUnread unreadCount={5} />
      <ThreadListItem {...args} contactName="Benjamin Carter" channel="sms" />
      <ThreadListItem
        {...args}
        contactName="Chloe Davis"
        channel="chat"
        isSelected
      />
    </div>
  ),
};
