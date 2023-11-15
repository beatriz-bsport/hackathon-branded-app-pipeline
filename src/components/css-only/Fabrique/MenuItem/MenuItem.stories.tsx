import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MenuItem, {
  MenuItemStorybook,
  MenuItemProps,
  MenuItemTypeEnum,
} from '.';

import { MENU_ITEM_START_ICON } from './constants';

MenuItemStorybook.displayName = 'MenuItem';

const MenuItemTemplate: ComponentStory<typeof MenuItem> = (
  args: MenuItemProps,
) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const handleSelection = () => setIsChecked((prevState) => !prevState);

  return (
    <MenuItemStorybook
      {...args}
      selected={isChecked}
      onClick={handleSelection}
    />
  );
};

export const Textmenuitem = MenuItemTemplate.bind({});
Textmenuitem.args = {
  type: MenuItemTypeEnum.TEXT,
};

export const Textmenuitemwithicon = MenuItemTemplate.bind({});
Textmenuitemwithicon.args = {
  type: MenuItemTypeEnum.TEXT,
  leftIcon: MENU_ITEM_START_ICON,
};

export const Checkboxmenuitem = MenuItemTemplate.bind({});
Checkboxmenuitem.args = {
  type: MenuItemTypeEnum.CHECKBOX,
};

export const Radiomenuitem = MenuItemTemplate.bind({});
Radiomenuitem.args = {
  type: MenuItemTypeEnum.RADIO,
};

export default {
  title: 'Fabrique/MenuItem/Stories',
  component: MenuItem,
  argTypes: {
    className: {
      description: 'Extend the styles applied to the component.',
    },
    classes: {
      description: 'Extend the styles applied to the nested elements.',
    },
    href: {
      description: 'An optional link to redirect the user.',
    },
    isRippleEnabled: {
      description:
        'Indicates whether the ripple effect is enabled (true) or disabled (false).',
      control: 'boolean',
      defaultValue: false,
    },
    label: {
      description:
        'A required string representing the label or text associated with the item.',
      control: 'text',
      defaultValue: 'Label',
    },
    leftIcon: {
      description:
        'An optional React element that represents an icon to be displayed on the left side of the component.',
    },
    onClick: {
      description: 'A callback function to be triggered when clicked.',
    },
    selected: {
      description: 'If true, the component is selected',
      control: 'boolean',
      defaultValue: false,
    },
    type: {
      description:
        "A string indicating the type of the component, which can be one of 'text', 'checkbox', or 'radio'.",
      control: 'radio',
      options: [
        MenuItemTypeEnum.CHECKBOX,
        MenuItemTypeEnum.RADIO,
        MenuItemTypeEnum.TEXT,
      ],
      defaultValue: MenuItemTypeEnum.TEXT,
    },
  },
} as ComponentMeta<typeof MenuItemStorybook>;
