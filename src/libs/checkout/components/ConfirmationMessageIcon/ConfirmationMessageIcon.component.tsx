import React from 'react';

import classNames from 'classnames';
import ClearIcon from '@material-ui/icons/Clear';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  isError: boolean;
};

const ConfirmationMessageIcon: React.FC<Props> = ({ isError }) => {
  return (
    <div className="bs-confirmation-checkout-message__container">
      <div
        className={classNames(
          'bs-confirmation-checkout-message__icon__container',
          {
            'bs-confirmation-checkout-message__icon__error': isError,
            'bs-confirmation-checkout-message__icon__default': !isError,
          },
        )}
      >
        {isError ? (
          <ClearIcon style={{ fontSize: 40 }} />
        ) : (
          <DoneAllIcon style={{ fontSize: 40 }} />
        )}
      </div>
    </div>
  );
};

export const ConfirmationMessageIconForStorybook = marketplaceCssHoc()(
  ConfirmationMessageIcon,
);

export default React.memo(ConfirmationMessageIcon);
