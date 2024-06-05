import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import MenuItem, { MenuItemProps, MenuItemType, MenuItemTypeEnum } from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MenuItemCss from './styles.css?raw';

import { MENU_ITEM_START_ICON } from './constants';

const LABEL = faker.lorem.word();

const fabriqueMenuItemVariationRegistry = [
  {
    label: 'displayLeftIcon',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'type',
    choices: [
      {
        label: MenuItemTypeEnum.TEXT,
        value: MenuItemTypeEnum.TEXT,
      },
      {
        label: MenuItemTypeEnum.CHECKBOX,
        value: MenuItemTypeEnum.CHECKBOX,
      },
      {
        label: MenuItemTypeEnum.RADIO,
        value: MenuItemTypeEnum.RADIO,
      },
    ],
    default: { label: MenuItemTypeEnum.TEXT, value: MenuItemTypeEnum.TEXT },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MenuItemProps => {
  const selected = variationsSelected?.selected?.value === 'true';
  const type = variationsSelected?.type?.value as MenuItemType;
  const withLeftIcon = variationsSelected?.displayLeftIcon?.value === 'true';
  return {
    label: LABEL,
    selected,
    type,
    leftIcon: withLeftIcon && MENU_ITEM_START_ICON,
  };
};

export const FABRIQUE_MENU_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_MENU_ITEM,
  css: MenuItemCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueMenuItemVariationRegistry,
};

export const FABRIQUE_MENU_ITEM_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const handleSelection = () => setIsChecked((prevState) => !prevState);
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <MenuItem
      {...componentProps}
      onClick={handleSelection}
      selected={isChecked}
    />
  );
});
