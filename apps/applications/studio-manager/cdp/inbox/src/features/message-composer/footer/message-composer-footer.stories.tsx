import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { MessageComposer } from "../message-composer";
import { MessageComposerFooter } from "./message-composer-footer";
import { MessageComposerSendButton } from "./message-composer-send-button";

const meta: Meta<typeof MessageComposerFooter> = {
  title: "Inbox/MessageComposer/Footer",
  component: MessageComposerFooter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Footer row: optional notice on the left, actions (usually the Send button) on the right.",
      },
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MessageComposerFooter>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[470px]">
      <MessageComposer>
        <MessageComposerFooter {...args}>
          <MessageComposerSendButton />
        </MessageComposerFooter>
      </MessageComposer>
    </div>
  ),
};

export const WithNotice: Story = {
  args: {
    notice:
      "The customer does not accept receiving marketing messages but they will receive this message.",
  },
  render: (args) => (
    <div className="w-[470px]">
      <MessageComposer>
        <MessageComposerFooter {...args}>
          <MessageComposerSendButton />
        </MessageComposerFooter>
      </MessageComposer>
    </div>
  ),
};

export const SendLoading: Story = {
  render: (args) => (
    <div className="w-[470px]">
      <MessageComposer>
        <MessageComposerFooter {...args}>
          <MessageComposerSendButton loading />
        </MessageComposerFooter>
      </MessageComposer>
    </div>
  ),
};
