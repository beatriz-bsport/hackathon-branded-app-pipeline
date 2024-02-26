import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AxiosResponse } from 'axios';

import Alert from '#Fabrique/Alert';

import BigIcon from '#Fabrique/BigIcon';
import Typography from '#Fabrique/Typography';

import MarketplaceSubscriptionPayment from '#libs/checkout/components/new-checkout-flow/SubscriptionPayment/SubscriptionPayment.component';
import { getMarketplaceEnabledPaymentMethods } from '#libs/payment/utils';
import type { PaymentMethod } from '#libs/payment/types';
import type { OptionCallback } from '../../../../../../../state/types';

type Props = {
  detachPaymentMethod: (id: string, options?: OptionCallback) => void;
  enabledPaymentGroupMethodIdentifierIds: number[];
  memberMail: string;
  memberName: string;
  paymentMethodList: PaymentMethod[];
  paymentMethodLoading: boolean;
  paymentMethodUsed: PaymentMethod;
  refreshSavedPaymentMethodList: () => void;
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{ client_secret: string }>
  >;
  selectedPaymentMethodId: string | null;
  setSelectedSavedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  switchSucceeded: boolean;
};

const ConsumerSubscriptionPaymentContent: React.FC<Props> = ({
  detachPaymentMethod,
  enabledPaymentGroupMethodIdentifierIds,
  memberMail,
  memberName,
  paymentMethodList,
  paymentMethodLoading,
  paymentMethodUsed,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  selectedPaymentMethodId,
  setSelectedSavedPaymentMethod,
  switchSucceeded,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (switchSucceeded) {
    return (
      <div className="bs-consumer__subscription__payment__confirmation-dialog__content">
        <BigIcon variant="success" />
        <div className="bs-consumer__subscription__payment__confirmation-dialog__content__text">
          <Typography align="center" variant="title-sm">
            {t('reworked.mySubscriptions.paymentMethodUpdatedTitle')}
          </Typography>
          <Typography align="center" variant="body-md">
            {t('reworked.mySubscriptions.paymentMethodUpdatedContent')}
          </Typography>
        </div>
      </div>
    );
  }
  return (
    <>
      <Alert
        className="bs-consumer__subscription__payment-dialog__alert"
        color="warning"
      >
        {t('reworked.mySubscriptions.paymentModalAlert')}
      </Alert>
      <MarketplaceSubscriptionPayment
        onlinePaymentEnabled
        withoutPaymentMethodPadding
        withPaymentMethodTitle
        detachPaymentMethod={detachPaymentMethod}
        enabledPaymentGroupMethodIdentifierIds={
          enabledPaymentGroupMethodIdentifierIds
        }
        enabledPaymentMethodsIds={getMarketplaceEnabledPaymentMethods({
          paymentMethodAvailableSubscription:
            enabledPaymentGroupMethodIdentifierIds,
        })}
        initialPaymentMethod={paymentMethodUsed?.type}
        paymentMethodLoading={paymentMethodLoading}
        refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
        requestSetupIntentSecret={requestSetupIntentSecret}
        savedPaymentMethodList={paymentMethodList}
        selectedSavedPaymentMethodId={selectedPaymentMethodId}
        sepaDefaultEmail={memberMail}
        sepaDefaultName={memberName}
        setSelectedSavedPaymentMethodId={setSelectedSavedPaymentMethod}
      />
    </>
  );
};

export default React.memo(ConsumerSubscriptionPaymentContent);
