import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadListFilter } from "./thread-list-filter";
import type { ThreadFilter } from "./use-thread-filter";

const meta: Meta<typeof ThreadListFilter> = {
  title: "Inbox/ThreadList/ThreadListFilter",
  component: ThreadListFilter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Funnel icon-button opening a single-select All / Unread menu. The active option carries a check; a non-`all` filter highlights the funnel.",
      },
    },
  },
  decorators: [...storybookDecorator],
  tags: ["autodocs"],
  // Self-controlled wrapper so the funnel toggles in the canvas.
  render: ({ value }) => {
    const [filter, setFilter] = useState<ThreadFilter>(value);
    return <ThreadListFilter value={filter} onChange={setFilter} />;
  },
};

export default meta;

type Story = StoryObj<typeof ThreadListFilter>;

export const All: Story = {
  args: { value: "all" },
  parameters: {
    docs: {
      description: {
        story: "Default state — `All` selected, funnel inactive.",
      },
    },
  },
};

export const Unread: Story = {
  args: { value: "unread" },
  parameters: {
    docs: {
      description: {
        story: "Active state — `Unread` selected, funnel highlighted.",
      },
    },
  },
};
