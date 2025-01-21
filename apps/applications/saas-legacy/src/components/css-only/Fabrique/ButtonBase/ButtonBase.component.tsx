import React from 'react';

import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import { ButtonType } from '../Button';

import './styles.css';

export type Props = {
  id?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disableRipple?: boolean;
  classes?: string;
  type?: ButtonType;
};

const ButtonBase: React.FC<Props> = ({
  id,
  isLoading,
  isDisabled,
  children,
  disableRipple,
  onClick,
  classes,
  type,
}) => {
  return (
    <button
      className={clsx(
        'bs-button_base__container',
        {
          ripple: !disableRipple,
        },
        classes,
      )}
      disabled={isDisabled || isLoading}
      id={id}
      onClick={onClick}
      type={type ?? 'button'}
    >
      {children}
    </button>
  );
};

export const ButtonForStorybook = marketplaceCssHoc()(ButtonBase);

export default React.memo(ButtonBase);
