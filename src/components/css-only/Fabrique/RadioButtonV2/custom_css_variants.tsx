import React from 'react';
import RadioButton, { RadioButtonProps } from '.';
import { RadioButtonSizeEnum } from './constants';
import { RadioButtonSize } from './types';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import RadioButtonCss from './styles.css?raw';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const fabriqueRadiobuttonVariationRegistry = [
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
): Omit<RadioButtonProps, 'isChecked'> => {
  const displayCaptionText =
    variationsSelected?.displayCaptionText?.value === 'true';
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  const isInversed = variationsSelected?.square?.value === 'true';
  const size = variationsSelected?.size?.value as RadioButtonSize;
  return {
    captionText: displayCaptionText && 'captionText',
    isDisabled,
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
  const [checked, setChecked] = React.useState(false);
  const handleOnClick = () => {
    setChecked((prevState) => !prevState);
  };
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <RadioButton
      isChecked={checked}
      onClick={handleOnClick}
      {...componentProps}
    />
  );
});
