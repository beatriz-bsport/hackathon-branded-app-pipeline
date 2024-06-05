import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import { generateRandomNames } from '#utils/factories';

import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
} from '#libs/exportable-components/types';
import MenuItemList from '#Fabrique/MenuItemList';
import MenuItem from '#Fabrique/MenuItem';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import Typography from '#Fabrique/Typography';
// @ts-expect-error
import MenuCss from './styles.css?raw';
import Menu from '.';

const menuItemLabels = generateRandomNames(faker, { count: 5 });

const menuItemData = menuItemLabels.map((label) => ({
  id: faker.number.int(),
  label,
}));

export const FABRIQUE_MENU_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_MENU,
  css: MenuCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: [],
};

export const FABRIQUE_MENU_PREVIEW: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget;
    setAnchorEl(currentTarget);
    setIsOpen(true);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

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
    <div>
      <ButtonBase
        aria-controls={isOpen && 'basic-menu'}
        aria-haspopup="true"
        isDisabled={isOpen}
        onClick={handleOnClick}
        style={{ border: '2px solid black', padding: '16px' }}
      >
        <Typography variant="body-lg">Open Menu</Typography>
      </ButtonBase>
      <Menu isOpen anchorEl={anchorEl} id="basic-menu" onClose={handleOnClose}>
        <MenuItemList>
          {menuItemData.map((menuItem) => (
            <MenuItem
              key={menuItem.id}
              label={menuItem.label}
              onClick={handleClick(menuItem.id)}
              selected={itemsSelected.includes(menuItem.id)}
              type="checkbox"
            />
          ))}
        </MenuItemList>
      </Menu>
    </div>
  );
});
