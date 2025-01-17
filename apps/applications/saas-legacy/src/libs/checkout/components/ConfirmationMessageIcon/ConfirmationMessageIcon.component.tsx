import React, { useMemo } from 'react';

import classNames from 'classnames';
import ClearIcon from '@material-ui/icons/Clear';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import WarningIcon from '@material-ui/icons/Warning';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  isError: boolean;
  isWarning?: boolean;
};

const ConfirmationMessageIcon: React.FC<Props> = ({ isError, isWarning }) => {
  const icon = useMemo(() => {
    if (isError) return <ClearIcon style={{ fontSize: 40 }} />;
    if (isWarning) return <WarningIcon style={{ fontSize: 40 }} />;
    return <DoneAllIcon style={{ fontSize: 40 }} />;
  }, [isError, isWarning]);

  return (
    <div className="bs-confirmation-checkout-message__container">
      <div
        className={classNames(
          'bs-confirmation-checkout-message__icon__container',
          {
            'bs-confirmation-checkout-message__icon__error': isError,
            'bs-confirmation-checkout-message__icon__warning': isWarning,
            'bs-confirmation-checkout-message__icon__default':
              !isError && !isWarning,
          },
        )}
      >
        {icon}
      </div>
    </div>
  );
};

export const ConfirmationMessageIconForStorybook = marketplaceCssHoc()(
  ConfirmationMessageIcon,
);

export default React.memo(ConfirmationMessageIcon);
