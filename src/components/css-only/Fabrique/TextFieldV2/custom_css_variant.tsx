import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import { Star06 } from '#components/untitledui';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import TextField, { type Props as TextFieldProps } from '.';
import type { TextFieldSize, TextFieldType } from './types';
import { TextFieldSizeEnum, TextFieldTypeEnum } from './constants';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import TextFieldCss from './styles.css?raw';

const HELPER_TEXT = faker.lorem.sentences(1);

const ERROR_MESSAGE = faker.lorem.sentences(1);

const starIcon = <Star06 stroke="currentColor" />;

const fabriqueTextFieldVariationRegistry = [
  {
    label: 'size',
    choices: [
      { label: TextFieldSizeEnum.SM, value: TextFieldSizeEnum.SM },
      { label: TextFieldSizeEnum.LG, value: TextFieldSizeEnum.LG },
    ],
    default: { label: TextFieldSizeEnum.LG, value: TextFieldSizeEnum.LG },
  },
  {
    label: 'displayLeftIcon',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'displayRightIcon',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayHelperText',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isError',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isRequired',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayLabel',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'displayPlaceholder',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isRippleEnabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'textFieldType',
    choices: [
      { label: TextFieldTypeEnum.TEXT, value: TextFieldTypeEnum.TEXT },
      { label: TextFieldTypeEnum.EMAIL, value: TextFieldTypeEnum.EMAIL },
      { label: TextFieldTypeEnum.TEL, value: TextFieldTypeEnum.TEL },
      { label: TextFieldTypeEnum.PASSWORD, value: TextFieldTypeEnum.PASSWORD },
    ],
    default: { label: TextFieldTypeEnum.TEXT, value: TextFieldTypeEnum.TEXT },
  },
];

export const FABRIQUE_TEXTFIELD_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_TEXTFIELD,
  css: TextFieldCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueTextFieldVariationRegistry,
};

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<TextFieldProps, 'inputId' | 'value' | 'onChange'> => {
  const displayLeftIcon = variationsSelected?.displayLeftIcon?.value === 'true';
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  const size = variationsSelected?.size?.value as TextFieldSize;
  const displayRightIcon =
    variationsSelected?.displayRightIcon?.value === 'true';
  const displayHelperText =
    variationsSelected?.displayHelperText?.value === 'true';
  const displayLabel = variationsSelected?.displayLabel?.value === 'true';
  const isRequired = variationsSelected?.isRequired?.value === 'true';
  const displayPlaceholder =
    variationsSelected?.displayPlaceholder?.value === 'true';
  const isError = variationsSelected?.isError?.value === 'true';
  const isRippleEnabled = variationsSelected?.isRippleEnabled?.value === 'true';
  const type = variationsSelected?.textFieldType?.value as TextFieldType;

  return {
    size,
    isDisabled,
    leftIcon: displayLeftIcon && starIcon,
    rightIcon: displayRightIcon && starIcon,
    helperText: displayHelperText && HELPER_TEXT,
    label: displayLabel && 'Label',
    isRequired,
    placeholder: displayPlaceholder && 'Placeholder',
    isError,
    isRippleEnabled,
    type,
    errorMessage: isError && ERROR_MESSAGE,
  };
};

export const FABRIQUE_TEXTFIELD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  const [value, setValue] = React.useState('');
  return (
    <TextField
      inputId="fabrique-textfield-inputId-preview"
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue('')}
      value={value}
      {...componentProps}
    />
  );
});
