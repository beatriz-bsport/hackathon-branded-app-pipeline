import React, { useCallback, useContext, useState } from 'react';

/**
 * Legacy MUI payment component for this particular use case
 */
// @ts-expect-error
import PaymentDialog from '#src/libs/payment/components/PaymentDialog.component';

import '#src/components/css-only/Portals/styles.css';
import {
  PAYMENT_INTENT_STATUS_SUCCESS,
  PAYMENT_INTENT_TYPE_DEBT,
} from '@bsport/common/lib/master-data/payment-group.js';
import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';

import type { PaymentEngine } from '#src/libs/payment/types';

type Props = {
  defaultUserEmail: string;
  defaultUserName: string;
};

/**
 * Modal used to pay the member's balance debt on his credit account
 * @prop defaultUserEmail The default used email for payment
 * @prop defaultUserName The default used name for payment
 */
const RegularizeDebtModal: React.FC<Props> = ({
  defaultUserEmail,
  defaultUserName,
}) => {
  const {
    creditAccountBalance,
    memberId,
    toggleRegularizeBalancePortal,
    handleConfirmRegularizeBalance,
    stripePaymentElementConfig,
    availablePaymentMethodList,
    cardBillingDetailsMandatory,
    companyId,
    detachPaymentMethod,
    detachPaymentMethodLoading,
    requestClientSecret,
    fetchPaymentGroupStatus,
    setPaymentGroupBillingEstablishment,
  } = useContext(ConsumerProfileContext);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentGroupId, setPaymentGroupId] = useState<number | null>(null);
  const [retryPaymentGroupStatus, setRetryPaymentGroupStatus] =
    useState<number>(0);
  const [paymentGroupCompletedCheckSeconds] = useState<number>(0.5);

  const handleRequestClientSecret = useCallback(
    (paymentEngine: PaymentEngine) => {
      setClientSecret(null);
      setPaymentGroupId(null);
      !!creditAccountBalance &&
        requestClientSecret(
          {
            payment_engine_identifier: paymentEngine,
            payment_intent_type: PAYMENT_INTENT_TYPE_DEBT,
            requested_price_cts: Math.round(creditAccountBalance * -100),
            member: memberId.toString(),
          },
          {
            onSuccess: (clientSecretResponse) => {
              setClientSecret(clientSecretResponse.client_secret);
              setPaymentGroupId(clientSecretResponse.payment_group);
            },
            onError: (err) => {
              console.error(err);
            },
          },
        );
    },
    [creditAccountBalance, memberId, requestClientSecret],
  );

  const listenPaymentGroupCompleted = useCallback(
    (callback?: unknown) => {
      fetchPaymentGroupStatus(paymentGroupId, {
        onSuccess: (paymentGroupStatus) => {
          if (retryPaymentGroupStatus > 100) {
            return;
          }
          if (paymentGroupStatus >= PAYMENT_INTENT_STATUS_SUCCESS) {
            setTimeout(() => {
              setPaymentGroupBillingEstablishment({
                paymentGroupId,
                establishmentId: null,
              });
              if (!!callback && typeof callback === 'function') callback();
            }, 2000);
          } else {
            setRetryPaymentGroupStatus(retryPaymentGroupStatus + 1);
            setTimeout(
              listenPaymentGroupCompleted,
              paymentGroupCompletedCheckSeconds * 2000,
            );
          }
        },
        onError: (error) => {
          console.error(error);
        },
      });
    },
    [
      fetchPaymentGroupStatus,
      paymentGroupCompletedCheckSeconds,
      paymentGroupId,
      retryPaymentGroupStatus,
      setPaymentGroupBillingEstablishment,
    ],
  );

  const handleOnSuccess = useCallback(() => {
    handleConfirmRegularizeBalance();
    listenPaymentGroupCompleted();
  }, [handleConfirmRegularizeBalance, listenPaymentGroupCompleted]);

  const amountToPay = creditAccountBalance
    ? Math.round(creditAccountBalance * -100)
    : 0;

  const isOnlyInternal = amountToPay < 0;

  return (
    <PaymentDialog
      asConsumer
      termsAndConditionsAccepted
      amountToPay={amountToPay}
      availablePaymentMethodList={availablePaymentMethodList}
      cardBillingDetailsMandatory={cardBillingDetailsMandatory}
      clientSecret={clientSecret}
      companyId={companyId}
      defaultUserEmail={defaultUserEmail}
      defaultUserName={defaultUserName}
      detachPaymentMethod={detachPaymentMethod}
      detachPaymentMethodLoading={detachPaymentMethodLoading}
      memberId={memberId}
      onCancel={toggleRegularizeBalancePortal}
      onError={() => {}}
      onlyInternal={isOnlyInternal}
      onSuccess={handleOnSuccess}
      paymentGroupId={paymentGroupId}
      paymentGroupPriceCts={amountToPay}
      requestClientSecret={handleRequestClientSecret}
      stripePaymentElementConfig={stripePaymentElementConfig}
    />
  );
};

export default React.memo(RegularizeDebtModal);
