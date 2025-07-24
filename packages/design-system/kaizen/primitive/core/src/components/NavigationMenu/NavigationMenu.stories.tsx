import type { Meta, StoryObj } from "@storybook/react";

import Badge from "#src/components/Badge";
import Indicator from "#src/components/Indicator";
import NavigationMenu from "#src/components/NavigationMenu";

/**
 * The NavigationMenu component renders a structured, interactive navigation menu.
 * It supports items with optional sub-items, icons, and customizable actions using a composable API.
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

export const Default: Story = {
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
        <NavigationMenu.SubItem id="subItems1-evening" label="Good Evening" />
        <NavigationMenu.SubItem id="subItems1-night" label="Good Night" />
        <NavigationMenu.SubItem id="subItems1-sunrise" label="Sunrise" />
        <NavigationMenu.SubItem id="subItems1-sunset" label="Sunset" />
        <NavigationMenu.SubItem
          id="subItems1-midnight"
          label="Midnight Thoughts"
        />
      </NavigationMenu.Item>
      <NavigationMenu.Divider />
      <NavigationMenu.Item
        id="item-2"
        label="Flat item with very long name with many words"
        icon="loading"
      />
      <NavigationMenu.Item
        id="item-3"
        label="Third Item"
        icon="filter-lines"
        href="#?filter=lines"
        target="_blank"
      />
      <NavigationMenu.Divider />
      <NavigationMenu.Item id="item-4" label="Activity" icon="file-06">
        <NavigationMenu.SubItem
          id="subItems3-forest"
          label="Walk in the Forest"
        />
        <NavigationMenu.SubItem
          id="subItems3-mountain"
          label="Mountain Adventure"
        />
        <NavigationMenu.SubItem id="subItems3-beach" label="Beach Day" />
        <NavigationMenu.SubItem id="subItems3-city" label="City Lights" />
        <NavigationMenu.SubItem id="subItems3-camping" label="Camping Trip" />
        <NavigationMenu.SubItem
          id="subItems3-garden"
          label="Stroll in the Garden"
        />
        <NavigationMenu.SubItem id="subItems3-lake" label="Lake Escape" />
      </NavigationMenu.Item>
      <NavigationMenu.Divider />
      <NavigationMenu.Item
        id="item-5"
        label="LG indicator"
        icon="bell-ringing-04"
        endSlot={
          <Indicator size="lg" color="default" position="top" value={10} />
        }
      />
      <NavigationMenu.Item
        id="item-6"
        label="SM indicator"
        icon="bell-ringing-04"
        endSlot={
          <Indicator size="sm" color="default" position="top" value={10} />
        }
      />
      <NavigationMenu.Item
        id="item-7"
        label="Menu item with very long name with many words as well"
        icon="book-closed"
      >
        <NavigationMenu.SubItem id="subItems7-coffee" label="Morning Coffee" />
        <NavigationMenu.SubItem id="subItems7-tea" label="Afternoon Tea" />
        <NavigationMenu.SubItem id="subItems7-lunch" label="Lunch Time" />
        <NavigationMenu.SubItem id="subItems7-dinner" label="Dinner Time" />
        <NavigationMenu.SubItem id="subItems7-dessert" label="Dessert Break" />
        <NavigationMenu.SubItem id="subItems7-snack" label="Snack Attack" />
        <NavigationMenu.SubItem id="subItems7-drinks" label="Evening Drinks" />
      </NavigationMenu.Item>
    </NavigationMenu>
  ),
};

export const WithActiveSubItem: Story = {
  render: () => (
    <NavigationMenu className="max-w-[320px]">
      <NavigationMenu.Item
        id="item-1"
        label="Day time"
        icon="user-edit"
        endSlot={<Badge size="sm" color="default" text="auto-open" />}
      >
        <NavigationMenu.SubItem id="subItems1-morning" label="Good Morning" />
        <NavigationMenu.SubItem
          id="subItems1-afternoon"
          label="Good Afternoon"
          active
        />
        <NavigationMenu.SubItem id="subItems1-evening" label="Good Evening" />
      </NavigationMenu.Item>
      <NavigationMenu.Divider />
      <NavigationMenu.Item id="item-2" label="Activities" icon="file-06">
        <NavigationMenu.SubItem
          id="subItems2-forest"
          label="Walk in the Forest"
        />
        <NavigationMenu.SubItem
          id="subItems2-mountain"
          label="Mountain Adventure"
        />
      </NavigationMenu.Item>
      <NavigationMenu.Item id="item-3" label="Regular Item" icon="loading" />
    </NavigationMenu>
  ),
};
