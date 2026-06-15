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
          "Header for the Inbox thread messages area: conversation title with flat filter and more-actions icon buttons.",
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
    <div className="w-[480px] border border-stroke-thin border-stroke-weak">
      <ThreadMessagesHeader {...args} />
    </div>
  ),
};
