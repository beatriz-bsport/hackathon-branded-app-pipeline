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
  color?: ButtonColorType;
  className?: string;
  isDisabled?: boolean;
  variant?: ButtonVariantType;
  onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  isRippleEnabled?: boolean;
  type?: ButtonHTMLType;
  size?: ButtonSizeType;
  children: React.ReactNode;
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
        return 'bs-fabrique-button-root-lg';
      case ButtonSize.MD:
        return 'bs-fabrique-button-root-md';
      case ButtonSize.SM:
        return 'bs-fabrique-button-root-sm';
      default:
        return 'bs-fabrique-button-root-md';
    }
  }, [size]);

  const joinedVariantWithColor = joinWithSeparator('-')(variant, color);

  const buttonVariantAndColorClassName = React.useMemo(() => {
    if (isDisabled) {
      switch (variant) {
        case 'contained':
          return ['bs-fabrique-button-root-contained--disabled'];
        case 'outlined':
          return ['bs-fabrique-button-root-outlined--disabled'];
        case 'text':
          return ['bs-fabrique-button-root-text--disabled'];
        default:
          return ['bs-fabrique-button-root-contained--disabled'];
      }
    } else {
      switch (joinedVariantWithColor) {
        // Contained
        case 'contained-primary':
          return ['bs-fabrique-button-root-contained--main'];
        case 'contained-secondary':
          return ['bs-fabrique-button-root-contained--secondary'];
        case 'contained-error':
          return ['bs-fabrique-button-root-contained--error'];
        case 'contained-warning':
          return ['bs-fabrique-button-root-contained--warning'];
        case 'contained-grey':
          return ['bs-fabrique-button-root-contained--grey'];
        case 'contained-info':
          return ['bs-fabrique-button-root-contained--info'];
        case 'contained-white':
          return ['bs-fabrique-button-root-contained--white'];
        // Outlined
        case 'outlined-primary':
          return [
            'bs-fabrique-button-root-outlined',
            'bs-fabrique-button-root-outlined--main',
          ];
        case 'outlined-secondary':
          return [
            'bs-fabrique-button-root-outlined',
            'bs-fabrique-button-root-outlined--secondary',
          ];
        case 'outlined-error':
          return [
            'bs-fabrique-button-root-outlined',
            'bs-fabrique-button-root-outlined--error',
          ];
        case 'outlined-warning':
          return [
            'bs-fabrique-button-root-outlined',
            'bs-fabrique-button-root-outlined--warning',
          ];
        case 'outlined-grey':
          return [
            'bs-fabrique-button-root-outlined',
            'bs-fabrique-button-root-outlined--grey',
          ];
        case 'outlined-info':
          return [
            'bs-fabrique-button-root-outlined',
            'bs-fabrique-button-root-outlined--info',
          ];
        case 'outlined-white':
          return [
            'bs-fabrique-button-root-outlined',
            'bs-fabrique-button-root-outlined--white',
          ];
        // Text
        case 'text-primary':
          return ['bs-fabrique-button-root-text--main'];
        case 'text-secondary':
          return ['bs-fabrique-button-root-text--secondary'];
        case 'text-error':
          return ['bs-fabrique-button-root-text--error'];
        case 'text-warning':
          return ['bs-fabrique-button-root-text--warning'];
        case 'text-grey':
          return ['bs-fabrique-button-root-text--grey'];
        case 'text-info':
          return ['bs-fabrique-button-root-text--info'];
        case 'text-white':
          return ['bs-fabrique-button-root-text--white'];
        default:
          return ['bs-fabrique-button-root-contained--main'];
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
  className,
  isDisabled,
  variant = ButtonVariant.CONTAINED,
  onClick,
  isRippleEnabled,
  type = 'button',
  size = ButtonSize.LG,
  children,
}) => {
  const buttonClassNames = useButtonClassNames(
    size,
    color,
    variant,
    isDisabled,
  );
  return (
    <ButtonBase
      className={classNames(buttonClassNames, className)}
      isDisabled={isDisabled}
      isRippleEnabled={isRippleEnabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </ButtonBase>
  );
};

export const ButtonStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Button>>()(Button);

export default memo(Button);
