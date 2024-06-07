import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group';

import { getPaymentGroupStatus as getPaymentGroupStatusAPI } from '#src/libs/payment/api';

import Alert from '#Fabrique/Alert';
import BigIcon from '#Fabrique/BigIcon';
import CircularProgress from '#src/components/css-only/CircularProgress';
import LinearProgess from '#Fabrique/LinearProgress';
import OnlinePayment from '#src/libs/payment/components/OnlinePayment.component';
import Typography from '#Fabrique/Typography';

import './styles.css';

type Props = {
  availablePaymentMethodList: number[] | null;
  cardBillingDetailsMandatory?: boolean;
  clientSecret: string | null;
  clientSecretError: Error | null;
  clientSecretLoading: boolean;
  companyId: number;
  creditAccountBalance?: number;
  detachPaymentMethodLoading: boolean;
  isConsumerAllowedToUseInternalAccount: boolean;
  isMultiLocalizationEnabled: boolean;
  memberId: number;
  paymentGroupId: number | null;
  paymentGroupPriceCts: number;
  paymentProcessing: boolean;
  paymentSucceeded: boolean;
  ref: React.Ref<any>;
  applyBalanceToInvoice: () => void;
  detachPaymentMethod: (id: string) => void;
  onPaymentSuccess: (callback?: () => void) => void;
  setPaymentProcessing: (isProcessing: boolean) => void;
};

const ConsumerInvoicePaymentContent: React.FC<Props> = React.forwardRef(
  (
    {
      availablePaymentMethodList,
      cardBillingDetailsMandatory,
      clientSecret,
      clientSecretError,
      clientSecretLoading,
      companyId,
      creditAccountBalance,
      detachPaymentMethodLoading,
      isConsumerAllowedToUseInternalAccount,
      isMultiLocalizationEnabled,
      memberId,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentProcessing,
      paymentSucceeded,
      applyBalanceToInvoice,
      detachPaymentMethod,
      onPaymentSuccess,
      setPaymentProcessing,
    },
    ref,
  ) => {
    const { t } = useTranslation('consumerSpace');

    const onSuccessRetry = React.useCallback(
      (nextRetrySeconds: number) => {
        !!paymentGroupId &&
          getPaymentGroupStatusAPI(paymentGroupId)
            .then((response) => {
              if (response.data >= PAYMENT_INTENT_STATUS_SUCCESS) {
                setTimeout(onPaymentSuccess, 2000);
              } else {
                setTimeout(
                  () => onSuccessRetry(nextRetrySeconds * 2),
                  nextRetrySeconds * 1000,
                );
              }
            })
            .catch(console.error);
      },
      [onPaymentSuccess, paymentGroupId],
    );

    const onSuccess = React.useCallback(
      () => onSuccessRetry(1),
      [onSuccessRetry],
    );

    const paymentMethodChoices = React.useMemo(
      () =>
        PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_STRIPE].filter(
          (paymentMethod) => {
            if (availablePaymentMethodList) {
              return availablePaymentMethodList.length
                ? availablePaymentMethodList.includes(paymentMethod)
                : paymentMethod === PAYMENT_GROUP_METHOD_IDENTIFIER_CB;
            }
            return true;
          },
        ),
      [availablePaymentMethodList],
    );

    if (paymentSucceeded) {
      return (
        <div className="bs-consumer-invoice-page__payment-portal__confirmation">
          <BigIcon variant="success" />
          <Typography
            align="center"
            className="bs-consumer-invoice-page__payment-portal__confirmation__text"
            variant="title-sm"
          >
            {t('reworked.myInvoices.payment.successMessage')}
          </Typography>
        </div>
      );
    }

    if (clientSecretError && !clientSecret) {
      return (
        <Alert
          className="bs-consumer-invoice-page__payment-portal__error"
          color="error"
          variant="weak"
        >
          {clientSecretError.message}
        </Alert>
      );
    }

    return (
      <>
        {clientSecretLoading ? (
          <div className="bs-consumer-invoice-page__payment-portal__loading">
            <CircularProgress />
          </div>
        ) : (
          <OnlinePayment
            ref={ref}
            forceHideButton
            hidePrice
            allowConsumerToUseInternalAccount={
              isConsumerAllowedToUseInternalAccount
            }
            applyBalanceToInvoice={applyBalanceToInvoice}
            cardBillingDetailsMandatory={cardBillingDetailsMandatory}
            clientSecret={clientSecret}
            clientSecretLoading={clientSecretLoading}
            companyId={companyId}
            creditAccountBalance={creditAccountBalance}
            detachPaymentMethod={detachPaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            enableMultiLocalization={isMultiLocalizationEnabled}
            loading={
              paymentProcessing ||
              clientSecretLoading ||
              !paymentGroupId ||
              !clientSecret
            }
            memberId={memberId}
            onSuccess={onSuccess}
            paymentGroupId={paymentGroupId}
            paymentGroupPriceCts={paymentGroupPriceCts}
            paymentMethodChoices={paymentMethodChoices}
            paymentProcessing={paymentProcessing}
            setPaymentProcessing={setPaymentProcessing}
          />
        )}
        {paymentProcessing && (
          <div className="bs-consumer-invoice-page__payment-portal__processing">
            <LinearProgess />
          </div>
        )}
      </>
    );
  },
);

export default React.memo(ConsumerInvoicePaymentContent);
