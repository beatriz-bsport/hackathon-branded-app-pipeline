import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import './SubscriptionErrorDialogStyles.css';

export type Props = {
  open: boolean;
  registerBackgroundServerErrorOccured: boolean;
  userRegistrationserverErrorOccured: boolean;
  handleAction: () => void;
};

export const SubscriptionErrorDialog: React.FC<Props> = ({
  open,
  registerBackgroundServerErrorOccured,
  userRegistrationserverErrorOccured,
  handleAction,
}) => {
  const { t } = useTranslation('subscription');

  return (
    <>
      {open && (
        <Dialog
          disablePortal
          open
          className="bs-subscription-error-dialog"
          maxWidth="sm"
        >
          <div className="bs-subscription-error-dialog__content">
            <div className="bs-subscription-error-dialog__content__title">
              {t('newCheckout.error.title')}
            </div>
            <div className="bs-subscription-error-dialog__content__text">
              {registerBackgroundServerErrorOccured &&
                t('newCheckout.error.text.registerBackground')}
              {userRegistrationserverErrorOccured &&
                t('newCheckout.error.text.userRegistration')}
            </div>
            <div className="bs-subscription-error-dialog__content__action_container">
              <button
                className="bs-subscription-error-dialog__content__action_container__button"
                onClick={handleAction}
                type="button"
              >
                {registerBackgroundServerErrorOccured &&
                  t('newCheckout.error.button.registerBackground')}
                {userRegistrationserverErrorOccured &&
                  t('newCheckout.error.button.userRegistration')}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export const SubsciptionErrorDialogForStoryBook = marketplaceCssHoc()(
  SubscriptionErrorDialog,
);

export default SubscriptionErrorDialog;
