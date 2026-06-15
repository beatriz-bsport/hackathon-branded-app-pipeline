import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { MessageComposer } from "../message-composer";
import { MessageComposerChannelBar } from "./message-composer-channel-bar";

const meta: Meta<typeof MessageComposerChannelBar> = {
  title: "Inbox/MessageComposer/ChannelBar",
  component: MessageComposerChannelBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Channel segmented control plus the expand/minimize toggle. Reads the composer state from context, so it must live inside a `<MessageComposer>`.",
      },
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MessageComposerChannelBar>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[494px]">
      <MessageComposer>
        <MessageComposerChannelBar {...args} />
      </MessageComposer>
    </div>
  ),
};

export const Expanded: Story = {
  render: (args) => (
    <div className="w-[494px]">
      <MessageComposer defaultExpanded>
        <MessageComposerChannelBar {...args} />
      </MessageComposer>
    </div>
  ),
};
