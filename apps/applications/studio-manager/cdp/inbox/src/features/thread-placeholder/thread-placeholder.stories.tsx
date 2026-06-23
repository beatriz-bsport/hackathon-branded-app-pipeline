import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadPlaceholder } from "./thread-placeholder";

/** Constrains the placeholder to a realistic inbox content-area size. */
const withContentFrame: Decorator = (Story) => (
  <div className="h-[640px] w-[760px] overflow-hidden border border-stroke-thin border-stroke-weak">
    <Story />
  </div>
);

const meta: Meta<typeof ThreadPlaceholder> = {
  title: "Inbox/ThreadPlaceholder",
  component: ThreadPlaceholder,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Content-area placeholder shown on `/threads` while no thread is selected: the Kaizen `empty` illustration above a muted message, centered in the space next to the thread list.",
      },
    },
  },
  decorators: [withContentFrame, ...storybookDecorator],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadPlaceholder>;

export const Default: Story = {};
