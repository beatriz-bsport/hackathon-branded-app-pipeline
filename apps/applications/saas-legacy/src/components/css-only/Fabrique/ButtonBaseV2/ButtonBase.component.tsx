import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

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
  /** Optional href to set the button as an anchor */
  href?: string;
  /** Anchor target passed when `href` prop is defined */
  target?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement | HTMLButtonElement>;

export const ButtonBase: React.FC<Props> = ({
  children,
  classes,
  className,
  isDisabled,
  onClick,
  type = 'button',
  isRippleEnabled,
  href,
  target,
  ...rest
}) => {
  if (href) {
    return (
      <a
        className={classNames(
          'bs-fabrique-button-base-root',
          {
            'bs-fabrique-button-base-ripple': isRippleEnabled,
          },
          className,
          classes,
        )}
        href={href}
        target={target}
        {...rest}
      >
        {children}
      </a>
    );
  }

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
