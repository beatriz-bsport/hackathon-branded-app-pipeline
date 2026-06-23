import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadMessagesHeader } from "./thread-messages-header";

const meta: Meta<typeof ThreadMessagesHeader> = {
  title: "Inbox/ThreadMessagesHeader",
  component: ThreadMessagesHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Layout-agnostic content row for the Inbox thread header: conversation title with flat filter and more-actions icon buttons. It carries no bar chrome (border/background/padding) of its own — it is meant to sit inside `InboxLayout.Header`, which owns that chrome.",
      },
    },
  },
  args: {
    title: "Abigail Stone",
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadMessagesHeader>;

export const Default: Story = {};

export const InColumn: Story = {
  render: (args) => (
    <div className="w-[480px] border-b-stroke-thin border-b-stroke-divider bg-surface-default px-sm py-xs">
      <ThreadMessagesHeader {...args} />
    </div>
  ),
};
