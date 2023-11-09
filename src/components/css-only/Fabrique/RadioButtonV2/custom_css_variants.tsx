import React from 'react';
import RadioButton, { RadioButtonProps } from '.';
import { RadioButtonSizeEnum } from './constants';
import { RadioButtonSize } from './types';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import RadioButtonCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const fabriqueRadiobuttonVariationRegistry = [
  {
    label: 'isChecked',
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
    label: 'isDisabled',
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
    label: 'isInversed',
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
    label: 'displayCaptionText',
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
    label: 'size',
    choices: [
      {
        label: RadioButtonSizeEnum.SM,
        value: RadioButtonSizeEnum.SM,
      },
      {
        label: RadioButtonSizeEnum.LG,
        value: RadioButtonSizeEnum.LG,
      },
    ],
    default: { label: RadioButtonSizeEnum.SM, value: RadioButtonSizeEnum.SM },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): RadioButtonProps => {
  const displayCaptionText =
    variationsSelected?.displayCaptionText?.value === 'true';
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  const isInversed = variationsSelected?.square?.value === 'true';
  const isChecked = variationsSelected?.isChecked?.value === 'true';
  const size = variationsSelected?.size?.value as RadioButtonSize;
  return {
    captionText: displayCaptionText && 'captionText',
    isDisabled,
    isChecked,
    isInversed,
    label: 'Label',
    size,
    id: 'radio-button-preview-id',
  };
};

export const FABRIQUE_RADIOBUTTON_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_RADIOBUTTON,
    css: RadioButtonCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriqueRadiobuttonVariationRegistry,
  };

export const FABRIQUE_RADIOBUTTON_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  // TODO: add a isChecked state for better user experience
  const componentProps = usePropsFromVariation(variationsSelected);
  return <RadioButton {...componentProps} />;
});
