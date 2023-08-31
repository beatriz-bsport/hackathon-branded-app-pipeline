import React from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  isLoading?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;

  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ButtonBase: React.FC<Props> = ({
  isLoading,
  isDisabled,
  children,
  onClick,
}) => {
  return (
    <button
      className={classNames('bs-button_base__container')}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      // eslint-disable-next-line react/button-has-type
      type="button"
    >
      {children}
    </button>
  );
};

export const ButtonForStorybook = marketplaceCssHoc()(ButtonBase);

export default React.memo(ButtonBase);
