import React from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import { ConsumerInvoicePaymentContent } from '.';

import './styles.css';

type Props = {
  availablePaymentMethodList: number[];
  clientSecret: string | null;
  clientSecretError: Error | null;
  clientSecretLoading: boolean;
  companyId: number;
  creditAccountBalance?: number;
  detachPaymentMethodLoading: boolean;
  isConsumerAllowedToUseInternalAccount: boolean;
  isMultiLocalizationEnabled: boolean;
  isOpen: boolean;
  memberId: number;
  paymentGroupId: number | null;
  paymentProcessing: boolean;
  paymentSucceeded: boolean;
  priceToPayCts: number;
  ref: React.Ref<any>;
  stripeId: string;
  title: string;
  applyBalanceToInvoice: () => void;
  confirmPayment: () => void;
  detachPaymentMethod: (id: string) => void;
  handleClose: () => void;
  onPaymentSuccess: () => void;
  setPaymentProcessing: (isProcessing: boolean) => void;
};

const ConsumerInvoicePaymentBottomDrawer: React.FC<Props> = React.forwardRef(
  (
    {
      availablePaymentMethodList,
      clientSecret,
      clientSecretError,
      clientSecretLoading,
      companyId,
      creditAccountBalance,
      detachPaymentMethodLoading,
      isConsumerAllowedToUseInternalAccount,
      isMultiLocalizationEnabled,
      isOpen,
      memberId,
      paymentGroupId,
      paymentProcessing,
      paymentSucceeded,
      priceToPayCts,
      stripeId,
      title,
      applyBalanceToInvoice,
      confirmPayment,
      detachPaymentMethod,
      handleClose,
      onPaymentSuccess,
      setPaymentProcessing,
    },
    ref,
  ) => {
    const { t } = useTranslation(['consumerSpace', 'common']);

    return (
      <BottomDrawer
        blanketProps={{ isOpen, onClick: handleClose }}
        className="bs-consumer-invoice-page__payment-portal__bottom-drawer"
        modalDialogProps={{
          cancelLabel: paymentSucceeded && t('common:close'),
          confirmLabel: t('consumerSpace:reworked.myInvoices.payment.confirm'),
          classes: {
            content:
              'bs-consumer-invoice-page__payment-portal__bottom-drawer__content',
          },
          isSubmitLoading:
            paymentProcessing ||
            clientSecretLoading ||
            !paymentGroupId ||
            !clientSecret,
          title,
          onCancel: handleClose,
          onClose: handleClose,
          onConfirm:
            !paymentSucceeded && !clientSecretError && !clientSecretLoading
              ? confirmPayment
              : null,
        }}
      >
        <ConsumerInvoicePaymentContent
          ref={ref}
          applyBalanceToInvoice={applyBalanceToInvoice}
          availablePaymentMethodList={availablePaymentMethodList}
          clientSecret={clientSecret}
          clientSecretError={clientSecretError}
          clientSecretLoading={clientSecretLoading}
          companyId={companyId}
          creditAccountBalance={creditAccountBalance}
          detachPaymentMethod={detachPaymentMethod}
          detachPaymentMethodLoading={detachPaymentMethodLoading}
          isConsumerAllowedToUseInternalAccount={
            isConsumerAllowedToUseInternalAccount
          }
          isMultiLocalizationEnabled={isMultiLocalizationEnabled}
          memberId={memberId}
          onPaymentSuccess={onPaymentSuccess}
          paymentGroupId={paymentGroupId}
          paymentGroupPriceCts={priceToPayCts}
          paymentProcessing={paymentProcessing}
          paymentSucceeded={paymentSucceeded}
          setPaymentProcessing={setPaymentProcessing}
          stripeId={stripeId}
        />
      </BottomDrawer>
    );
  },
);

export default React.memo(ConsumerInvoicePaymentBottomDrawer);
