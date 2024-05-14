import React from 'react';
import { DateTime } from 'luxon';

import MarketplaceDatePicker, { Props as MarketplaceDatePickerProps } from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceDatePickerCss from '!!raw-loader!./MarketplaceDatePicker.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

const marketplaceDatePickerVariationRegistry = [
  {
    label: 'disablePast',
    choices: [
      { label: 'true', value: 'level' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isInputButton',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<MarketplaceDatePickerProps, 'text'> => {
  const disablePastSelected = variationsSelected?.disablePast?.value === 'true';
  const isInputButtonSelected =
    variationsSelected?.isInputButton?.value === 'true';

  return {
    dateSelected: DateTime.now().plus({ weeks: 1 }),
    disablePast: disablePastSelected,
    rangeSize: 0,
    isInputButton: isInputButtonSelected,
    onSelect: () => {},
  };
};

export const MARKETPLACE_DATE_PICKER_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_DATE_PICKER,
    css: MarketplaceDatePickerCss,
    pages: [MarketplacePage.COMMON],
    defaultState: {},
    variations: marketplaceDatePickerVariationRegistry,
  };

export const MARKETPLACE_DATE_PICKER_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  return <MarketplaceDatePicker {...componentProps} />;
});
