import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import MenuItemList, { MenuItemListProps } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MenuItemListCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import MenuItem from '../MenuItem';

const GROUP_TITLE = faker.lorem.word();
const FIRST_LABEL = faker.lorem.word();
const SECOND_LABEL = faker.lorem.word();

const fabriqueMenuItemListVariationRegistry = [
  {
    label: 'showGroupTitle',
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
    label: 'hasDivider',
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
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MenuItemListProps => {
  const hasGroupTitle = variationsSelected?.showGroupTitle?.value === 'true';
  const hasDivider = variationsSelected?.hasDivider?.value === 'true';
  return {
    hasDivider,
    groupTitle: hasGroupTitle && GROUP_TITLE,
  };
};

export const FABRIQUE_MENU_ITEM_LIST_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_MENU_ITEM_LIST,
    css: MenuItemListCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriqueMenuItemListVariationRegistry,
  };

export const FABRIQUE_MENU_ITEM_LIST_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <MenuItemList {...componentProps}>
      <MenuItem label={FIRST_LABEL} />
      <MenuItem label={SECOND_LABEL} />
    </MenuItemList>
  );
});
