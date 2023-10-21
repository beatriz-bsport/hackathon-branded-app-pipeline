import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import type { ButtonHTMLType } from './types';

import './styles.css';

export type Props = {
  isDisabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  classes?: string;
  type: ButtonHTMLType;
  isRippleEnabled: boolean;
} & (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href: never })
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
);

export const ButtonBase: React.FC<Props> = ({
  children,
  classes,
  className,
  href,
  isDisabled,
  onClick,
  type,
  isRippleEnabled,
}) => {
  if (href) {
    return (
      <a
        className={classNames(
          'bs-button-base-root',
          {
            'bs-button-base-root--disabled': isDisabled,
          },
          className,
          classes,
        )}
        href={href}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classNames(
        'bs-button-base-root',
        {
          'bs-button-base-root--disabled': isDisabled,
          'bs-button-base-ripple': isRippleEnabled,
        },
        className,
        classes,
      )}
      onClick={onClick}
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {children}
    </button>
  );
};

export const ButtonBaseStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ButtonBase>>()(ButtonBase);

export default memo(ButtonBase);
