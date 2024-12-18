import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';

// @ts-expect-error
import ActionTabCss from './styles.css?raw';
import ActionTab, { Props as ActionTabProps } from '.';

const fabriqueActiontabVariationRegistry = [
  {
    label: 'isSelected',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'hasBadge',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): ActionTabProps => {
  const isSelected = variationsSelected?.isSelected?.value === 'true';
  const hasBadgeSelected = variationsSelected?.hasBadge?.value === 'true';

  return {
    isSelected,
    label: faker.lorem.word(10),
    value: faker.number.int({ min: 1, max: 100 }),
    hasBadge: hasBadgeSelected,
    onClick: () => {},
  };
};

export const FABRIQUE_ACTION_TAB_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_ACTION_TAB,
    css: ActionTabCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriqueActiontabVariationRegistry,
  };

export const FABRIQUE_ACTION_TAB_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <ActionTab {...componentProps} />;
});
