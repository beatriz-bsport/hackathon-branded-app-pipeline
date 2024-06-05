import React from 'react';

import { useTranslation } from 'react-i18next';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { Star06 } from '#components/untitledui';
import Button, { Props as ButtonProps } from '.';
import { ButtonColor, ButtonVariant, ButtonSize } from './constants';
import {
  ButtonColor as ButtonColorType,
  ButtonVariant as ButtonVariantType,
  ButtonSize as ButtonSizeType,
} from './types';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ButtonCss from './styles.css?raw';

const fabriqueButtonVariationRegistry = [
  {
    label: 'color',
    choices: [
      { label: ButtonColor.PRIMARY, value: ButtonColor.PRIMARY },
      { label: ButtonColor.SECONDARY, value: ButtonColor.SECONDARY },
      { label: ButtonColor.GREY, value: ButtonColor.GREY },
      { label: ButtonColor.WHITE, value: ButtonColor.WHITE },
      { label: ButtonColor.INFO, value: ButtonColor.INFO },
      { label: ButtonColor.WARNING, value: ButtonColor.WARNING },
      { label: ButtonColor.ERROR, value: ButtonColor.ERROR },
    ],
    default: { label: ButtonColor.PRIMARY, value: ButtonColor.PRIMARY },
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
    label: 'displayLeftIcon',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayRightIcon',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'fabriqueVariant',
    choices: [
      { label: ButtonVariant.CONTAINED, value: ButtonVariant.CONTAINED },
      { label: ButtonVariant.OUTLINED, value: ButtonVariant.OUTLINED },
      { label: ButtonVariant.TEXT, value: ButtonVariant.TEXT },
    ],
    default: { label: ButtonVariant.CONTAINED, value: ButtonVariant.CONTAINED },
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
    label: 'size',
    choices: [
      { label: ButtonSize.SM, value: ButtonSize.SM },
      { label: ButtonSize.MD, value: ButtonSize.MD },
      { label: ButtonSize.LG, value: ButtonSize.LG },
    ],
    default: { label: ButtonSize.LG, value: ButtonSize.LG },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<ButtonProps, 'children'> => {
  const colorSelected = variationsSelected?.color?.value as ButtonColorType;
  const isDisabledSelected = variationsSelected?.isDisabled?.value === 'true';
  const isDisplayLeftIcon =
    variationsSelected?.displayLeftIcon?.value === 'true';
  const isDisplayRightIcon =
    variationsSelected?.displayRightIcon?.value === 'true';
  const variantSelected = variationsSelected?.fabriqueVariant
    ?.value as ButtonVariantType;
  const isRippleEnabledSelected =
    variationsSelected?.isRippleEnabled?.value === 'true';
  const sizeSelected = variationsSelected?.size?.value as ButtonSizeType;
  return {
    color: colorSelected,
    isDisabled: isDisabledSelected,
    variant: variantSelected,
    onClick: () => {},
    isRippleEnabled: isRippleEnabledSelected,
    type: 'button',
    size: sizeSelected,
    leftIcon: isDisplayLeftIcon && <Star06 />,
    rightIcon: isDisplayRightIcon && <Star06 />,
  };
};

export const FABRIQUE_BUTTON_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_BUTTON,
  css: ButtonCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueButtonVariationRegistry,
};

export const FABRIQUE_BUTTON_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const { t } = useTranslation(['common']);
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <Button {...componentProps}>{t('common:ok')}</Button>
      <Button {...componentProps}>{t('common:confirm')}</Button>
      <Button {...componentProps}>{t('common:disconnectInfo')}</Button>
    </div>
  );
});
