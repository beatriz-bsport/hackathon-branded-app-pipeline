import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import Badge from '.';
import { BadgeColorEnum } from './constants';
import { BadgeColor } from './types';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import BadgeCss from './styles.css?raw';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import type { CompanyTheme } from '#libs/theme/types';

const fabriqueBadgeVariationRegistry = [
  {
    label: 'color',
    choices: [
      { label: BadgeColorEnum.MAIN, value: BadgeColorEnum.MAIN },
      { label: BadgeColorEnum.GREY, value: BadgeColorEnum.GREY },
      { label: BadgeColorEnum.ONSTRONG, value: BadgeColorEnum.ONSTRONG },
      { label: BadgeColorEnum.WARNING, value: BadgeColorEnum.WARNING },
    ],
    default: { label: BadgeColorEnum.MAIN, value: BadgeColorEnum.MAIN },
  },
];

export const FABRIQUE_BADGE_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_BADGE,
  css: BadgeCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueBadgeVariationRegistry,
};

export const FABRIQUE_BADGE_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const color = variationsSelected?.color?.value as BadgeColor;

  return (
    <Badge color={color} value={faker.number.int({ min: 0, max: 2000 })} />
  );
});
