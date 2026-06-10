import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadListEmpty } from "./thread-list-empty";

/** Constrains the placeholder to a realistic inbox-column size. */
const withPanelFrame: Decorator = (Story) => (
  <div className="h-[640px] w-[380px] overflow-hidden border border-stroke-thin border-stroke-weak">
    <Story />
  </div>
);

const meta: Meta<typeof ThreadListEmpty> = {
  title: "Inbox/ThreadListEmpty",
  component: ThreadListEmpty,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Placeholder shown in the Inbox thread list when the studio has no conversations at all: the Kaizen `empty` illustration above a muted message.",
      },
    },
  },
  decorators: [withPanelFrame, ...storybookDecorator],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadListEmpty>;

export const Default: Story = {};
