import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useState } from "react";

import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";
import Badge from "#src/components/Badge";
import Chip from "#src/components/Chip";
import Icon from "#src/components/Icon";
import { Item } from "#src/components/Menu/types";

import Menu from ".";

const menuOptions: Item[] = [
  { type: "title", label: "Menu title" },
  {
    id: "1",
    label: "Base Option 1",
    description: "This is the first option",
  },
  {
    id: "2",
    label: "Base Option 2",
    description: "This is the second option",
  },
  {
    id: "3",
    label: "Base Option 3",
    description: "This is the third option",
  },
  { type: "divider" },
  {
    id: "menu-button",
    label: "Menu Button",
    type: "button",
    onClick: () => {},
    iconLeft: "arrow-right",
  },
];

const menuOptionsMulti: Item[] = [
  { type: "title", label: "Multi Select Mode" },
  {
    id: "1",
    label: "Option 1",
  },
  {
    id: "2",
    label: "Option 2",
  },
  {
    id: "3",
    label: "Option 3",
  },
  { type: "divider" },
];

const menuOptionsWithAvatar: Item[] = [
  { type: "title", label: "Menu with avatars" },
  {
    id: "1",
    label: "Option 1",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  {
    id: "2",
    label: "Option 2",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  {
    id: "3",
    label: "Option 3",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  { type: "divider" },
];

const menuOptionsTextWithAvatar: Item[] = [
  { type: "title", label: "Menu with text items" },
  {
    id: "1",
    type: "text",
    label: "Option 1",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  {
    id: "2",
    type: "text",
    label: "Option 2",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  {
    id: "3",
    type: "text",
    label: "Option 3",
    avatar: { src: AvatarImage, initials: "BB" },
  },
  { type: "divider" },
];

const menuOptionsWithIcon: Item[] = [
  { type: "title", label: "Menu with icon" },
  {
    id: "1",
    label: "Option 1",
    iconLeft: "user-edit",
  },
  {
    id: "2",
    label: "Option 2",
    iconLeft: "user-edit",
  },
  {
    id: "3",
    label: "Option 3",
    iconLeft: "user-edit",
  },
  { type: "divider" },
];

const menuOptionsWithRightSlot: Item[] = [
  { type: "title", label: "Menu items with right slots" },
  {
    id: "1",
    label: "Option 1",
    iconLeft: "user-edit",
    rightSlot: <Badge color="default" size="sm" text="I'm a badge" />,
  },
  {
    id: "2",
    label: "Option 2",
    iconLeft: "user-edit",
    rightSlot: <Chip color="info" label="I'm a chip" size="sm" type="strong" />,
  },
  {
    id: "3",
    label: "Option 3",
    iconLeft: "user-edit",
    rightSlot: (
      <div className="flex gap-xs">
        <Badge color="default" size="sm" text="I'm a badge with an icon" />
        <Icon icon="chevron-right" size="sm" />
      </div>
    ),
  },
  { type: "divider" },
];

const menuOptionsWithLeftSlot: Item[] = [
  { type: "title", label: "Menu items with left slots" },
  {
    id: "1",
    label: "Option 1",
    leftSlot: <Badge color="default" size="sm" text="I'm a badge" />,
  },
  {
    id: "2",
    label: "Option 2",
    iconLeft: "user-edit",
    leftSlot: <Chip color="info" label="I'm a chip" size="sm" type="strong" />,
  },
  {
    id: "3",
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

const singleMenuWithSubCategories: Item[] = [
  { type: "title", label: "Tag Group 1" },
  {
    id: "1",
    label: "Sub tag alpha",
    rightSlot: (
      <div className="w-[14px] h-[14px] rounded-[4px] bg-[#50d71e]"></div>
    ),
  },
  {
    id: "2",
    label: "Sub tag beta",
    rightSlot: (
      <div className="w-[14px] h-[14px] rounded-[4px] bg-[#50d71e]"></div>
    ),
  },
  {
    id: "3",
    label: "Sub tag omega",
    rightSlot: (
      <div className="w-[14px] h-[14px] rounded-[4px] bg-[#50d71e]"></div>
    ),
  },
  { type: "title", label: "Tag Group 2" },
  {
    id: "4",
    label: "Sub tag charizard",
    rightSlot: (
      <div className="w-[14px] h-[14px] rounded-[4px] bg-[#50d71e]"></div>
    ),
  },
  {
    id: "5",
    label: "Sub tag pikachu",
    rightSlot: (
      <div className="w-[14px] h-[14px] rounded-[4px] bg-[#50d71e]"></div>
    ),
  },
  {
    id: "6",
    label: "Sub tag gengar",
    rightSlot: (
      <div className="w-[14px] h-[14px] rounded-[4px] bg-[#50d71e]"></div>
    ),
  },
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
  },
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const DefaultMenu: Story = {
  name: "Menu",
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string[]>([]);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const handleSelect = (itemId: string) => {
      setSelectedValue([itemId]);
    };

    const handleMultiSelect = (itemId: string) => {
      setSelectedValues((prevState) => {
        const isSelected = prevState.includes(itemId);
        return isSelected
          ? prevState.filter((selected) => selected !== itemId)
          : [...prevState, itemId];
      });
    };

    useEffect(() => {
      setSelectedValues([]);
    }, [args.multiSelect]);

    return (
      <div className="flex flex-col gap-md">
        <Menu
          {...args}
          onSelectOption={handleSelect}
          selectedValues={selectedValue}
          multiSelect={false}
          items={menuOptions}
        />
        <Menu
          {...args}
          onSelectOption={handleMultiSelect}
          selectedValues={selectedValues}
          multiSelect={true}
          items={menuOptionsMulti}
        />
        <Menu {...args} items={menuOptionsTextWithAvatar} />
      </div>
    );
  },
};

export const MenuWithAvatars: Story = {
  name: "Menu with Avatars",
  args: {
    items: menuOptionsWithAvatar,
    multiSelect: false,
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

export const MenuWithIcons: Story = {
  name: "Menu with Icons",
  args: {
    items: menuOptionsWithIcon,
    multiSelect: false,
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

export const MenuWithRightSlots: Story = {
  name: "Menu Items with right slot",
  args: {
    items: menuOptionsWithRightSlot,
    multiSelect: false,
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

export const MenuWithLeftSlots: Story = {
  name: "Menu Items with left slot",
  args: {
    items: menuOptionsWithLeftSlot,
    multiSelect: false,
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

export const SingleMenuWithSubCategories: Story = {
  name: "Single Menu with sub categories",
  args: {
    items: singleMenuWithSubCategories,
    multiSelect: true,
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
