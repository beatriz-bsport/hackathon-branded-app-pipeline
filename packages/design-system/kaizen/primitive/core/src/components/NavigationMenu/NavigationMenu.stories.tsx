import type { Meta, StoryObj } from "@storybook/react";
import Badge from "#src/components/Badge";
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
    label: "Food",
    icon: "loading",
    subItems: [
      { id: "subItems2-coffee", label: "Morning Coffee" },
      { id: "subItems2-tea", label: "Afternoon Tea" },
      { id: "subItems2-lunch", label: "Lunch Time" },
      { id: "subItems2-dinner", label: "Dinner Time" },
      { id: "subItems2-dessert", label: "Dessert Break" },
      { id: "subItems2-snack", label: "Snack Attack" },
      { id: "subItems2-drinks", label: "Evening Drinks" },
    ],
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
    elements,
    onItemClick: (item) => (e) => {
      e.preventDefault();
      console.log("item clicked:", item);
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const NavigationMenuExample: Story = {};
