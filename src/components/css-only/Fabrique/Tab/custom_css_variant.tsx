import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import type { CompanyTheme } from '#libs/theme/types';
// @ts-expect-error
import TabCss from './styles.css?raw';
import Tab, { Props as TabProps } from '.';
import { TabColorEnum } from './constants';
import { TabColor } from './types';

const fabriqueTabVariationRegistry = [
  {
    label: 'color',
    choices: [
      { label: TabColorEnum.MAIN, value: TabColorEnum.MAIN },
      { label: TabColorEnum.GREY, value: TabColorEnum.GREY },
    ],
    default: { label: TabColorEnum.MAIN, value: TabColorEnum.MAIN },
  },
  {
    label: 'isTabSelected',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showTabSelect',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<TabProps, 'children'> => {
  const colorSelected = variationsSelected?.color?.value as TabColor;
  const isTabSelected = variationsSelected?.isTabSelected?.value === 'true';
  const showSelect = variationsSelected?.showTabSelect?.value === 'true';
  return {
    color: colorSelected,
    isSelected: isTabSelected,
    hasSelect: showSelect,
    onClick: () => {},
  };
};

export const FABRIQUE_TAB_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_TAB,
  css: TabCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueTabVariationRegistry,
};

export const FABRIQUE_TAB_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return <Tab {...componentProps}>{faker.lorem.word(8)}</Tab>;
});
