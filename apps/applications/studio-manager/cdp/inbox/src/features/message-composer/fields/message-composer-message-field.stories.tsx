import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CHANNEL_TYPES } from "#src/components/channel/constants";
import { storybookDecorator } from "#src/utils/storybook-decorator";

import { MessageComposer } from "../message-composer";
import {
  MessageComposerMessageField,
  type MessageComposerMessageFieldProps,
} from "./message-composer-message-field";

function StatefulField({
  expanded,
  ...args
}: MessageComposerMessageFieldProps & { expanded?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <div className="w-[470px]">
      <MessageComposer
        key={`${args.channel}-${expanded}`}
        defaultChannel={args.channel}
        defaultExpanded={expanded}
      >
        <MessageComposerMessageField
          {...args}
          value={value}
          onChange={setValue}
        />
      </MessageComposer>
    </div>
  );
}

const meta: Meta<typeof MessageComposerMessageField> = {
  title: "Inbox/MessageComposer/MessageField",
  component: MessageComposerMessageField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Multiline message input for any channel, picked by `channel` — counters and labels come from the per-channel config. Speaks the `value`/`onChange`/`status`/`statusText` contract, so it can be wrapped directly in `@bsport/form`'s `FormField`.",
      },
    },
  },
  argTypes: {
    channel: {
      control: "inline-radio",
      options: [...CHANNEL_TYPES],
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MessageComposerMessageField>;

export const Email: Story = {
  args: { channel: "email" },
  render: (args) => <StatefulField {...args} />,
};

export const EmailExpanded: Story = {
  args: { channel: "email" },
  render: (args) => <StatefulField {...args} expanded />,
};

export const Sms: Story = {
  args: { channel: "sms" },
  render: (args) => <StatefulField {...args} />,
};

export const SmsExpanded: Story = {
  args: { channel: "sms" },
  render: (args) => <StatefulField {...args} expanded />,
};

export const Push: Story = {
  args: { channel: "push" },
  render: (args) => <StatefulField {...args} />,
};

export const PushExpanded: Story = {
  args: { channel: "push" },
  render: (args) => <StatefulField {...args} expanded />,
};

export const Chat: Story = {
  args: { channel: "in_app" },
  render: (args) => <StatefulField {...args} />,
};

export const WithError: Story = {
  args: {
    channel: "sms",
    status: "error",
    statusText: "Message is required",
  },
  render: (args) => <StatefulField {...args} expanded />,
};
