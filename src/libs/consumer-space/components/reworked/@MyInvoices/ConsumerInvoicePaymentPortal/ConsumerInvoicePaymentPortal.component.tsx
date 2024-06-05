import React from 'react';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import type { ConsumerInvoice } from '#libs/invoice/types';
import {
  ConsumerInvoicePaymentModal,
  ConsumerInvoicePaymentBottomDrawer,
} from '.';


type Props = {
  availablePaymentMethodList: number[];
  clientSecret: string | null;
  clientSecretError: Error | null;
  clientSecretLoading: boolean;
  companyId: number;
  consumerInvoice: ConsumerInvoice;
  creditAccountBalance?: number;
  detachPaymentMethodLoading: boolean;
  displayBottomDrawer: boolean;
  isConsumerAllowedToUseInternalAccount: boolean;
  isMultiLocalizationEnabled: boolean;
  isOpen: boolean;
  memberId: number;
  paymentGroupId: number | null;
  stripeId: string;
  applyBalanceToInvoice: (invoiceUuid: string) => void;
  detachPaymentMethod: (id: string) => void;
  onClose: () => void;
  onPaymentSuccess: (invoiceUuid: string) => void;
  requestClientSecret: (invoiceUuid: string) => void;
};

const ConsumerInvoicePaymentPortal: React.FC<Props> = ({
  availablePaymentMethodList,
  clientSecret,
  clientSecretError,
  clientSecretLoading,
  companyId,
  consumerInvoice,
  creditAccountBalance,
  detachPaymentMethodLoading,
  displayBottomDrawer,
  isConsumerAllowedToUseInternalAccount,
  isMultiLocalizationEnabled,
  isOpen,
  memberId,
  paymentGroupId,
  stripeId,
  applyBalanceToInvoice,
  detachPaymentMethod,
  onClose,
  onPaymentSuccess,
  requestClientSecret,
}) => {
  const { t } = useTranslation('consumerSpace');

  const paymentStripeRef = React.useRef(null);

  const [paymentProcessing, setPaymentProcessing] = React.useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = React.useState(false);

  const handleClose = React.useCallback(() => {
    onClose?.();
    setPaymentSucceeded(false);
  }, [onClose]);

  const handleConfirmPayment = React.useCallback(
    (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPaymentProcessing(true);
      !!event && paymentStripeRef?.current?.onPaymentConfirm?.(event);
    },
    [],
  );

  const handlePaymentSuccess = React.useCallback(() => {
    setPaymentSucceeded(true);
    setPaymentProcessing(false);
    consumerInvoice?.uuid && onPaymentSuccess?.(consumerInvoice.uuid);
  }, [consumerInvoice?.uuid, onPaymentSuccess]);

  const handlePaymentProcessing = React.useCallback(
    (isPaymentProcessing: boolean) => setPaymentProcessing(isPaymentProcessing),
    [],
  );

  const handleApplyBalanceToInvoice = React.useCallback(
    () =>
      consumerInvoice?.uuid && applyBalanceToInvoice?.(consumerInvoice.uuid),
    [applyBalanceToInvoice, consumerInvoice?.uuid],
  );

  const title = t('reworked.myInvoices.payment.title');

  React.useEffect(() => {
    consumerInvoice?.uuid && requestClientSecret?.(consumerInvoice.uuid);
  }, [consumerInvoice?.uuid, requestClientSecret]);

  if (displayBottomDrawer) {
    return (
      <ConsumerInvoicePaymentBottomDrawer
        ref={paymentStripeRef}
        applyBalanceToInvoice={handleApplyBalanceToInvoice}
        availablePaymentMethodList={availablePaymentMethodList}
        clientSecret={clientSecret}
        clientSecretError={clientSecretError}
        clientSecretLoading={clientSecretLoading}
        companyId={companyId}
        confirmPayment={handleConfirmPayment}
        creditAccountBalance={creditAccountBalance}
        detachPaymentMethod={detachPaymentMethod}
        detachPaymentMethodLoading={detachPaymentMethodLoading}
        handleClose={handleClose}
        isConsumerAllowedToUseInternalAccount={
          isConsumerAllowedToUseInternalAccount
        }
        isMultiLocalizationEnabled={isMultiLocalizationEnabled}
        isOpen={isOpen}
        memberId={memberId}
        onPaymentSuccess={handlePaymentSuccess}
        paymentGroupId={paymentGroupId}
        paymentProcessing={paymentProcessing}
        paymentSucceeded={paymentSucceeded}
        priceToPayCts={consumerInvoice.amount_left_to_pay_cts}
        setPaymentProcessing={handlePaymentProcessing}
        stripeId={stripeId}
        title={title}
      />
    );
  }

  return (
    <ConsumerInvoicePaymentModal
      ref={paymentStripeRef}
      applyBalanceToInvoice={handleApplyBalanceToInvoice}
      availablePaymentMethodList={availablePaymentMethodList}
      clientSecret={clientSecret}
      clientSecretError={clientSecretError}
      clientSecretLoading={clientSecretLoading}
      companyId={companyId}
      confirmPayment={handleConfirmPayment}
      creditAccountBalance={creditAccountBalance}
      detachPaymentMethod={detachPaymentMethod}
      detachPaymentMethodLoading={detachPaymentMethodLoading}
      handleClose={handleClose}
      isConsumerAllowedToUseInternalAccount={
        isConsumerAllowedToUseInternalAccount
      }
      isMultiLocalizationEnabled={isMultiLocalizationEnabled}
      isOpen={isOpen}
      memberId={memberId}
      onPaymentSuccess={handlePaymentSuccess}
      paymentGroupId={paymentGroupId}
      paymentProcessing={paymentProcessing}
      paymentSucceeded={paymentSucceeded}
      priceToPayCts={consumerInvoice.amount_left_to_pay_cts}
      setPaymentProcessing={handlePaymentProcessing}
      stripeId={stripeId}
      title={title}
    />
  );
};

export const ConsumerInvoicePaymentPortalStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerInvoicePaymentPortal>
>()(ConsumerInvoicePaymentPortal);

export default React.memo(ConsumerInvoicePaymentPortal);
