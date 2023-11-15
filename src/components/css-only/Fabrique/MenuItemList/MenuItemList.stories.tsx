import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import MenuItemList, { MenuItemListStorybook, type MenuItemListProps } from '.';
import MenuItem from '../MenuItem';
import { generateRandomNames } from '#utils/factories';

MenuItemListStorybook.displayName = 'MenuItemList';

const menuItemLabels = generateRandomNames(faker, { count: 5 });

const menuItemData = menuItemLabels.map((label) => ({
  id: faker.number.int(),
  label,
}));

const MenuListWithTextItems: ComponentStory<typeof MenuItemList> = (
  args: MenuItemListProps,
) => (
  <MenuItemListStorybook {...args}>
    {menuItemData.map((menuItem) => (
      <MenuItem key={menuItem.id} label={menuItem.label} />
    ))}
  </MenuItemListStorybook>
);

const MenuListWithCheckBoxes: ComponentStory<typeof MenuItemList> = (
  args: MenuItemListProps,
) => {
  const [itemsSelected, setItemsSelected] = React.useState<number[]>([]);

  const handleClick = (id: number) => () => {
    setItemsSelected((prevState) => {
      const isSelected = prevState.includes(id);
      return isSelected
        ? prevState.filter((selected) => selected !== id)
        : [...prevState, id];
    });
  };

  return (
    <MenuItemListStorybook {...args}>
      {menuItemData.map((menuItem) => (
        <MenuItem
          key={menuItem.id}
          onClick={handleClick(menuItem.id)}
          label={menuItem.label}
          type="checkbox"
          selected={itemsSelected.includes(menuItem.id)}
        />
      ))}
    </MenuItemListStorybook>
  );
};

const MenuListWithRadios: ComponentStory<typeof MenuItemList> = (
  args: MenuItemListProps,
) => {
  const [itemSelected, setItemSelected] = React.useState<number>(null);

  const handleClick = (id: number) => () => {
    setItemSelected(id);
  };
  return (
    <MenuItemListStorybook {...args}>
      {menuItemData.map((menuItem) => (
        <MenuItem
          key={menuItem.id}
          onClick={handleClick(menuItem.id)}
          label={menuItem.label}
          type="radio"
          selected={itemSelected === menuItem.id}
        />
      ))}
    </MenuItemListStorybook>
  );
};

export const Withtextitems = MenuListWithTextItems.bind({});
Withtextitems.args = {};

export const Withcheckboxes = MenuListWithCheckBoxes.bind({});
Withcheckboxes.args = {};

export const Withradios = MenuListWithRadios.bind({});
Withradios.args = {};

export const Withgrouptitle = MenuListWithRadios.bind({});
Withgrouptitle.args = {
  groupTitle: 'Placeholder',
};

export const Withdivider = MenuListWithRadios.bind({});
Withdivider.args = {
  groupTitle: 'Placeholder',
  hasDivider: true,
};

export default {
  title: 'Fabrique/MenuItemList/Stories',
  component: MenuItemList,
  argTypes: {
    className: {
      description: 'Extend the styles applied to the component.',
    },
    classes: {
      description: 'Extend the styles applied to the nested elements.',
    },
    hasDivider: {
      description: 'If true, the component has a divider at the bottom',
      control: 'boolean',
      defaultValue: false,
    },
    groupTitle: {
      description: 'A string representing the list group title',
      control: 'text',
    },
  },
} as ComponentMeta<typeof MenuItemListStorybook>;
