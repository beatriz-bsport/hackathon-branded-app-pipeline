import type { Meta, StoryObj } from "@storybook/react";
import List, { type ListProps } from "#src/components/List";

/**
 * A list component that can contain multiple `Item` components and one `Header` component.<br>
 * It manages the state of checked items and provides context for each `Item` regarding its checked state.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=642-5125" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof List> = {
  component: List,
  argTypes: {
    id: {
      control: "text",
      description: "Optional ID for the list.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof List>;

const listData: ListProps = {
  id: "list-1",
  header: {
    title: "List Title",
    description: "Helpful description",
    id: "list-header-1",
  },
  items: [
    {
      id: "list-item-1",
      title: "Playing with fonts is fun",
      rightTitle: "Right title",
      description: "Playing with fonts is fun",
    },
    {
      id: "list-item-2",
      title: "Playing with fonts is fun",
      rightTitle: "Right title",
      description: "Playing with fonts is fun",
    },
    {
      id: "list-item-3",
      title: "Playing with fonts is fun",
      rightTitle: "Right title",
      description: "Playing with fonts is fun",
    },
  ],
};

export const Primary: Story = {
  name: "List",
  render: () => {
    return (
      <List header={listData.header} id={listData.id} items={listData.items} />
    );
  },
  args: {
    id: "list-1",
  },
};

const selectableListData: ListProps = {
  id: "list-2",
  header: {
    title: "List Title",
    description: "Helpful description",
    id: "list-header-2",
  },
  items: [
    {
      id: "list-item-4",
      title: "Playing with fonts is fun",
      rightTitle: "Right title",
      description: "Playing with fonts is fun",
      chips: [
        {
          label: "Chip 1",
          type: "weak",
          color: "default",
          size: "lg",
        },
        {
          label: "Chip 2",
          type: "weak",
          color: "default",
          size: "lg",
        },
        {
          label: "Chip 3",
          type: "weak",
          color: "default",
          size: "lg",
        },
      ],
      chipsDirection: "end",
      buttons: [
        {
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "file-06",
        },
      ],
    },
    {
      id: "list-item-5",
      title: "Playing with fonts is fun",
      rightTitle: "Right title",
      description: "Playing with fonts is fun",
      chips: [
        {
          label: "Chip 1",
          type: "weak",
          color: "default",
          size: "lg",
        },
        {
          label: "Chip 2",
          type: "weak",
          color: "default",
          size: "lg",
        },
      ],
    },
    {
      id: "list-item-6",
      title: "Playing with fonts is fun",
      rightTitle: "Right title",
      description: "Playing with fonts is fun",
      chips: [
        {
          label: "Chip 1",
          type: "weak",
          color: "default",
          size: "lg",
        },
      ],
      buttons: [
        {
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "arrow-right",
        },
        {
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "refresh-cw-01",
        },
      ],
    },
  ],
};

export const Checkboxes: Story = {
  name: "List with checkboxes",
  render: () => (
    <List
      header={selectableListData.header}
      id={selectableListData.id}
      items={selectableListData.items}
      isSelectable
    />
  ),
};
