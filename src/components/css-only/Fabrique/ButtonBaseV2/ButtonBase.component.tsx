import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import type { ButtonHTMLType } from './types';

import './styles.css';

export type Props = {
  isDisabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  classes?: string;
  type?: ButtonHTMLType;
  isRippleEnabled?: boolean;
} & React.AnchorHTMLAttributes<HTMLButtonElement>;

export const ButtonBase: React.FC<Props> = ({
  children,
  classes,
  className,
  isDisabled,
  onClick,
  type = 'button',
  isRippleEnabled,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        'bs-fabrique-button-base-root',
        {
          'bs-fabrique-button-base-ripple': isRippleEnabled,
        },
        className,
        classes,
      )}
      disabled={isDisabled}
      onClick={onClick}
      // eslint-disable-next-line react/button-has-type
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
};

export const ButtonBaseStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ButtonBase>>()(ButtonBase);

export default memo(ButtonBase);
