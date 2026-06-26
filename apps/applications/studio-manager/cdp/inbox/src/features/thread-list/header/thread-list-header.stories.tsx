import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadListHeader } from "./thread-list-header";
import { useThreadFilter } from "./use-thread-filter";

const meta: Meta<typeof ThreadListHeader> = {
  title: "Inbox/ThreadListHeader",
  component: ThreadListHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Header for the Inbox thread list: title with a flat settings icon button, plus a second row with the filter funnel and a disabled search placeholder.",
      },
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
  // Drive the header with the real filter hook so the funnel toggles in the story.
  render: () => {
    const { filter, setFilter } = useThreadFilter();
    return <ThreadListHeader filter={filter} onFilterChange={setFilter} />;
  },
};

export default meta;

type Story = StoryObj<typeof ThreadListHeader>;

export const Default: Story = {};

export const InColumn: Story = {
  render: () => {
    const { filter, setFilter } = useThreadFilter();
    return (
      <div className="w-[320px] border border-stroke-thin border-stroke-weak">
        <ThreadListHeader filter={filter} onFilterChange={setFilter} />
      </div>
    );
  },
};
