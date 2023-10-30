import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import TextField, { type Props as TextFieldProps } from '.';
import type { TextFieldSize, TextFieldType } from './types';
import { TextFieldSizeEnum, TextFieldTypeEnum } from './constants';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import TextFieldCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { CompanyTheme } from '#libs/theme/types';

const HELPER_TEXT = faker.lorem.sentences(1);

const starIcon = (
  <svg viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M3.66683 0.666504C4.03502 0.666504 4.3335 0.964981 4.3335 1.33317V2.33317H5.3335C5.70169 2.33317 6.00016 2.63165 6.00016 2.99984C6.00016 3.36803 5.70169 3.6665 5.3335 3.6665H4.3335V4.6665C4.3335 5.03469 4.03502 5.33317 3.66683 5.33317C3.29864 5.33317 3.00016 5.03469 3.00016 4.6665V3.6665H2.00016C1.63197 3.6665 1.3335 3.36803 1.3335 2.99984C1.3335 2.63165 1.63197 2.33317 2.00016 2.33317H3.00016V1.33317C3.00016 0.964981 3.29864 0.666504 3.66683 0.666504ZM9.3335 1.33317C9.60934 1.33317 9.8567 1.50306 9.95573 1.76052L11.1118 4.76643C11.3121 5.28712 11.375 5.43717 11.4611 5.55823C11.5475 5.6797 11.6536 5.78583 11.7751 5.87221C11.8962 5.95829 12.0462 6.02122 12.5669 6.22149L15.5728 7.37761C15.8303 7.47663 16.0002 7.72399 16.0002 7.99984C16.0002 8.27568 15.8303 8.52304 15.5728 8.62207L12.5669 9.77819C12.0462 9.97845 11.8962 10.0414 11.7751 10.1275C11.6536 10.2138 11.5475 10.32 11.4611 10.4414C11.375 10.5625 11.3121 10.7126 11.1118 11.2332L9.95573 14.2392C9.8567 14.4966 9.60934 14.6665 9.3335 14.6665C9.05765 14.6665 8.81029 14.4966 8.71127 14.2392L7.55515 11.2332C7.35488 10.7126 7.29195 10.5625 7.20586 10.4414C7.11949 10.32 7.01336 10.2138 6.89189 10.1275C6.77083 10.0414 6.62078 9.97845 6.10008 9.77819L3.09418 8.62207C2.83672 8.52304 2.66683 8.27568 2.66683 7.99984C2.66683 7.72399 2.83672 7.47663 3.09418 7.37761L6.10008 6.22149C6.62078 6.02122 6.77083 5.95829 6.89189 5.87221C7.01336 5.78583 7.11949 5.6797 7.20586 5.55823C7.29195 5.43717 7.35488 5.28712 7.55515 4.76643L8.71126 1.76052C8.81029 1.50306 9.05765 1.33317 9.3335 1.33317ZM9.3335 3.85696L8.79961 5.24506C8.79077 5.26805 8.78206 5.29073 8.77346 5.31312C8.61107 5.73596 8.48841 6.05537 8.2925 6.33089C8.11975 6.57383 7.90749 6.78609 7.66455 6.95884C7.38903 7.15475 7.06962 7.27741 6.64679 7.4398C6.62439 7.4484 6.60171 7.45711 6.57872 7.46595L5.19061 7.99984L6.57872 8.53373C6.60171 8.54257 6.62439 8.55128 6.64679 8.55988C7.06962 8.72226 7.38903 8.84492 7.66455 9.04083C7.90749 9.21358 8.11975 9.42584 8.2925 9.66878C8.48841 9.9443 8.61107 10.2637 8.77346 10.6866C8.78206 10.7089 8.79077 10.7316 8.79961 10.7546L9.3335 12.1427L9.86738 10.7546C9.87622 10.7316 9.88493 10.7089 9.89353 10.6866C10.0559 10.2637 10.1786 9.9443 10.3745 9.66878C10.5472 9.42584 10.7595 9.21358 11.0024 9.04083C11.278 8.84492 11.5974 8.72226 12.0202 8.55988C12.0426 8.55128 12.0653 8.54256 12.0883 8.53372L13.4764 7.99984L12.0883 7.46595C12.0653 7.45711 12.0426 7.4484 12.0202 7.4398C11.5974 7.27741 11.278 7.15475 11.0024 6.95884C10.7595 6.78609 10.5472 6.57383 10.3745 6.33089C10.1786 6.05537 10.0559 5.73597 9.89354 5.31313C9.88494 5.29073 9.87622 5.26805 9.86738 5.24506L9.3335 3.85696ZM3.66683 10.6665C4.03502 10.6665 4.3335 10.965 4.3335 11.3332V12.3332H5.3335C5.70169 12.3332 6.00016 12.6316 6.00016 12.9998C6.00016 13.368 5.70169 13.6665 5.3335 13.6665H4.3335V14.6665C4.3335 15.0347 4.03502 15.3332 3.66683 15.3332C3.29864 15.3332 3.00016 15.0347 3.00016 14.6665V13.6665H2.00016C1.63197 13.6665 1.3335 13.368 1.3335 12.9998C1.3335 12.6316 1.63197 12.3332 2.00016 12.3332H3.00016V11.3332C3.00016 10.965 3.29864 10.6665 3.66683 10.6665Z"
    />
  </svg>
);

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
