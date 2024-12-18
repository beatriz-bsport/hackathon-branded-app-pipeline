import React, { useCallback, useMemo, useState } from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import Submenu from '.';
import { generateRandomName } from '#src/utils/factories';
import {
  Star01,
  Tag01,
  Target01,
  Podcast,
  Power01,
  GraduationHat01,
} from '#src/components/untitledui';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#src/libs/exportable-components/types';
import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';

// @ts-expect-error
import SubmenuCss from './styles.css?raw';

const RANDOM_ICON = faker.helpers.arrayElement([
  null,
  <Star01 key="bs-submenu-item-preview__icon" />,
  <Tag01 key="bs-submenu-item-preview__icon" />,
  <Target01 key="bs-submenu-item-preview__icon" />,
  <Podcast key="bs-submenu-item-preview__icon" />,
  <Power01 key="bs-submenu-item-preview__icon" />,
  <GraduationHat01 key="bs-submenu-item-preview__icon" />,
]);

const SUBMENU_TEXT_ITEMS: SubmenuItem[] = faker.helpers.multiple(() => ({
  className: 'bs-submenu-item-preview',
  title: generateRandomName(faker),
  leftIcon: RANDOM_ICON,
  rightIcon: RANDOM_ICON,
}));

const SUBMENU_RECURSIVE_ITEM: SubmenuItem = {
  title: generateRandomName(faker),
  items: SUBMENU_TEXT_ITEMS,
};

const SUBMENU_ITEMS: SubmenuItem[] = [
  ...SUBMENU_TEXT_ITEMS,
  { isDivider: true },
  SUBMENU_RECURSIVE_ITEM,
];

export const FABRIQUE_SUBMENU_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_SUBMENU,
  css: SubmenuCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: [],
};

export const FABRIQUE_SUBMENU_PREVIEW: React.FC = React.memo(() => {
  const [selectedIndex, setselectedIndex] = useState(null);

  const handleOnClick = useCallback((index) => setselectedIndex(index), []);

  const items = useMemo(
    () =>
      SUBMENU_ITEMS.map((item, index) => ({
        ...item,
        isSelected: selectedIndex === index,
        onClick: () => handleOnClick(index),
      })),
    [handleOnClick, selectedIndex],
  );

  return <Submenu handleSetRecursiveItems={() => {}} items={items} />;
});
