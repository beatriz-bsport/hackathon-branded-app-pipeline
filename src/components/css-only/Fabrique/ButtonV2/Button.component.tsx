import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import ButtonBase from '../ButtonBaseV2';

import { joinWithSeparator } from '#Fabrique/utils/joinStringWithSpreadOperator';

import type { ButtonHTMLType } from '../ButtonBaseV2/types';
import type {
  ButtonColor as ButtonColorType,
  ButtonVariant as ButtonVariantType,
  ButtonSize as ButtonSizeType,
} from './types';

import { ButtonSize, ButtonVariant, ButtonColor } from './constants';

import './styles.css';

type Props = {
  color: ButtonColorType;
  isDisabled?: boolean;
  variant: ButtonVariantType;
  onClick: () => void;
  isRippleEnabled?: boolean;
  type?: ButtonHTMLType;
  link?: string;
  size: ButtonSizeType;
};

const useButtonClassNames = (
  size: ButtonSizeType,
  color: ButtonColorType,
  variant: ButtonVariantType,
  isDisabled: boolean,
) => {
  const buttonSizeClassName = React.useMemo(() => {
    switch (size) {
      case ButtonSize.LG:
        return 'bs-button-root-lg';
      case ButtonSize.MD:
        return 'bs-button-root-md';
      case ButtonSize.SM:
        return 'bs-button-root-sm';
      default:
        return 'bs-button-root-md';
    }
  }, [size]);

  const joinedVariantWithColor = joinWithSeparator('-')(variant, color);

  const buttonVariantAndColorClassName = React.useMemo(() => {
    if (isDisabled) {
      switch (variant) {
        case 'contained':
          return ['bs-button-root-contained--disabled'];
        case 'outlined':
          return ['bs-button-root-outlined--disabled'];
        case 'text':
          return ['bs-button-root-text--disabled'];
        default:
          return ['bs-button-root-contained--disabled'];
      }
    } else {
      switch (joinedVariantWithColor) {
        // Contained
        case 'contained-primary':
          return ['bs-button-root-contained--main'];
        case 'contained-secondary':
          return ['bs-button-root-contained--secondary'];
        case 'contained-error':
          return ['bs-button-root-contained--error'];
        case 'contained-warning':
          return ['bs-button-root-contained--warning'];
        case 'contained-grey':
          return ['bs-button-root-contained--grey'];
        case 'contained-info':
          return ['bs-button-root-contained--info'];
        case 'contained-white':
          return ['bs-button-root-contained--white'];
        // Outlined
        case 'outlined-primary':
          return ['bs-button-root-outlined', 'bs-button-root-outlined--main'];
        case 'outlined-secondary':
          return [
            'bs-button-root-outlined',
            'bs-button-root-outlined--secondary',
          ];
        case 'outlined-error':
          return ['bs-button-root-outlined', 'bs-button-root-outlined--error'];
        case 'outlined-warning':
          return [
            'bs-button-root-outlined',
            'bs-button-root-outlined--warning',
          ];
        case 'outlined-grey':
          return ['bs-button-root-outlined', 'bs-button-root-outlined--grey'];
        case 'outlined-info':
          return ['bs-button-root-outlined', 'bs-button-root-outlined--info'];
        case 'outlined-white':
          return ['bs-button-root-outlined', 'bs-button-root-outlined--white'];
        // Text
        case 'text-primary':
          return ['bs-button-root-text--main'];
        case 'text-secondary':
          return ['bs-button-root-text--secondary'];
        case 'text-error':
          return ['bs-button-root-text--error'];
        case 'text-warning':
          return ['bs-button-root-text--warning'];
        case 'text-grey':
          return ['bs-button-root-text--grey'];
        case 'text-info':
          return ['bs-button-root-text--info'];
        case 'text-white':
          return ['bs-button-root-text--white'];
        default:
          return ['bs-button-root-contained--main'];
      }
    }
  }, [joinedVariantWithColor, isDisabled, variant]);

  return classNames(
    'bs-button-root',
    buttonSizeClassName,
    buttonVariantAndColorClassName,
  );
};
export const Button: React.FC<Props> = ({
  color = ButtonColor.PRIMARY,
  isDisabled,
  variant = ButtonVariant.CONTAINED,
  onClick,
  isRippleEnabled,
  type = 'button',
  link = '',
  size = ButtonSize.LG,
  children,
}) => {
  const ButtonBaseAs = link ? { as: 'link', href: link } : { as: 'button' };

  const buttonClassNames = useButtonClassNames(
    size,
    color,
    variant,
    isDisabled,
  );
  return (
    <ButtonBase
      isDisabled={isDisabled}
      isRippleEnabled={isRippleEnabled}
      onClick={onClick}
      type={type}
      {...ButtonBaseAs}
      className={buttonClassNames}
    >
      {children}
    </ButtonBase>
  );
};

export const ButtonStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Button>>()(Button);

export default memo(Button);
