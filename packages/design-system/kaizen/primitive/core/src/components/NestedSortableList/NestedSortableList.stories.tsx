import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sortable, SortableListProps } from "../SortableList";
import NestedSortableList from "./NestedSortableList";

const meta: Meta<typeof NestedSortableList> = {
  component: NestedSortableList,
  argTypes: {
    id: {
      description: "Unique identifier for the nested sortable list.",
      control: { type: "text" },
    },
    sortableLists: {
      control: "object",
      table: {
        type: {
          summary: "Array<SortableListProps>",
          detail: `
Array of {
  /** The unique identifier for the sortable list. */
  id: string;

  /** Configuration for the Collapse component. Determines if the list is collapsible and passes additional collapse settings. */
  collapsibleProps?: CollapseProps;

  /** Whether the list items are draggable via drag-and-drop interactions. */
  isDraggable?: boolean;

  /** Whether the list content should be hidden. */
  hideListContent?: boolean;

  /** Callback triggered when the list order changes due to drag-and-drop. Receives the sorted list of items. */
  onSortEnd?: (sortedItems: SortableItem[]) => void;

  /** The array of items to render and sort within the list. */
  items: SortableItem[];

  /** Configuration for the header displayed above the list. */
  header?: SortableListHeaderProps;

  /** Optional configuration for displaying the loading state. */
  loadingProps?: {
    /** Message to display during loading. */
    message?: string;

    /** Tailwind CSS classes to apply to the loading container. */
    className?: string;

    /** Whether the component is currently in a loading state. */
    isLoading?: boolean;
  };

  /** Optional configuration for displaying empty states. */
  emptyStateProps?: {
    /** Configuration for the default empty state UI. Shown when no items are present. */
    emptyConfig: EmptyStateConfig;

    /** Optional configuration for the empty search UI. Shown when a filter yields no results. */
    emptySearchConfig?: EmptySearchStateConfig;

    /** Whether the list is empty. */
    isEmpty: boolean;

    /** Whether the search/filtering returned no results. */
    isEmptySearch?: boolean;
  };
}
          `.trim(),
        },
      },
    },
    onSortChildren: {
      description:
        "Callback function to handle the change in the order of children items within a single parent.",
      action: "sorted",
    },
    onSortParents: {
      description:
        "Callback function to handle the change in the order of parent items.",
      action: "sorted",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NestedSortableList>;

const items: Sortable[] = [
  {
    id: "list-item-1",
    title: "Item 1",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
  },
  {
    id: "list-item-2",
    title: "Item 2",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
  },
  {
    id: "list-item-3",
    title: "Item 3",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
  },
  {
    id: "list-item-4",
    title: "Item 4",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
  },
  {
    id: "list-item-5",
    title: "Item 5",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
  },
  {
    id: "list-item-6",
    title: "Item 6",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
  },
  {
    id: "list-item-7",
    title: "Item 7",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
  },
];

const newItems: Sortable[] = [
  {
    id: "new-item-1",
    title: "Alpha",
    rightTitle: "First title",
    description: "Exploring new horizons",
  },
  {
    id: "new-item-2",
    title: "Bravo",
    rightTitle: "Second title",
    description: "Discovering hidden gems",
  },
  {
    id: "new-item-3",
    title: "Charlie",
    rightTitle: "Third title",
    description: "Unveiling mysteries",
  },
  {
    id: "new-item-4",
    title: "Delta",
    rightTitle: "Fourth title",
    description: "Innovating with creativity",
  },
  {
    id: "new-item-5",
    title: "Echo",
    rightTitle: "Fifth title",
    description: "Building the future",
  },
  {
    id: "new-item-6",
    title: "Foxtrot",
    rightTitle: "Sixth title",
    description: "Connecting the dots",
  },
  {
    id: "new-item-7",
    title: "Golf",
    rightTitle: "Seventh title",
    description: "Pioneering new paths",
  },
];

const sortableListData: Array<SortableListProps> = [
  {
    id: "sortableList-newItems-1",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Third Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-2",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Fourth Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-3",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Fifth Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-4",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Sixth Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-5",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Sevens Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-6",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Eight Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-7",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-8",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-9",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-10",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-11",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-12",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-13",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-14",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-15",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-16",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-17",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-18",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-19",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-21",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-22",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-23",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-24",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-25",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-26",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-27",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-28",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-29",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-30",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-31",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-32",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-33",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-34",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-35",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-36",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Nine Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-37",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Ten Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-newItems-38",
    items: [...newItems],
    header: {
      id: "another-header",
      title: "Another Sortable List",
      description: "Have fun",
    },
    onSortChange: () => {},
  },
  {
    id: "sortableList-items-39",
    items: [...items],
    header: {
      id: "header",
      title: "Sortable List",
      description: "Have fun",
    },
    collapsibleProps: {
      initiallyOpen: true,
    },
    onSortChange: () => {},
  },
];

export const Primary: Story = {
  name: "Base NestedSortableList",
  args: {
    id: "nested-sortable-list-base",
    sortableLists: [...sortableListData.slice(0, 3)],
    onSortChildren: (items) => {
      console.log("Sorted children:", items);
    },
    onSortParents: (sortableLists) => {
      console.log("Sorted parents:", sortableLists);
    },
  },
};

export const ExtendedList: Story = {
  name: "Extended NestedSortableList",
  args: {
    id: "nested-sortable-list-extended",
    sortableLists: [...sortableListData.slice(0, 9)],
    onSortChildren: (items) => {
      console.log("Sorted children:", items);
    },
    onSortParents: (sortableLists) => {
      console.log("Sorted parents:", sortableLists);
    },
  },
};

export const ExtendedListWithOtherContent: Story = {
  name: "Extended NestedSortableList",
  args: {
    id: "nested-sortable-list-extended-with-other-content",
    sortableLists: sortableListData,
    onSortChildren: (items) => {
      console.log("Sorted children:", items);
    },
    onSortParents: (sortableLists) => {
      console.log("Sorted parents:", sortableLists);
    },
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-md">
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <NestedSortableList {...args} />
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
        <div className="text-center text-lg font-bold">
          This is some other content below the NestedSortableList.
        </div>
      </div>
    );
  },
};
