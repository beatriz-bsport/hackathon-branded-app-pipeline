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
          "Header for the Inbox thread list: title with a flat settings icon button, plus a second row with the filter funnel and the member-search field.",
      },
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
  // Drive the header with the real controls hook so the funnel toggles and the
  // search field is controlled in the story.
  render: () => {
    const { filter, setFilter, search, onSearchChange, onSearchClear } =
      useThreadFilter();
    return (
      <ThreadListHeader
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof ThreadListHeader>;

export const Default: Story = {};

export const InColumn: Story = {
  render: () => {
    const { filter, setFilter, search, onSearchChange, onSearchClear } =
      useThreadFilter();
    return (
      <div className="w-[320px] border border-stroke-thin border-stroke-weak">
        <ThreadListHeader
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={onSearchChange}
          onSearchClear={onSearchClear}
        />
      </div>
    );
  },
};
