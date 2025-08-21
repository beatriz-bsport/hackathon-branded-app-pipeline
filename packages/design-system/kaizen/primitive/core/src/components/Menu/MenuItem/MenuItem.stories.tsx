import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";
import { icons } from "#src/components/Icon";

import MenuItem from ".";
import { menuItemTypes } from "./constants";
import { CheckBox as CheckBoxType, Radio as RadioType } from "./types";

/**
 * React component for a menu item element. <br>
 * The `MenuItem` component is a versatile and reusable component that serves as the building block
 * for various menu item types, including buttons, radios, checkboxes, dividers, and titles. <br>
 * It dynamically renders the appropriate menu item component based on the specified `type` prop. <br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=438-4642&node-type=section&t=aRfMusWFLPnM8iFw-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof MenuItem> = {
  component: MenuItem,
  args: {
    label: "Menu Item",
    disabled: false,
    checked: false,
  },
  argTypes: {
    type: {
      control: { type: "select" },
      options: Object.values(menuItemTypes),
    },
    label: {
      control: "text",
    },
    disabled: {
      table: {
        type: { summary: "boolean" },
      },
      control: "boolean",
    },
    iconLeft: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    avatar: {
      options: ["none", "avatar image"],
      control: { type: "inline-radio" },
      mapping: {
        none: undefined,
        "avatar image": { src: AvatarImage },
      },
    },
    value: {
      options: ["checked", "unchecked", "indeterminate"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "unchecked" } },
      if: { arg: "type", eq: menuItemTypes.checkbox },
    },
    checked: {
      control: { type: "boolean" },
      if: { arg: "type", eq: menuItemTypes.radio },
    },
  },
  decorators: [
    (Story, context) => {
      const { args } = context;
      if (args.type === menuItemTypes.checkbox) {
        args.value = args.value || "unchecked"; // Default checkbox value
      }
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof MenuItem>;

export const DefaultMenuItem: Story = {
  name: "DefaultMenuItem",
  args: {
    type: menuItemTypes.button,
  },
};

export const ButtonMenuItem: Story = {
  name: "ButtonMenuItem",
  args: {
    type: menuItemTypes.button,
  },
  argTypes: {
    type: {
      table: {
        disable: true,
      },
    },
  },
};

export const MenuItemText: Story = {
  name: "MenuItemText",
  args: {
    type: menuItemTypes.text,
    label: "Menu Item Text",
    description: "This is a description for the menu item text.",
  },
  argTypes: {
    type: {
      table: {
        disable: true,
      },
    },
    disabled: {
      table: {
        disable: true,
      },
    },
  },
};

export const MenuItemRadio = {
  name: "MenuItemRadio",
  render: (args: RadioType) => {
    const [selected, setSelected] = useState(args.checked);
    useEffect(() => {
      setSelected(args.checked);
    }, [args.checked]);
    return (
      <MenuItem
        {...args}
        checked={selected}
        onChange={() => {
          setSelected(true);
        }}
        type={menuItemTypes.radio}
      />
    );
  },
  args: {
    value: "option-1",
    checked: false,
    disabled: false,
    avatar: "avatar image",
  },
  argTypes: {
    type: {
      table: {
        disable: true,
      },
    },
  },
};

export const MenuItemCheckbox = {
  argTypes: {
    value: {
      options: ["checked", "unchecked", "indeterminate"],
      control: { type: "inline-radio" },
    },
    type: {
      table: {
        disable: true,
      },
    },
  },
  name: "MenuItemCheckbox",
  render: (args: CheckBoxType) => {
    const [value, setValue] = useState(args.value);

    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    const handleChange = () => {
      setValue((prevValue) =>
        prevValue === "checked" ? "unchecked" : "checked",
      );
    };

    return <MenuItem {...args} value={value} onClick={handleChange} />;
  },
  args: {
    id: "checkbox-2",
    type: menuItemTypes.checkbox,
    disabled: false,
    value: "checked",
    avatar: "avatar image",
  },
};

export const MenuItemDivider: Story = {
  name: "MenuItemDivider",
  args: {
    type: menuItemTypes.divider,
  },
};

export const MenuItemTitle: Story = {
  name: "MenuItemTitle",
  args: {
    type: menuItemTypes.title,
  },
  argTypes: {
    type: {
      table: {
        disable: true,
      },
    },
  },
};
