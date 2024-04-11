import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConsumerInvoicePaymentContent } from '.';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';

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

const ConsumerInvoicePaymentModal: React.FC<Props> = React.forwardRef(
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
      <PortalContainer wrapperId="bs-consumer-invoice-page__payment-portal__modal__portal-container">
        <Blanket
          className="bs-consumer-invoice-page__payment-portal__modal__blanket"
          isOpen={isOpen}
          onClick={handleClose}
        >
          <ModalDialog
            isFullWidth
            cancelLabel={paymentSucceeded && t('common:close')}
            className={
              paymentSucceeded
                ? 'bs-consumer-invoice-page__payment-portal__modal--success'
                : 'bs-consumer-invoice-page__payment-portal__modal--payment'
            }
            confirmLabel={t(
              'consumerSpace:reworked.myInvoices.payment.confirm',
            )}
            isSubmitLoading={
              paymentProcessing ||
              clientSecretLoading ||
              !paymentGroupId ||
              !clientSecret
            }
            onCancel={handleClose}
            onClose={handleClose}
            onConfirm={
              !paymentSucceeded && !clientSecretError && !clientSecretLoading
                ? confirmPayment
                : null
            }
            size="lg"
            title={title}
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
          </ModalDialog>
        </Blanket>
      </PortalContainer>
    );
  },
);

export default React.memo(ConsumerInvoicePaymentModal);
