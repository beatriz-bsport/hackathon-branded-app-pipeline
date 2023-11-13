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

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import IconButtonCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const CustomIcon: React.FC = () => (
  <svg
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2374_2365)">
      <path
        clipRule="evenodd"
        d="M3.74998 0.833496C4.21022 0.833496 4.58331 1.20659 4.58331 1.66683V2.91683H5.83331C6.29355 2.91683 6.66665 3.28993 6.66665 3.75016C6.66665 4.2104 6.29355 4.5835 5.83331 4.5835H4.58331V5.8335C4.58331 6.29373 4.21022 6.66683 3.74998 6.66683C3.28974 6.66683 2.91665 6.29373 2.91665 5.8335V4.5835H1.66665C1.20641 4.5835 0.833313 4.2104 0.833313 3.75016C0.833313 3.28993 1.20641 2.91683 1.66665 2.91683H2.91665V1.66683C2.91665 1.20659 3.28974 0.833496 3.74998 0.833496ZM10.8333 1.66683C11.1781 1.66683 11.4873 1.87919 11.6111 2.20101L13.0562 5.9584C13.3066 6.60927 13.3852 6.79683 13.4928 6.94816C13.6008 7.09999 13.7335 7.23266 13.8853 7.34062C14.0366 7.44823 14.2242 7.52689 14.8751 7.77723L18.6325 9.22237C18.9543 9.34615 19.1666 9.65535 19.1666 10.0002C19.1666 10.345 18.9543 10.6542 18.6325 10.778L14.8751 12.2231C14.2242 12.4734 14.0366 12.5521 13.8853 12.6597C13.7335 12.7677 13.6008 12.9003 13.4929 13.0522C13.3852 13.2035 13.3066 13.3911 13.0562 14.0419L11.6111 17.7993C11.4873 18.1211 11.1781 18.3335 10.8333 18.3335C10.4885 18.3335 10.1793 18.1211 10.0555 17.7993L8.61038 14.0419C8.36004 13.3911 8.28138 13.2035 8.17377 13.0522C8.06581 12.9003 7.93314 12.7677 7.7813 12.6597C7.62998 12.5521 7.44242 12.4734 6.79155 12.2231L3.03416 10.778C2.71234 10.6542 2.49998 10.345 2.49998 10.0002C2.49998 9.65535 2.71234 9.34615 3.03416 9.22237L6.79155 7.77723C7.44242 7.52689 7.62998 7.44823 7.7813 7.34062C7.93314 7.23266 8.06581 7.1 8.17377 6.94815C8.28138 6.79683 8.36004 6.60927 8.61038 5.9584L10.0555 2.20101C10.1793 1.87919 10.4885 1.66683 10.8333 1.66683ZM10.8333 4.82156L10.166 6.5567C10.1549 6.58542 10.144 6.61378 10.1333 6.64177C9.93028 7.17032 9.77695 7.56958 9.53207 7.91398C9.31613 8.21766 9.05081 8.48298 8.74713 8.69892C8.40273 8.9438 8.00347 9.09713 7.47493 9.30011C7.44693 9.31086 7.41858 9.32175 7.38985 9.3328L5.65471 10.0002L7.38985 10.6675C7.41858 10.6786 7.44693 10.6895 7.47493 10.7002C8.00347 10.9032 8.40273 11.0565 8.74713 11.3014C9.05081 11.5173 9.31613 11.7827 9.53207 12.0863C9.77695 12.4307 9.93028 12.83 10.1333 13.3586C10.144 13.3865 10.1549 13.4149 10.166 13.4436L10.8333 15.1788L11.5007 13.4436C11.5117 13.4149 11.5226 13.3865 11.5334 13.3586C11.7363 12.83 11.8897 12.4307 12.1346 12.0863C12.3505 11.7827 12.6158 11.5173 12.9195 11.3014C13.2639 11.0565 13.6632 10.9032 14.1917 10.7002C14.2197 10.6895 14.2481 10.6786 14.2768 10.6675L16.0119 10.0002L14.2768 9.3328C14.248 9.32175 14.2197 9.31086 14.1917 9.30011C13.6632 9.09713 13.2639 8.9438 12.9195 8.69892C12.6158 8.48298 12.3505 8.21766 12.1346 7.91398C11.8897 7.56958 11.7363 7.17032 11.5334 6.64178C11.5226 6.61378 11.5117 6.58543 11.5007 6.5567L10.8333 4.82156ZM3.74998 13.3335C4.21022 13.3335 4.58331 13.7066 4.58331 14.1668V15.4168H5.83331C6.29355 15.4168 6.66665 15.7899 6.66665 16.2502C6.66665 16.7104 6.29355 17.0835 5.83331 17.0835H4.58331V18.3335C4.58331 18.7937 4.21022 19.1668 3.74998 19.1668C3.28974 19.1668 2.91665 18.7937 2.91665 18.3335V17.0835H1.66665C1.20641 17.0835 0.833313 16.7104 0.833313 16.2502C0.833313 15.7899 1.20641 15.4168 1.66665 15.4168H2.91665V14.1668C2.91665 13.7066 3.28974 13.3335 3.74998 13.3335Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_2374_2365">
        <rect fill="currentColor" height="20" width="20" />
      </clipPath>
    </defs>
  </svg>
);

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
      <CustomIcon />
    </IconButton>
  );
});
