import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";

import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";
import Badge from "#src/components/Badge";
import Button from "#src/components/Button";
import Chip from "#src/components/Chip";
import Icon from "#src/components/Icon";
import { Item } from "#src/components/Menu/types";
import { Placements } from "#src/hooks/placement-classes.hook";

import DropdownMenu from ".";

const basicMenuItems: Item[] = [
  { type: "title", label: "Basic Menu" },
  { id: "item1", label: "Option 1" },
  { id: "item2", label: "Option 2" },
  { id: "item3", label: "Option 3" },
  { type: "divider" },
  { id: "item4", label: "Option 4" },
];

const menuItemsWithIcons: Item[] = [
  { type: "title", label: "Menu with Icons" },
  { id: "edit", label: "Edit", iconLeft: "pencil-02" },
  { id: "duplicate", label: "Duplicate", iconLeft: "copy-03" },
  { id: "archive", label: "Archive", iconLeft: "archive" },
  { type: "divider" },
  { id: "delete", label: "Delete", iconLeft: "trash-01" },
];

const menuItemsWithAvatars: Item[] = [
  { type: "title", label: "Menu with Avatars" },
  {
    id: "user1",
    label: "User One",
    avatar: { src: AvatarImage, initials: "UO" },
  },
  {
    id: "user2",
    label: "User Two",
    avatar: { src: AvatarImage, initials: "UT" },
  },
  {
    id: "user3",
    label: "User Three",
    avatar: { src: AvatarImage, initials: "UT" },
  },
];

const menuItemsWithRightSlot: Item[] = [
  { type: "title", label: "Menu with Right Slots" },
  {
    id: "badge",
    label: "With Badge",
    iconLeft: "bell-03",
    rightSlot: <Badge color="default" size="sm" text="New" />,
  },
  {
    id: "chip",
    label: "With Chip",
    iconLeft: "ticket-01",
    rightSlot: <Chip color="info" label="Featured" size="sm" type="strong" />,
  },
  {
    id: "icon",
    label: "With Icon",
    iconLeft: "settings-03",
    rightSlot: <Icon icon="chevron-right" size="sm" />,
  },
];

/**
 * The DropdownMenu component combines a Popover with a Menu to create a dropdown interface.
 * It provides a target element that, when clicked, opens a menu with selectable options.
 *
 * This component is useful for creating dropdown menus, context menus, or any interface
 * where a list of options should appear in response to a user action.
 */
const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
  argTypes: {
    target: {
      control: false,
      description: "Callback for the popover anchor element",
      table: { type: { summary: "ReactNode" } },
    },
    placement: {
      control: { type: "select" },
      options: Object.values(Placements),
      description: "Popover placement",
      table: { type: { summary: "string" } },
    },
    items: {
      control: false,
      description: "Menu items",
      table: { type: { summary: "Item[]" } },
    },
    onSelectOption: {
      action: "onSelectOption",
      control: false,
      description: "Callback when an item is selected",
      table: { type: { summary: "(params) => void" } },
    },
    selectedValues: {
      control: { type: "object" },
      description: "Selected item IDs",
      table: { type: { summary: "string[]" } },
    },
    searchConfig: {
      control: false,
      description: "Search configuration object",
      table: {
        type: {
          summary:
            "{ placeholder?: string; value?: string; onChange?: (value: string) => void }",
        },
      },
    },
  },
  args: {
    target: () => <Button size="sm" intent="default" color="main" />,
    placement: "bottom-left",
    items: [],
    onSelectOption: undefined,
    selectedValues: [],
    searchConfig: undefined,
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

type HandleSelectOption = ComponentProps<typeof DropdownMenu>["onSelectOption"];

export const Basic: Story = {
  name: "Basic Dropdown Menu",
  render: () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelectOption: HandleSelectOption = ({
      id,
      setIsPopoverOpened,
    }) => {
      setSelectedOption(id);
      setIsPopoverOpened(false);
    };

    return (
      <div className="p-lg">
        <DropdownMenu
          items={basicMenuItems}
          onSelectOption={handleSelectOption}
          placement="bottom-left"
          target={({ setIsPopoverOpened }) => (
            <Button
              label="Open Menu"
              intent="default"
              color="main"
              size="md"
              onClick={() => setIsPopoverOpened(true)}
            />
          )}
          selectedValues={selectedOption ? [selectedOption] : []}
        />
        {selectedOption && (
          <div className="mt-md">
            <p>Selected option: {selectedOption}</p>
          </div>
        )}
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};

export const WithIcons: Story = {
  name: "Dropdown Menu with Icons",
  render: () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelectOption: HandleSelectOption = ({
      id,
      setIsPopoverOpened,
    }) => {
      setSelectedOption(id);
      setIsPopoverOpened(false);
    };

    return (
      <div className="p-lg">
        <DropdownMenu
          items={menuItemsWithIcons}
          onSelectOption={handleSelectOption}
          placement="bottom-left"
          target={({ setIsPopoverOpened }) => (
            <Button
              label="Actions"
              intent="default"
              color="main"
              size="md"
              iconRight="chevron-down"
              onClick={() => setIsPopoverOpened(true)}
            />
          )}
          selectedValues={selectedOption ? [selectedOption] : []}
        />
        {selectedOption && (
          <div className="mt-md">
            <p>Selected action: {selectedOption}</p>
          </div>
        )}
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};

export const WithAvatars: Story = {
  name: "Dropdown Menu with Avatars",
  render: () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelectOption: HandleSelectOption = ({
      id,
      setIsPopoverOpened,
    }) => {
      setSelectedOption(id);
      setIsPopoverOpened(false);
    };

    return (
      <div className="p-lg">
        <DropdownMenu
          items={menuItemsWithAvatars}
          onSelectOption={handleSelectOption}
          placement="bottom-left"
          target={({ setIsPopoverOpened }) => (
            <Button
              label="Select User"
              intent="default"
              color="main"
              size="md"
              iconRight="chevron-down"
              onClick={() => setIsPopoverOpened(true)}
            />
          )}
          selectedValues={selectedOption ? [selectedOption] : []}
        />
        {selectedOption && (
          <div className="mt-md">
            <p>Selected user: {selectedOption}</p>
          </div>
        )}
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};

export const WithRightSlots: Story = {
  name: "Dropdown Menu with Right Slots",
  render: () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelectOption: HandleSelectOption = ({
      id,
      setIsPopoverOpened,
    }) => {
      setSelectedOption(id);
      setIsPopoverOpened(false);
    };

    return (
      <div className="p-lg">
        <DropdownMenu
          items={menuItemsWithRightSlot}
          onSelectOption={handleSelectOption}
          placement="bottom-left"
          target={({ setIsPopoverOpened }) => (
            <Button
              label="Options with Slots"
              intent="default"
              color="main"
              size="md"
              iconRight="chevron-down"
              onClick={() => setIsPopoverOpened(true)}
            />
          )}
          selectedValues={selectedOption ? [selectedOption] : []}
        />
        {selectedOption && (
          <div className="mt-md">
            <p>Selected option: {selectedOption}</p>
          </div>
        )}
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};

export const WithSearch: Story = {
  name: "Dropdown Menu with Search (Quick Filter)",
  render: () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");

    const searchableMenuItems: Item[] = [
      { type: "title", label: "Searchable Menu" },
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
      { id: "orange", label: "Orange" },
      { id: "grape", label: "Grape" },
      { type: "divider" },
      { id: "pear", label: "Pear" },
    ];

    return (
      <div className="p-lg">
        <DropdownMenu
          items={searchableMenuItems}
          onSelectOption={({ id, setIsPopoverOpened }) => {
            setSelectedOption(id);
            setIsPopoverOpened(false);
          }}
          placement="bottom-left"
          target={({ setIsPopoverOpened }) => (
            <Button
              label="Open Searchable Menu"
              intent="default"
              color="main"
              size="md"
              onClick={() => setIsPopoverOpened(true)}
            />
          )}
          selectedValues={selectedOption ? [selectedOption] : []}
          searchConfig={{
            placeholder: "Type to filter options...",
            value: searchValue,
            onChange: setSearchValue,
          }}
        />
        <div className="mt-md">
          <p>Selected option: {selectedOption ?? "None"}</p>
          <p>Current search: {searchValue}</p>
        </div>
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};

export const DifferentPlacements: Story = {
  name: "Dropdown Menu with Different Placements",
  render: () => {
    const handleSelectOption: HandleSelectOption = ({
      setIsPopoverOpened,
    }: {
      id: string;
      setIsPopoverOpened: (value: boolean) => void;
    }) => {
      setIsPopoverOpened(false);
    };

    return (
      <div className="p-lg grid grid-cols-3 gap-lg">
        {Object.values(Placements).map((placement) => (
          <div key={placement} className="flex flex-col items-center">
            <p className="mb-sm">{placement}</p>
            <DropdownMenu
              items={basicMenuItems}
              onSelectOption={handleSelectOption}
              placement={placement}
              target={({ setIsPopoverOpened }) => (
                <Button
                  label={placement}
                  intent="default"
                  color="main"
                  size="sm"
                  onClick={() => setIsPopoverOpened(true)}
                />
              )}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const CustomTarget: Story = {
  name: "Dropdown Menu with Custom Target",
  render: () => {
    const handleSelectOption: HandleSelectOption = ({ setIsPopoverOpened }) => {
      setIsPopoverOpened(false);
    };

    return (
      <div className="p-lg flex gap-lg">
        <DropdownMenu
          items={menuItemsWithIcons}
          onSelectOption={handleSelectOption}
          placement="bottom-left"
          target={({ setIsPopoverOpened }) => (
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
              onClick={() => setIsPopoverOpened(true)}
            >
              <Icon icon="dots-horizontal" size="md" />
            </div>
          )}
        />

        <DropdownMenu
          items={menuItemsWithIcons}
          onSelectOption={handleSelectOption}
          placement="bottom-left"
          target={({ setIsPopoverOpened }) => (
            <div
              className="p-sm border border-gray-300 rounded cursor-pointer hover:bg-gray-100 flex items-center gap-xs"
              onClick={() => setIsPopoverOpened(true)}
            >
              <Icon icon="settings-03" size="sm" />
              <span>Settings</span>
              <Icon icon="chevron-down" size="sm" />
            </div>
          )}
        />
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};
