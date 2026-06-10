import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadListError } from "./thread-list-error";

/** Constrains the placeholder to a realistic inbox-column size. */
const withPanelFrame: Decorator = (Story) => (
  <div className="h-[640px] w-[380px] overflow-hidden border border-stroke-thin border-stroke-weak">
    <Story />
  </div>
);

const meta: Meta<typeof ThreadListError> = {
  title: "Inbox/ThreadListError",
  component: ThreadListError,
  args: {
    onRetry: () => {},
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Placeholder shown in the Inbox thread list when the initial load fails: the Kaizen `error` illustration, a message, and a retry button. Reuses Kaizen's `ErrorFallback`.",
      },
    },
  },
  decorators: [withPanelFrame, ...storybookDecorator],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadListError>;

export const Default: Story = {};
