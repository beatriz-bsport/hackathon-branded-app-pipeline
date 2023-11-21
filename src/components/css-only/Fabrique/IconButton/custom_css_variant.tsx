import React from 'react';

import IconButton, { Props as IconButtonProps } from '.';
import {
  ButtonColor,
  ButtonVariant,
  ButtonSize,
} from '#Fabrique/ButtonV2/constants';
import {
  ButtonColor as ButtonColorType,
  ButtonVariant as ButtonVariantType,
  ButtonSize as ButtonSizeType,
} from '#Fabrique/ButtonV2/types';
import { Star06 } from '#components/untitledui';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import IconButtonCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const fabriqueIconButtonVariationRegistry = [
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
): Omit<IconButtonProps, 'children'> => {
  const colorSelected = variationsSelected?.color?.value as ButtonColorType;
  const isDisabledSelected = variationsSelected?.isDisabled?.value === 'true';
  const variantSelected = variationsSelected?.fabriqueVariant
    ?.value as ButtonVariantType;
  const isRippleEnabledSelected =
    variationsSelected?.isRippleEnabled?.value === 'true';
  const sizeSelected = variationsSelected?.size?.value as ButtonSizeType;
  return {
    color: colorSelected,
    className: undefined,
    isDisabled: isDisabledSelected,
    variant: variantSelected,
    onClick: () => {},
    isRippleEnabled: isRippleEnabledSelected,
    type: 'button',
    size: sizeSelected,
  };
};

export const FABRIQUE_ICON_BUTTON_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_ICON_BUTTON,
    css: IconButtonCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriqueIconButtonVariationRegistry,
  };

export const FABRIQUE_ICON_BUTTON_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return (
    <IconButton {...componentProps}>
      <Star06 stroke="currentColor" />
    </IconButton>
  );
});
