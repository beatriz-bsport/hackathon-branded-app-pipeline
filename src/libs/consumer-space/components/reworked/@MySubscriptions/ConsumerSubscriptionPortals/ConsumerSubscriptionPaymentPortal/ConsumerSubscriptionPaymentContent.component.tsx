import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AxiosResponse } from 'axios';

import Alert from '#Fabrique/Alert';
import BigIcon from '#Fabrique/BigIcon';
import Typography from '#Fabrique/Typography';

import MarketplaceSubscriptionPayment from '#src/libs/checkout/components/new-checkout-flow/SubscriptionPayment/SubscriptionPayment.component';
import { getMarketplaceEnabledPaymentMethods } from '#src/libs/payment/utils';

import type { OptionCallback } from '#src/state/types';
import type { PaymentMethod } from '#src/libs/payment/types';

type Props = {
  enabledPaymentGroupMethodIdentifierIds: number[];
  memberMail: string;
  memberName: string;
  paymentMethodList: PaymentMethod[];
  paymentMethodLoading: boolean;
  paymentMethodUsed: PaymentMethod;
  selectedPaymentMethodId: string | null;
  switchSucceeded: boolean;
  detachPaymentMethod: (id: string, options?: OptionCallback) => void;
  refreshSavedPaymentMethodList: () => void;
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{ client_secret: string }>
  >;
  setSelectedSavedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
};

const ConsumerSubscriptionPaymentContent: React.FC<Props> = ({
  enabledPaymentGroupMethodIdentifierIds,
  memberMail,
  memberName,
  paymentMethodList,
  paymentMethodLoading,
  paymentMethodUsed,
  selectedPaymentMethodId,
  switchSucceeded,
  detachPaymentMethod,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  setSelectedSavedPaymentMethod,
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
