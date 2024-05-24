import React, { useCallback, useState } from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import TextField, { Props as TextFieldProps } from '.';
import { TextFieldSize, TextFieldVariant } from './types';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import TextFieldCss from './styles.css?raw';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const FAKE_LABEL = faker.lorem.words(1);
const FAKE_HELPER_TEXT = faker.lorem.words(3);

const authenticationTextfieldVariationRegistry = [
  {
    label: 'fabriqueVariant',
    choices: [
      {
        label: TextFieldVariant.OUTLINED,
        value: TextFieldVariant.OUTLINED,
      },
      {
        label: TextFieldVariant.STANDARD,
        value: TextFieldVariant.STANDARD,
      },
    ],
    default: {
      label: TextFieldVariant.STANDARD,
      value: TextFieldVariant.STANDARD,
    },
  },
  {
    label: 'size',
    choices: [
      {
        label: 'sm',
        value: TextFieldSize.SMALL,
      },
      {
        label: 'md',
        value: TextFieldSize.MEDIUM,
      },
      {
        label: 'lg',
        value: TextFieldSize.LARGE,
      },
    ],
    default: {
      label: 'md',
      value: TextFieldSize.MEDIUM,
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<TextFieldProps, 'onChange' | 'value'> => {
  const variantSelected = variationsSelected?.fabriqueVariant
    ?.value as TextFieldVariant;
  const sizeSelected = variationsSelected?.size?.value as TextFieldSize;
  const name = 'textfield-custom-css-variant';
  const id = 'textfield-custom-css-variant-id';
  const inputId = 'textfield-custom-css-variant-input-id';
  return {
    label: FAKE_LABEL,
    helperText: FAKE_HELPER_TEXT,
    id,
    inputId,
    name,
    variant: variantSelected,
    size: sizeSelected,
  };
};

export const AUTHENTICATION_TEXTFIELD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.AUTHENTICATION_TEXTFIELD,
    css: TextFieldCss,
    pages: [MarketplacePage.AUTHENTICATION],
    defaultState: {},
    variations: authenticationTextfieldVariationRegistry,
  };

export const AUTHENTICATION_TEXTFIELD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const [newValue, setNewValue] = useState('');

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setNewValue(event.target.value),
    [],
  );

  return (
    <TextField {...componentProps} onChange={handleOnChange} value={newValue} />
  );
});
