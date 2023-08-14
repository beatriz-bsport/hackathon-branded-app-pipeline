import React from 'react';

import classNames from 'classnames';

import CircularProgress from '#csscomponents/CircularProgress';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { ButtonColor, ButtonSize, ButtonType, ButtonVariant } from '.';

import './styles.css';

export type Props = {
  type?: ButtonType;
  isLoading?: boolean;
  classes?: { root?: string; text?: string };
  isDisabled?: boolean;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<Props> = ({
  type,
  isLoading,
  classes,
  isDisabled,
  children,
  variant,
  size,
  color,
  onClick,
}) => {
  return (
    <button
      className={classNames(
        'bs-button__container',
        {
          'bs-button-icon__container': variant === ButtonVariant.ICON,
          'bs-button-outlined__container': variant === ButtonVariant.OUTLINED,
          'bs-button-primary__container': color === ButtonColor.PRIMARY,
          'bs-button-secondary__container': color === ButtonColor.SECONDARY,
          'bs-button-small__container': size === ButtonSize.SMALL,
          'bs-button-large__container': size === ButtonSize.LARGE,
        },
        classes?.root,
      )}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      // https://github.com/jsx-eslint/eslint-plugin-react/issues/1555
      // eslint-disable-next-line react/button-has-type
      type={type || ButtonType.BUTTON}
    >
      <span
        className={classNames(
          'bs-button__text',
          {
            'bs-button-primary__text': color === ButtonColor.PRIMARY,
            'bs-button-secondary__text': color === ButtonColor.SECONDARY,
            'bs-button-small__text': size === ButtonSize.SMALL,
            'bs-button-large__text': size === ButtonSize.LARGE,
          },
          classes?.text,
        )}
      >
        {isLoading && variant === ButtonVariant.ICON ? null : children}
        {isLoading && <CircularProgress size="xs" />}
      </span>
    </button>
  );
};

export const ButtonForStorybook = marketplaceCssHoc()(Button);

export default React.memo(Button);
