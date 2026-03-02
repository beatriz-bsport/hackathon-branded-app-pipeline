import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useState } from "react";

import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";
import Badge from "#src/components/Badge";
import Chip from "#src/components/Chip";
import Icon from "#src/components/Icon";
import { Item } from "#src/components/Menu/types";

import Menu from ".";

const LONG_DESCRIPTION =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const MENU_OPTIONS_WITH_LABEL_ONLY: Item[] = [
  { type: "title", label: "Menu with label only" },
  {
    id: "label-only-1",
    label: "Base Option 1",
  },
  {
    id: "label-only-2",
    label: "Base Option 2",
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_LABEL_AND_DESCRIPTION: Item[] = [
  { type: "title", label: "Menu with label and description" },
  {
    id: "label-and-description-1",
    label: "Base Option 1",
    description: "This is the first option",
  },
  {
    id: "label-and-description-2",
    label: "Base Option 2",
    description: LONG_DESCRIPTION,
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_BUTTON: Item[] = [
  { type: "title", label: "Menu with button" },
  {
    id: "button-1",
    label: "Button 1",
    type: "button",
    onClick: () => {},
    iconLeft: "arrow-right",
  },
  {
    id: "button-2",
    label: "Button 2",
    type: "button",
    onClick: () => {},
    iconLeft: "link-external-02",
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_AVATAR: Item[] = [
  { type: "title", label: "Menu with avatars" },
  {
    id: "avatar-1",
    label: "Option 1",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  {
    id: "avatar-2",
    label: "Option 2",
    avatar: { src: AvatarImage, initials: "DD" },
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_TEXT_TYPE: Item[] = [
  { type: "title", label: "Menu with text items" },
  {
    id: "text-type-1",
    type: "text",
    label: "Option 1",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  {
    id: "text-type-2",
    type: "text",
    label: "Option 2",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_ICON: Item[] = [
  { type: "title", label: "Menu with icon" },
  {
    id: "icon-1",
    label: "Option 1",
    iconLeft: "user-edit",
  },
  {
    id: "icon-2",
    label: "Option 2",
    iconLeft: "user-edit",
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_RIGHT_SLOT: Item[] = [
  { type: "title", label: "Menu items with right slots" },
  {
    id: "right-slot-1",
    label: "Option 1",
    rightSlot: <Badge color="default" size="sm" text="I'm a badge" />,
  },
  {
    id: "right-slot-2",
    label: "Option 2",
    rightSlot: <Chip color="info" label="I'm a chip" size="sm" type="strong" />,
  },
  {
    id: "right-slot-3",
    label: "Option 3",
    rightSlot: (
      <div className="flex gap-xs">
        <Badge color="default" size="sm" text="I'm a badge with an icon" />
        <Icon icon="chevron-right" size="sm" />
      </div>
    ),
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_LEFT_SLOT: Item[] = [
  { type: "title", label: "Menu items with left slots" },
  {
    id: "left-slot-1",
    label: "Option 1",
    leftSlot: <Badge color="default" size="sm" text="I'm a badge" />,
  },
  {
    id: "left-slot-2",
    label: "Option 2",
    iconLeft: "user-edit",
    leftSlot: <Chip color="info" label="I'm a chip" size="sm" type="strong" />,
  },
  {
    id: "left-slot-3",
    label: "Option 3",
    iconLeft: "user-edit",
    leftSlot: (
      <div className="flex gap-xs">
        <Badge color="default" size="sm" text="I'm a badge with an icon" />
        <Icon icon="chevron-right" size="sm" />
      </div>
    ),
  },
  { type: "divider" },
];

const MENU_OPTIONS_WITH_EVERYTHING: Item[] = [
  { type: "title", label: "Menu items with everything" },
  {
    id: "everything-1",
    label: "Option 1",
    description: LONG_DESCRIPTION,
    iconLeft: "archive",
    rightSlot: <Badge color="default" size="sm" text="I'm a badge" />,
  },
  {
    id: "everything-2",
    label: "Option 2",
    description: LONG_DESCRIPTION,
    rightSlot: <Chip color="info" label="I'm a chip" size="sm" type="strong" />,
    leftSlot: <Chip color="info" label="I'm a chip" size="sm" type="strong" />,
  },
  {
    id: "everything-3",
    label: "Option 3",
    description: LONG_DESCRIPTION,
    avatar: { src: AvatarImage, initials: "BB" },
    rightSlot: (
      <div className="flex gap-xs">
        <Badge color="default" size="sm" text="I'm a badge with an icon" />
        <Icon icon="chevron-right" size="sm" />
      </div>
    ),
  },
  {
    id: "everything-4",
    label: "Option 4 as text",
    type: "text",
    description: LONG_DESCRIPTION,
    iconLeft: "message-text-square-02",
  },
  { type: "divider" },
];

/**
 * React component for a standalone menu element. <br>
 * The `Menu` is a versatile component designed to render a list of menu items without a popover wrapper. <br>
 * It supports multiple item types such as titles, dividers, and selectable options (radio or checkbox),
 * offering flexibility for various menu configurations. <br>
 * <br>
 * **Features:** <br>
 * - Supports single-select and multi-select modes. <br>
 * - Dynamically renders different item types (`title`, `divider`, `radio`, `checkbox`). <br>
 * - Provides callback for item selection, enabling interactivity. <br>
 * <br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=438-4642&node-type=section&t=aRfMusWFLPnM8iFw-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Menu> = {
  component: Menu,
  args: {
    disabled: false,
    multiSelect: false,
    className: "max-w-[400px]",
    items: [
      ...MENU_OPTIONS_WITH_LABEL_ONLY,
      ...MENU_OPTIONS_WITH_LABEL_AND_DESCRIPTION,
      ...MENU_OPTIONS_WITH_AVATAR,
      ...MENU_OPTIONS_WITH_BUTTON,
      ...MENU_OPTIONS_WITH_ICON,
      ...MENU_OPTIONS_WITH_LEFT_SLOT,
      ...MENU_OPTIONS_WITH_RIGHT_SLOT,
      ...MENU_OPTIONS_WITH_TEXT_TYPE,
      ...MENU_OPTIONS_WITH_EVERYTHING,
    ],
  },
  render: (args) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const handleSelect = (itemId: string) => {
      if (args.multiSelect) {
        setSelectedValues((prevState) => {
          const isSelected = prevState.includes(itemId);
          return isSelected
            ? prevState.filter((selected) => selected !== itemId)
            : [...prevState, itemId];
        });
      } else {
        setSelectedValues([itemId]);
      }
    };

    useEffect(() => {
      setSelectedValues([]);
    }, [args.multiSelect]);

    return (
      <Menu
        {...args}
        onSelectOption={handleSelect}
        selectedValues={selectedValues}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const DefaultMenu: Story = {
  name: "Menu",
};

export const MenuWithAvatars: Story = {
  args: {
    items: MENU_OPTIONS_WITH_AVATAR,
  },
};

export const MenuWithIcons: Story = {
  args: {
    items: MENU_OPTIONS_WITH_ICON,
  },
};

export const MenuWithRightSlots: Story = {
  args: {
    items: MENU_OPTIONS_WITH_RIGHT_SLOT,
  },
};

export const MenuWithLeftSlots: Story = {
  args: {
    items: MENU_OPTIONS_WITH_LEFT_SLOT,
  },
};
