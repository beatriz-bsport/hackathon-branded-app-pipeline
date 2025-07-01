import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import SortableList from "#src/components/SortableList";

/**
 * SortableList component allows for a list of items to be sorted via drag-and-drop interactions.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=9470-738307&t=3i3lyzqhsnapFIA4-11" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof SortableList> = {
  component: SortableList,
  argTypes: {
    items: {
      control: "object",
      table: {
        type: {
          summary: "Sortable",
          detail: `
    {
      /** The id of the item. */
      id: string;
    
      /** The main title of the list item. */
      title: string;
    
      /** An additional title displayed on the right side of the item. */
      rightTitle?: string;
    
      /** An optional description displayed below the title. */
      description?: string;
    
      /** Name of the icon to display within the item. */
      icon?: IconName;
    
      /** Configuration for the avatar component within the item. */
      avatar?: AvatarProps;
    
      /** An array of chips to display (up to 3), with details about their labels and styles. */
      chips?:
        | [ListItemChipsProps]
        | [ListItemChipsProps, ListItemChipsProps]
        | [ListItemChipsProps, ListItemChipsProps, ListItemChipsProps];
    
      /** Direction for displaying the chips: "start" or "end". */
      chipsDirection?: "start" | "end";
    
      /** A list of buttons to display in the header; extra actions are pushed to a dropdown. */
      buttons?: WithTooltip<ActionButton[]>;
    
      /** Optional dropdown config, like the number of actions inline or dropdown fields. */
      dropdownConfig?: ActionsDropdownConfig;
    }
          `.trim(),
        },
      },
    },
    header: {
      control: "object",
      table: {
        type: {
          summary: "ListHeaderProps",
          detail: `
    {
      /** The id of the header. */
      id: string;
    
      /** The title text for the header. */
      title: string;
    
      /** An optional description displayed below the title. */
      description?: string;
    
      /** A list of buttons to display in the header; extra actions are pushed to a dropdown. */
      buttons?: ActionButton[];
    
      /** Optional dropdown config, like the number of actions inline or dropdown fields. */
      dropdownConfig?: ActionsDropdownConfig;
    
      /** A boolean indicating whether the collapse is currently open. */
      isCollapseOpen: boolean;
    
      /** The callback function to toggle the collapse. If defined, a collapse icon will be shown. */
      collapseController?: () => void;
    
      /** Any additional HTML div attributes (e.g. className, style, etc.). */
      [key: string]: any; // From React.HTMLAttributes<HTMLDivElement>
    }
          `.trim(),
        },
      },
    },

    id: {
      description: "Unique identifier for the sortable list.",
      control: { type: "text" },
    },
    collapsibleProps: {
      control: "object",
      table: {
        type: {
          summary: "CollapseProps",
          detail: `
    {
      /** The children elements of the Collapse component. */
      children: React.ReactNode;
    
      /** Additional CSS classes to style the component. */
      className?: string;
    
      /** An optional unique identifier for the collapse element (used for accessibility). */
      id?: string;
    
      /** Whether the collapse is initially open. */
      initiallyOpen?: boolean;
    }
          `.trim(),
        },
      },
    },
    emptyStateProps: {
      control: "object",
      table: {
        type: {
          summary: "UseEmptyStateProps",
          detail: `
    {
      isEmpty: boolean;
      emptyConfig: {
        title?: string;
        subtitle?: string;
        className?: string;
        ctaButtonConfig?: ButtonProps;
        secondaryButtonConfig?: ButtonProps;
      };
      isEmptySearch?: boolean;
      emptySearchConfig?: {
        title?: string;
        subtitle?: string;
        className?: string;
        ctaButtonConfig?: ButtonProps;
        secondaryButtonConfig?: ButtonProps;
      };
    }
          `.trim(),
        },
      },
    },
    loadingProps: {
      control: "object",
      table: {
        type: {
          summary: "UseLoadingStateProps",
          detail: `
    {
      message?: string; default "Loading...";
      className?: string;
      isLoading?: boolean; default: false;
    }
          `.trim(),
        },
      },
    },
    onSortChange: {
      description:
        "Callback function to handle the change in the order of items.",
      action: "sorted",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SortableList>;

const items = [
  {
    id: "list-item-1",
    title: "Item 1",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 1 clicked"),
  },
  {
    id: "list-item-2",
    title: "Item 2",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 2 clicked"),
  },
  {
    id: "list-item-3",
    title: "Item 3",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 3 clicked"),
  },
  {
    id: "list-item-4",
    title: "Item 4",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 4 clicked"),
  },
  {
    id: "list-item-5",
    title: "Item 5",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 5 clicked"),
  },
  {
    id: "list-item-6",
    title: "Item 6",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 6 clicked"),
  },
  {
    id: "list-item-7",
    title: "Item 7",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-8",
    title: "Item 8",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-9",
    title: "Item 9",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-10",
    title: "Item 10",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-11",
    title: "Item 11",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-12",
    title: "Item 12",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-13",
    title: "Item 13",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-14",
    title: "Item 14",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-15",
    title: "Item 15",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-16",
    title: "Item 16",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-17",
    title: "Item 17",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-18",
    title: "Item 18",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-19",
    title: "Item 19",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
  {
    id: "list-item-20",
    title: "Item 20",
    rightTitle: "Right title",
    description: "Playing with fonts is fun",
    onItemClick: () => console.log("Item 7 clicked"),
  },
];

export const Primary: Story = {
  name: "SortableList",
  args: {
    items,
    header: {
      id: "header",
      title: "Sortable List",
      description: "Have fun",
    },
    id: "sortable-list-1",
    collapsibleProps: {
      initiallyOpen: true,
    },
    loadingProps: {
      isLoading: false,
      message: "Loading smth...",
    },
  },
  render: ({ items, header, id, collapsibleProps, loadingProps }) => {
    const [sortables, setSortables] = useState<typeof items>(items ?? []);

    const onSortChange = (updatedItems: typeof items) => {
      setSortables(updatedItems);
    };

    return (
      <SortableList
        header={header}
        id={id}
        collapsibleProps={collapsibleProps}
        items={sortables}
        onSortChange={onSortChange}
        loadingProps={loadingProps}
      />
    );
  },
};

const emptyConfig = {
  title: "No email templates yet",
  subtitle: "Create email templates to easily contact your members",
  className: "max-w-[320px]",
  ctaButtonConfig: {
    iconLeft: "award-03" as const,
    label: "Create template",
    onClick: () => console.log("Create email template"),
  },
  secondaryButtonConfig: {
    iconLeft: "bank-note-03" as const,
    label: "Add category",
    onClick: () => console.log("Create a new category"),
  },
};

const emptySearchConfig = {
  title: "No results found",
  subtitle:
    "No members match your filters.\nTry clearing them to see more results",
  className: "max-w-[320px]",
  secondaryButtonConfig: {
    iconLeft: "x" as const,
    label: "Clear filters",
    onClick: () => console.log("Clear the filters"),
  },
};

export const ListWithNoPrimaryButtons: Story = {
  name: "Sortable List with buttons in header and items",
  args: {
    id: "list-1",
    collapsibleProps: {
      initiallyOpen: true,
    },
    loadingProps: {
      isLoading: false,
      message: "Loading smth...",
    },
    header: {
      title: "List with buttons in header title",
      description: "Helpful description",
      id: "list-header-1",
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
      buttons: [
        {
          id: "list-header-button-2",
          label: "Button 2",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Announcement clicked"),
        },
        {
          id: "list-header-button-3",
          label: "Button 3",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "bank-note-03",
          onClick: () => alert("Note clicked"),
        },
        {
          id: "list-header-button-4",
          label: "Button 4",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "x",
          onClick: () => alert("X clicked"),
        },
      ],
    },
    items: [
      {
        id: "list-item-1",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        onItemClick: () => console.log("Item 1 clicked"),
        buttons: [
          {
            id: "list-header-button-2",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Button 4",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
      {
        id: "list-item-2",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        dropdownConfig: { visibleActionsDisplayLimit: 1 },
        onItemClick: () => console.log("Item 2 clicked"),
        buttons: [
          {
            id: "list-header-button-2",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Button 4",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
      {
        id: "list-item-3",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        dropdownConfig: { visibleActionsDisplayLimit: 0 },
        onItemClick: () => console.log("Item 3 clicked"),
        buttons: [
          {
            id: "list-header-button-2",
            label: "Announcement",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            label: "Notes",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Quit",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
    ],
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: false,
      emptyConfig: emptyConfig,
    },
  },
  render: ({
    items,
    header,
    id,
    collapsibleProps,
    emptyStateProps,
    loadingProps,
  }) => {
    const [sortables, setSortables] = useState<typeof items>(items ?? []);

    const onSortChange = (updatedItems: typeof items) => {
      setSortables(updatedItems);
    };

    return (
      <SortableList
        header={header}
        id={id}
        collapsibleProps={collapsibleProps}
        items={sortables}
        onSortChange={onSortChange}
        emptyStateProps={emptyStateProps}
        loadingProps={loadingProps}
      />
    );
  },
};

export const LoadingList: Story = {
  name: "Sortable List with buttons in header and items",
  args: {
    id: "list-1",
    collapsibleProps: {
      initiallyOpen: true,
    },
    loadingProps: {
      isLoading: true,
      message: "Loading smth...",
    },
    header: {
      title: "List with buttons in header title",
      description: "Helpful description",
      id: "list-header-1",
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
      buttons: [
        {
          id: "list-header-button-2",
          label: "Button 2",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Announcement clicked"),
        },
        {
          id: "list-header-button-3",
          label: "Button 3",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "bank-note-03",
          onClick: () => alert("Note clicked"),
        },
        {
          id: "list-header-button-4",
          label: "Button 4",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "x",
          onClick: () => alert("X clicked"),
        },
      ],
    },
    items: [
      {
        id: "list-item-1",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        buttons: [
          {
            id: "list-header-button-2",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Button 4",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
      {
        id: "list-item-2",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        dropdownConfig: { visibleActionsDisplayLimit: 1 },
        buttons: [
          {
            id: "list-header-button-2",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Button 4",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
      {
        id: "list-item-3",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        dropdownConfig: { visibleActionsDisplayLimit: 0 },
        buttons: [
          {
            id: "list-header-button-2",
            label: "Announcement",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            label: "Notes",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Quit",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
    ],
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: false,
      emptyConfig: emptyConfig,
    },
  },
  render: ({
    items,
    header,
    id,
    collapsibleProps,
    emptyStateProps,
    loadingProps,
  }) => {
    const [sortables, setSortables] = useState<typeof items>(items ?? []);

    const onSortChange = (updatedItems: typeof items) => {
      setSortables(updatedItems);
    };

    return (
      <SortableList
        header={header}
        id={id}
        collapsibleProps={collapsibleProps}
        items={sortables}
        onSortChange={onSortChange}
        emptyStateProps={emptyStateProps}
        loadingProps={loadingProps}
      />
    );
  },
};
