import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import ButtonBase from '#Fabrique/ButtonBaseV2';
import { Props as ButtonProps } from '#Fabrique/ButtonV2';
import Badge from '#src/components/css-only/Fabrique/Badge';

import { joinWithSeparator } from '#Fabrique/utils/joinStringWithSpreadOperator';

import type {
  ButtonColor as ButtonColorType,
  ButtonVariant as ButtonVariantType,
  ButtonSize as ButtonSizeType,
} from '#Fabrique/ButtonV2/types';

import {
  ButtonSize,
  ButtonVariant,
  ButtonColor,
} from '#Fabrique/ButtonV2/constants';

import './styles.css';

const useIconButtonClassNames = (
  size: ButtonSizeType,
  color: ButtonColorType,
  variant: ButtonVariantType,
) => {
  const iconButtonSizeClassName = React.useMemo(() => {
    switch (size) {
      case ButtonSize.LG:
        return 'bs-fabrique-icon-button-root-lg';
      case ButtonSize.MD:
        return 'bs-fabrique-icon-button-root-md';
      case ButtonSize.SM:
        return 'bs-fabrique-icon-button-root-sm';
      default:
        return 'bs-fabrique-icon-button-root-md';
    }
  }, [size]);

  const joinedVariantWithColor = joinWithSeparator('-')(variant, color);

  const iconButtonVariantAndColorClassName = React.useMemo(() => {
    switch (joinedVariantWithColor) {
      // Contained
      case 'contained-primary':
        return ['bs-fabrique-icon-button-root-contained--main'];
      case 'contained-secondary':
        return ['bs-fabrique-icon-button-root-contained--secondary'];
      case 'contained-error':
        return ['bs-fabrique-icon-button-root-contained--error'];
      case 'contained-warning':
        return ['bs-fabrique-icon-button-root-contained--warning'];
      case 'contained-grey':
        return ['bs-fabrique-icon-button-root-contained--grey'];
      case 'contained-info':
        return ['bs-fabrique-icon-button-root-contained--info'];
      case 'contained-white':
        return ['bs-fabrique-icon-button-root-contained--white'];
      // Outlined
      case 'outlined-primary':
        return [
          'bs-fabrique-icon-button-root-outlined',
          'bs-fabrique-icon-button-root-outlined--main',
        ];
      case 'outlined-secondary':
        return [
          'bs-fabrique-icon-button-root-outlined',
          'bs-fabrique-icon-button-root-outlined--secondary',
        ];
      case 'outlined-error':
        return [
          'bs-fabrique-icon-button-root-outlined',
          'bs-fabrique-icon-button-root-outlined--error',
        ];
      case 'outlined-warning':
        return [
          'bs-fabrique-icon-button-root-outlined',
          'bs-fabrique-icon-button-root-outlined--warning',
        ];
      case 'outlined-grey':
        return [
          'bs-fabrique-icon-button-root-outlined',
          'bs-fabrique-icon-button-root-outlined--grey',
        ];
      case 'outlined-info':
        return [
          'bs-fabrique-icon-button-root-outlined',
          'bs-fabrique-icon-button-root-outlined--info',
        ];
      case 'outlined-white':
        return [
          'bs-fabrique-icon-button-root-outlined',
          'bs-fabrique-icon-button-root-outlined--white',
        ];
      // Text
      case 'text-primary':
        return ['bs-fabrique-icon-button-root-text--main'];
      case 'text-secondary':
        return ['bs-fabrique-icon-button-root-text--secondary'];
      case 'text-error':
        return ['bs-fabrique-icon-button-root-text--error'];
      case 'text-warning':
        return ['bs-fabrique-icon-button-root-text--warning'];
      case 'text-grey':
        return ['bs-fabrique-icon-button-root-text--grey'];
      case 'text-info':
        return ['bs-fabrique-icon-button-root-text--info'];
      case 'text-white':
        return ['bs-fabrique-icon-button-root-text--white'];
      default:
        return ['bs-fabrique-icon-button-root-contained--main'];
    }
  }, [joinedVariantWithColor]);

  return classNames(
    'bs-fabrique-icon-button-root',
    iconButtonSizeClassName,
    iconButtonVariantAndColorClassName,
  );
};
export const IconButton: React.FC<ButtonProps> = ({
  color = ButtonColor.PRIMARY,
  className,
  isDisabled,
  variant = ButtonVariant.CONTAINED,
  onClick,
  onMouseDown,
  isRippleEnabled,
  type = 'button',
  size = ButtonSize.LG,
  href,
  target,
  badgeValue,
  children,
}) => {
  const iconButtonClassNames = useIconButtonClassNames(size, color, variant);
  return (
    <ButtonBase
      className={classNames(iconButtonClassNames, className)}
      href={href}
      isDisabled={isDisabled}
      isRippleEnabled={isRippleEnabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      target={target}
      type={type}
    >
      <span
        className={classNames({
          'bs-fabrique-icon-button__svg-container--sm': size === ButtonSize.SM,
          'bs-fabrique-icon-button__svg-container--md': size === ButtonSize.MD,
          'bs-fabrique-icon-button__svg-container--lg': size === ButtonSize.LG,
        })}
      >
        {children}
      </span>

      <div
        className={classNames('bs-fabrique-icon-button-root__badge', {
          'bs-fabrique-icon-button-root__badge--hidden': !badgeValue,
        })}
      >
        <Badge color="grey" value={badgeValue} />
      </div>
    </ButtonBase>
  );
};

export const IconButtonStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof IconButton>>()(IconButton);

export default memo(IconButton);
