import type { Meta, StoryObj } from "@storybook/react";
import classNames from "classnames";
import React, { useState } from "react";

import SortableList, { Sortable } from "#src/components/SortableList";

import DragAndDrop from "../DragAndDrop";
import { ListHeaderProps } from "../List";

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

const newItems = [
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

export const MultipleLists: Story = {
  name: "Multiple Lists",
  render: () => {
    const [data, setData] = useState<{
      sortableLists: {
        id: string;
        items: Sortable[];
        header: ListHeaderProps;
      }[];
      draggedSortableList: {
        id: string;
        items: Sortable[];
        header: ListHeaderProps;
      } | null;
      areSortableListsOpen: boolean;
    }>({
      sortableLists: [
        {
          id: "sortableList-items",
          items: [...items],
          header: {
            id: "header",
            title: "Sortable List",
            description: "Have fun",
          },
        },
        {
          id: "sortableList-newItems",
          items: [...newItems],
          header: {
            id: "another-header",
            title: "Another Sortable List",
            description: "Have fun",
          },
        },
      ],
      draggedSortableList: null,
      areSortableListsOpen: true,
    });

    const handleSortChange = (listId: string) => (updatedItems: Sortable[]) => {
      setData((prevData) => ({
        ...prevData,
        sortableLists: prevData.sortableLists.map((list) =>
          list.id === listId ? { ...list, items: updatedItems } : list,
        ),
      }));
    };

    const handleDragStart = (dragId: string) => () => {
      const draggedList = data.sortableLists.find(({ id }) => dragId === id);
      if (draggedList) {
        setData((prevData) => ({
          ...prevData,
          draggedSortableList: draggedList,
          areSortableListsOpen: false,
        }));
      }
    };

    const handleDragEnd = () => () => {
      setData((prevData) => ({
        ...prevData,
        draggedSortableList: null,
        areSortableListsOpen: true,
      }));
    };

    const handleDrop = (draggedId: string, dropTargetId: string) => () => {
      if (!draggedId || !dropTargetId) return;

      setData((prevData) => {
        const draggedIndex = prevData.sortableLists.findIndex(
          (list) => list.id === draggedId,
        );
        const targetIndex =
          draggedIndex < Number(dropTargetId)
            ? Number(dropTargetId) - 1
            : Number(dropTargetId);

        if (draggedIndex === -1 || targetIndex === -1) return prevData;

        const updatedLists = [...prevData.sortableLists];
        const [movedList] = updatedLists.splice(draggedIndex, 1);
        updatedLists.splice(targetIndex, 0, movedList);

        return {
          ...prevData,
          sortableLists: updatedLists,
        };
      });
    };

    return (
      <DragAndDrop
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        className="relative flex flex-col"
        isDnDActive
        id="sortable-list-dnd"
      >
        {data.sortableLists.map((list, index) => (
          <DragAndDrop.DropZone key={list.id} id={index.toString()}>
            {({ activeDropTarget }) => (
              <>
                {data.draggedSortableList && (
                  <SortableList
                    header={data.draggedSortableList.header}
                    id={data.draggedSortableList.id}
                    items={data.draggedSortableList.items}
                    onSortChange={handleSortChange(data.draggedSortableList.id)}
                    collapsibleProps={{
                      initiallyOpen: data.areSortableListsOpen,
                    }}
                    className={
                      activeDropTarget === index.toString()
                        ? "opacity-sm !border-b-stroke-regular !border-onsurface-main-strong bg-surface-default-weak "
                        : "hidden"
                    }
                  />
                )}
                <DragAndDrop.Item id={list.id}>
                  {({ isDragged }) => (
                    <SortableList
                      header={list.header}
                      id={list.id}
                      items={list.items}
                      onSortChange={handleSortChange(list.id)}
                      collapsibleProps={{
                        initiallyOpen: data.areSortableListsOpen,
                      }}
                      className={classNames("translate-x-0", {
                        hidden: isDragged,
                      })}
                      tabIndex={0}
                    />
                  )}
                </DragAndDrop.Item>
              </>
            )}
          </DragAndDrop.DropZone>
        ))}
        <DragAndDrop.DropZone id={data.sortableLists.length.toString()}>
          {({ activeDropTarget }) =>
            data.draggedSortableList && (
              <div
                className={classNames({
                  "absolute left-0 right-0 bottom-0 h-xl": !(
                    activeDropTarget === data.sortableLists.length.toString()
                  ),
                })}
              >
                <SortableList
                  header={data.draggedSortableList.header}
                  id={data.draggedSortableList.id}
                  items={data.draggedSortableList.items}
                  onSortChange={handleSortChange(data.draggedSortableList.id)}
                  collapsibleProps={{
                    initiallyOpen: data.areSortableListsOpen,
                  }}
                  className={classNames(
                    "opacity-sm !border-b-stroke-regular !border-onsurface-main-strong bg-surface-default-weak",
                    {
                      hidden: !(
                        activeDropTarget ===
                        data.sortableLists.length.toString()
                      ),
                    },
                  )}
                />
              </div>
            )
          }
        </DragAndDrop.DropZone>
      </DragAndDrop>
    );
  },
};
