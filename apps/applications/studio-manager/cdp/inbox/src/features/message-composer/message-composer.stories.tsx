import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  CHANNEL_TYPES,
  type ChannelType,
} from "#src/components/channel/constants";
import { storybookDecorator } from "#src/utils/storybook-decorator";

import { MessageComposerChannelBar } from "./channel-bar/message-composer-channel-bar";
import { MessageComposerMessageField } from "./fields/message-composer-message-field";
import { MessageComposerTitleField } from "./fields/message-composer-title-field";
import { MessageComposerFooter } from "./footer/message-composer-footer";
import { MessageComposerSendButton } from "./footer/message-composer-send-button";
import { MessageComposer } from "./message-composer";
import { MessageComposerForm } from "./message-composer-form";
import { type MessageComposerFormData } from "./schema";

type PlaygroundProps = {
  defaultChannel?: ChannelType;
  defaultExpanded?: boolean;
  notice?: string;
  sendDisabled?: boolean;
  sendLoading?: boolean;
};

type ConnectedPlaygroundProps = Pick<
  PlaygroundProps,
  "defaultChannel" | "defaultExpanded" | "notice"
>;

function ConnectedComposerPlayground({
  defaultChannel,
  defaultExpanded,
  notice,
}: ConnectedPlaygroundProps) {
  const [submittedData, setSubmittedData] =
    useState<MessageComposerFormData | null>(null);

  return (
    <div className="flex flex-col gap-sm">
      <div className="w-[494px] border border-stroke-thin border-stroke-weak">
        <MessageComposerForm
          key={`${defaultChannel}-${defaultExpanded}`}
          defaultChannel={defaultChannel}
          defaultExpanded={defaultExpanded}
          notice={notice}
          onSubmit={setSubmittedData}
        />
      </div>
      <pre className="max-w-[494px] whitespace-pre-wrap rounded-sm bg-surface-page-navigation p-sm text-body-xs">
        {submittedData
          ? JSON.stringify(submittedData, null, 2)
          : "Submit the composer to inspect form data."}
      </pre>
    </div>
  );
}

/**
 * Full composition: the composer owns channel + expanded state internally, the
 * story only holds the field values — exactly how a
 * connected consumer would use it (with react-hook-form, each leaf would be
 * wrapped in `@bsport/form`'s `FormField` instead).
 */
function ComposerPlayground({
  defaultChannel,
  defaultExpanded,
  notice,
  sendDisabled,
  sendLoading,
}: PlaygroundProps) {
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sms, setSms] = useState("");
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [chat, setChat] = useState("");

  return (
    <div className="w-[494px] border border-stroke-thin border-stroke-weak">
      <MessageComposer
        key={`${defaultChannel}-${defaultExpanded}`}
        defaultChannel={defaultChannel}
        defaultExpanded={defaultExpanded}
      >
        <MessageComposerChannelBar />
        <MessageComposerTitleField
          channel="email"
          value={subject}
          onChange={setSubject}
        />
        <MessageComposerMessageField
          channel="email"
          value={emailBody}
          onChange={setEmailBody}
        />
        <MessageComposerMessageField
          channel="sms"
          value={sms}
          onChange={setSms}
        />
        <MessageComposerTitleField
          channel="push"
          value={pushTitle}
          onChange={setPushTitle}
        />
        <MessageComposerMessageField
          channel="push"
          value={pushBody}
          onChange={setPushBody}
        />
        <MessageComposerMessageField
          channel="in_app"
          value={chat}
          onChange={setChat}
        />
        <MessageComposerFooter notice={notice}>
          <MessageComposerSendButton
            disabled={sendDisabled}
            loading={sendLoading}
          />
        </MessageComposerFooter>
      </MessageComposer>
    </div>
  );
}

const meta: Meta<typeof ConnectedComposerPlayground> = {
  title: "Inbox/MessageComposer",
  component: ConnectedComposerPlayground,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Form-connected V1 message composer. Email uses plain subject/body fields; SMS and in_app use body fields; push uses title/body. Send is a real form submit, with API behavior intentionally unimplemented for now.",
      },
    },
  },
  argTypes: {
    defaultChannel: {
      control: "inline-radio",
      options: [...CHANNEL_TYPES],
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ConnectedComposerPlayground>;

export const Default: Story = {};

export const EmailExpanded: Story = {
  args: { defaultChannel: "email", defaultExpanded: true },
};

export const Sms: Story = {
  args: { defaultChannel: "sms" },
};

export const Push: Story = {
  args: { defaultChannel: "push" },
};

export const Chat: Story = {
  args: { defaultChannel: "in_app" },
};

export const WithNotice: Story = {
  args: {
    notice:
      "The customer does not accept receiving marketing messages but they will receive this message.",
  },
};

export const PresentationalPrimitives: StoryObj<typeof ComposerPlayground> = {
  render: (args) => <ComposerPlayground {...args} />,
};
