import React from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { ButtonType } from '../Button';

import './styles.css';

export type Props = {
  isLoading?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disableRipple?: boolean;
  classes?: string;
  type?: ButtonType;
};

const ButtonBase: React.FC<Props> = ({
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
      className={classNames(
        'bs-button_base__container',
        {
          ripple: !disableRipple,
        },
        classes,
      )}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      // eslint-disable-next-line react/button-has-type
      type={type ?? 'button'}
    >
      {children}
    </button>
  );
};

export const ButtonForStorybook = marketplaceCssHoc()(ButtonBase);

export default React.memo(ButtonBase);
