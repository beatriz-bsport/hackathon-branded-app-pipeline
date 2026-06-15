import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { MessageComposer } from "../message-composer";
import {
  MessageComposerTitleField,
  type MessageComposerTitleFieldProps,
} from "./message-composer-title-field";

function StatefulField({
  expanded,
  ...args
}: MessageComposerTitleFieldProps & { expanded?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <div className="w-[470px]">
      <MessageComposer
        key={`${args.channel}-${expanded}`}
        defaultChannel={args.channel}
        defaultExpanded={expanded}
      >
        <MessageComposerTitleField
          {...args}
          value={value}
          onChange={setValue}
        />
      </MessageComposer>
    </div>
  );
}

const meta: Meta<typeof MessageComposerTitleField> = {
  title: "Inbox/MessageComposer/TitleField",
  component: MessageComposerTitleField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single-line title input — email subject or push-notification title, picked by `channel`. Speaks the `value`/`onChange`/`status`/`statusText` contract, so it can be wrapped directly in `@bsport/form`'s `FormField`.",
      },
    },
  },
  argTypes: {
    channel: { control: "inline-radio", options: ["email", "push"] },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MessageComposerTitleField>;

export const Email: Story = {
  args: { channel: "email" },
  render: (args) => <StatefulField {...args} />,
};

export const EmailExpanded: Story = {
  args: { channel: "email" },
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

export const WithError: Story = {
  args: {
    channel: "email",
    status: "error",
    statusText: "Email subject is required",
  },
  render: (args) => <StatefulField {...args} expanded />,
};
