import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Badge from "#src/components/Badge";
import Indicator from "#src/components/Indicator";
import NavigationMenu from "#src/components/NavigationMenu";
import type { NavigationMenuElement } from "#src/components/NavigationMenu/types";

const elements: NavigationMenuElement[] = [
  {
    id: "item-1",
    label: "Day time",
    icon: "user-edit",
    subItems: [
      { id: "subItems1-morning", label: "Good Morning" },
      { id: "subItems1-afternoon", label: "Good Afternoon" },
      { id: "subItems1-evening", label: "Good Evening" },
      { id: "subItems1-night", label: "Good Night" },
      { id: "subItems1-sunrise", label: "Sunrise" },
      { id: "subItems1-sunset", label: "Sunset" },
      { id: "subItems1-midnight", label: "Midnight Thoughts" },
    ],
    endSlot: <Badge size="sm" color="default" text="yolo" />,
  },
  { type: "divider" },
  {
    id: "item-2",
    label: "Flat item with very long name with many words",
    icon: "loading",
  },
  {
    id: "item-3",
    label: "Third Item",
    icon: "filter-lines",
    href: "#?filter=lines",
    target: "_blank",
  },
  { type: "divider" },
  {
    id: "item-4",
    label: "Activity",
    icon: "file-06",
    subItems: [
      { id: "subItems3-forest", label: "Walk in the Forest" },
      { id: "subItems3-mountain", label: "Mountain Adventure" },
      { id: "subItems3-beach", label: "Beach Day" },
      { id: "subItems3-city", label: "City Lights" },
      { id: "subItems3-camping", label: "Camping Trip" },
      { id: "subItems3-garden", label: "Stroll in the Garden" },
      { id: "subItems3-lake", label: "Lake Escape" },
    ],
  },
  { type: "divider" },
  {
    id: "item-5",
    label: "LG indicator",
    icon: "bell-ringing-04",
    endSlot: <Indicator size="lg" color="default" position="top" value={10} />,
  },
  {
    id: "item-6",
    label: "SM indicator",
    icon: "bell-ringing-04",
    endSlot: <Indicator size="sm" color="default" position="top" value={10} />,
  },
  {
    id: "item-7",
    label: "Menu item with very long name with many words as well",
    icon: "book-closed",
    subItems: [
      { id: "subItems7-coffee", label: "Morning Coffee" },
      { id: "subItems7-tea", label: "Afternoon Tea" },
      { id: "subItems7-lunch", label: "Lunch Time" },
      { id: "subItems7-dinner", label: "Dinner Time" },
      { id: "subItems7-dessert", label: "Dessert Break" },
      { id: "subItems7-snack", label: "Snack Attack" },
      { id: "subItems7-drinks", label: "Evening Drinks" },
    ],
  },
];

/**
 * The NavigationMenu component renders a structured, interactive navigation menu.
 * It supports items with optional sub-items, icons, and customizable actions.
 * This menu is ideal for creating sidebars, dropdowns, or hierarchical navigation structures.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=4694-20081&node-type=canvas&t=i4AToSJYBCFUaZBF-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof NavigationMenu> = {
  component: NavigationMenu,
  args: {
    onItemClick: (item) => (e) => {
      e.preventDefault();
      console.log("item clicked:", item);
    },
    className: "max-w-[320px]",
  },
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const WithElements: Story = {
  args: {
    elements,
  },
};

export const WithActiveProps: Story = {
  render: () => {
    const [activeId, setActiveId] = useState<string | null>("item-1");

    const handleClick = (id: string) => {
      setActiveId(id === activeId ? null : id);
    };

    return (
      <NavigationMenu className="max-w-[320px]">
        <NavigationMenu.Item
          id="item-1"
          label="First Item"
          icon="user-edit"
          active={activeId === "item-1"}
          onClick={() => handleClick("item-1")}
        >
          <NavigationMenu.SubItem
            id="subitem-1"
            label="SubItem One"
            active={activeId === "subitem-1"}
            onClick={() => handleClick("subitem-1")}
          />
          <NavigationMenu.SubItem
            id="subitem-2"
            label="SubItem Two"
            active={activeId === "subitem-2"}
            onClick={() => handleClick("subitem-2")}
          />
        </NavigationMenu.Item>
        <NavigationMenu.Item
          id="item-2"
          label="Second Item"
          icon="loading"
          active={activeId === "item-2"}
          onClick={() => handleClick("item-2")}
        />
      </NavigationMenu>
    );
  },
};

export const WithComposition: Story = {
  render: () => (
    <NavigationMenu className="max-w-[320px]">
      <NavigationMenu.Item
        id="item-1"
        label="Day time"
        icon="user-edit"
        endSlot={<Badge size="sm" color="default" text="yolo" />}
      >
        <NavigationMenu.SubItem id="subItems1-morning" label="Good Morning" />
        <NavigationMenu.SubItem
          id="subItems1-afternoon"
          label="Good Afternoon"
        />
      </NavigationMenu.Item>
      <NavigationMenu.Divider />
      <NavigationMenu.Item
        id="item-2"
        label="Flat item with very long name"
        icon="loading"
      />
      <NavigationMenu.Group label="Activities" />
      <NavigationMenu.Item
        id="item-3"
        label="Third Item"
        icon="filter-lines"
        href="#?filter=lines"
        target="_blank"
      />
      <NavigationMenu.Divider />
      <NavigationMenu.Item
        id="item-4"
        label="With Indicator"
        icon="bell-ringing-04"
        endSlot={
          <Indicator size="lg" color="default" position="top" value={10} />
        }
      />
    </NavigationMenu>
  ),
};
