import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './ProcessingPaymentDialogStyles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import CircularProgress from '#components/css-only/CircularProgress';
import { useMarketplaceFixedDialog } from '#libs/marketplace/hooks';

export type Props = {
  open: boolean;
};

export const ProcessingPaymentDialogPortal: React.FC<Props> = React.memo(
  (props) => {
    const [pageContainerClass, setPageContainerClass] = useState<string>(null);

    useEffect(() => {
      setPageContainerClass('bs-boutique-contract-checkout-page');
      return () => {
        setPageContainerClass(null);
      };
    }, []);

    const portalContainer = useMarketplaceFixedDialog(
      <ProcessingPaymentDialog {...props} />,
      pageContainerClass,
    );

    return portalContainer;
  },
);

export const ProcessingPaymentDialog: React.FC<Props> = (props) => {
  const { open } = props;
  const { t } = useTranslation('subscription');

  return (
    <>
      {open && (
        <div className="bs-subscription-processing-payment-dialog">
          <div className="bs-subscription-processing-payment-dialog__card">
            <div className="bs-subscription-processing-payment-dialog__loader">
              <CircularProgress size="sm" />
            </div>
            <div className="bs-subscription-processing-payment-dialog__card__title">
              {t('newCheckout.processingPaymentModal.title')}
            </div>
            <div className="bs-subscription-processing-payment-dialog__card__text">
              {t('newCheckout.processingPaymentModal.text')}
            </div>
            <div className="bs-subscription-processing-payment-dialog__card__time">
              {t('newCheckout.processingPaymentModal.timeEstimation')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ProcessingPaymentDialogForStoryBook = marketplaceCssHoc()(
  ProcessingPaymentDialog,
);

export default ProcessingPaymentDialog;
