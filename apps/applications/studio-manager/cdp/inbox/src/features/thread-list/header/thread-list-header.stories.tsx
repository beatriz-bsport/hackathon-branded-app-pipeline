import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadListHeader } from "./thread-list-header";

const meta: Meta<typeof ThreadListHeader> = {
  title: "Inbox/ThreadListHeader",
  component: ThreadListHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Header for the Inbox thread list: title with a flat settings icon button.",
      },
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadListHeader>;

export const Default: Story = {};

export const InColumn: Story = {
  render: (args) => (
    <div className="w-[320px] border border-stroke-thin border-stroke-weak">
      <ThreadListHeader {...args} />
    </div>
  ),
};
