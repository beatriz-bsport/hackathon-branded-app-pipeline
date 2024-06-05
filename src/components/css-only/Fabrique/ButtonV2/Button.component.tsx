import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import { joinWithSeparator } from '#Fabrique/utils/joinStringWithSpreadOperator';
import ButtonBase from '../ButtonBaseV2';

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
  /** Optional classes passed to the icon container elements */
  classes?: {
    leftIcon?: string;
    rightIcon?: string;
  };
  isDisabled?: boolean;
  variant?: ButtonVariantType;
  /** Optional click handler action to fire once button has been clicked */
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  isRippleEnabled?: boolean;
  type?: ButtonHTMLType;
  size?: ButtonSizeType;
  /** Optional slot for an icon displayed left to the label */
  leftIcon?: React.ReactNode;
  /** Optional slot for an icon displayed right to the label */
  rightIcon?: React.ReactNode;
  /** Optional href to set the button as an anchor */
  href?: string;
  /** Anchor target passed when `href` prop is defined */
  target?: string;
  children: React.ReactNode;
};

const useButtonClassNames = (
  size: ButtonSizeType,
  color: ButtonColorType,
  variant: ButtonVariantType,
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
  }, [joinedVariantWithColor]);

  return classNames(
    'bs-button-root',
    buttonSizeClassName,
    buttonVariantAndColorClassName,
  );
};
export const Button: React.FC<Props> = ({
  color = ButtonColor.PRIMARY,
  className,
  classes,
  isDisabled,
  variant = ButtonVariant.CONTAINED,
  onMouseDown,
  onClick,
  isRippleEnabled,
  type = 'button',
  size = ButtonSize.LG,
  leftIcon,
  rightIcon,
  href,
  target,
  children,
}) => {
  const buttonClassNames = useButtonClassNames(size, color, variant);
  return (
    <ButtonBase
      className={classNames(buttonClassNames, className)}
      href={href}
      isDisabled={isDisabled}
      isRippleEnabled={isRippleEnabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      target={target}
      type={type}
    >
      <div
        className={classNames(
          'bs-fabrique-button-root__left-icon',
          { 'bs-fabrique-button-root__left-icon--hidden': !leftIcon },
          classes?.leftIcon,
        )}
      >
        {leftIcon}
      </div>
      {children}
      <div
        className={classNames(
          'bs-fabrique-button-root__right-icon',
          { 'bs-fabrique-button-root__right-icon--hidden': !rightIcon },
          classes?.rightIcon,
        )}
      >
        {rightIcon}
      </div>
    </ButtonBase>
  );
};

export const ButtonStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Button>>()(Button);

export default memo(Button);
