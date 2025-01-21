import React from 'react';

import clsx from 'clsx';

import CircularProgress from '#src/components/css-only/CircularProgress';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { ButtonColor, ButtonSize, ButtonType, ButtonVariant } from '.';

import ButtonBase from '../ButtonBase/ButtonBase.component';

import './styles.css';

export type Props = {
  id?: string;
  type?: ButtonType;
  isLoading?: boolean;
  classes?: { root?: string; text?: string };
  isDisabled?: boolean;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disableRipple?: boolean;
};

const Button: React.FC<Props> = ({
  id,
  type,
  isLoading,
  classes,
  isDisabled,
  children,
  variant,
  size,
  color,
  onClick,
  disableRipple,
}) => {
  return (
    <ButtonBase
      classes={clsx(
        'bs-button__container',
        {
          'bs-button-icon__container': variant === ButtonVariant.ICON,
          'bs-button-outlined__container': variant === ButtonVariant.OUTLINED,
          'bs-button-primary__container':
            color === ButtonColor.PRIMARY && variant !== ButtonVariant.TEXT,
          'bs-button-secondary__container':
            color === ButtonColor.SECONDARY && variant !== ButtonVariant.TEXT,
          'bs-button-small__container': size === ButtonSize.SMALL,
          'bs-button-large__container': size === ButtonSize.LARGE,
        },
        classes?.root,
      )}
      disableRipple={disableRipple || isDisabled}
      id={id}
      isDisabled={isDisabled || isLoading}
      isLoading={isLoading}
      onClick={onClick}
      // https://github.com/jsx-eslint/eslint-plugin-react/issues/1555

      type={type}
    >
      <span
        className={clsx(
          'bs-button__text',
          {
            'bs-button-primary__text':
              color === ButtonColor.PRIMARY && variant !== ButtonVariant.TEXT,
            'bs-button-primary__text_primary_color':
              color === ButtonColor.PRIMARY && variant === ButtonVariant.TEXT,
            'bs-button-secondary__text':
              color === ButtonColor.SECONDARY && variant !== ButtonVariant.TEXT,
            'bs-button-primary__text_secondary_color':
              color === ButtonColor.SECONDARY && variant === ButtonVariant.TEXT,
            'bs-button-small__text': size === ButtonSize.SMALL,
            'bs-button-large__text': size === ButtonSize.LARGE,
          },
          classes?.text,
        )}
      >
        {isLoading && variant === ButtonVariant.ICON ? null : children}
        {isLoading && <CircularProgress size="xs" />}
      </span>
    </ButtonBase>
  );
};

export const ButtonForStorybook = marketplaceCssHoc()(Button);

export default React.memo(Button);
