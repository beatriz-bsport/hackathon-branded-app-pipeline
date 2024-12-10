import React, { useEffect, useState } from "react";
import Menu from ".";
import type { Meta, StoryObj } from "@storybook/react";
import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";
import { Item } from "#src/components/Menu/types";

const menuOptions: Item[] = [
  { type: "title", label: "Menu title" },
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
    avatar: AvatarImage,
  },
  {
    id: "2",
    label: "Option 2",
    avatar: AvatarImage,
  },
  {
    id: "3",
    label: "Option 3",
    avatar: AvatarImage,
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
      <div>
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
