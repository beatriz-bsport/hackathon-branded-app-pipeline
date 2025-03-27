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
      description: "Array of sortable items to be displayed in the list.",
      control: { type: "object" },
    },
    header: {
      description: "Header properties for the sortable list.",
      control: { type: "object" },
    },
    id: {
      description: "Unique identifier for the sortable list.",
      control: { type: "text" },
    },
    isCollapsible: {
      description: "Flag to indicate if the list is collapsible.",
      control: { type: "boolean" },
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
    isCollapsible: true,
  },
  render: ({ items, header, id, isCollapsible }) => {
    const [sortables, setSortables] = useState<typeof items>(items ?? []);

    const onSortChange = (updatedItems: typeof items) => {
      setSortables(updatedItems);
    };

    return (
      <SortableList
        header={header}
        id={id}
        isCollapsible={isCollapsible}
        items={sortables}
        onSortChange={onSortChange}
      />
    );
  },
};
