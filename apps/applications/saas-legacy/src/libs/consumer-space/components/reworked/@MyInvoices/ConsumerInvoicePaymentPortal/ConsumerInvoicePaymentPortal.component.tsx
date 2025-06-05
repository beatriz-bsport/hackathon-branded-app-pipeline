import React from 'react';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import type { ConsumerInvoice } from '#src/libs/invoice/types';
import {
  ConsumerInvoicePaymentBottomDrawer,
  ConsumerInvoicePaymentModal,
} from '.';
import type { OptionCallback } from '#src/state/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';

type Props = {
  companyId: number;
  consumerInvoice: ConsumerInvoice;
  displayBottomDrawer: boolean;
  isOpen: boolean;
  memberId: number;
  onClose: () => void;
  onPaymentSuccess: (invoiceUuid: string) => void;
  applyBalanceToInvoiceCallbacks?: OptionCallback;
  stripePaymentElementConfig: StripePaymentElementConfig;
};

const ConsumerInvoicePaymentPortal: React.FC<Props> = ({
  companyId,
  consumerInvoice,
  displayBottomDrawer,
  isOpen,
  memberId,
  applyBalanceToInvoiceCallbacks,
  onClose,
  onPaymentSuccess,
  stripePaymentElementConfig,
}) => {
  const { t } = useTranslation('consumerSpace');

  const paymentStripeRef = React.useRef(null);

  const handleClose = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handlePaymentSuccess = React.useCallback(() => {
    consumerInvoice?.uuid && onPaymentSuccess?.(consumerInvoice.uuid);
  }, [consumerInvoice?.uuid, onPaymentSuccess]);

  const title = t('reworked.myInvoices.payment.title');

  if (displayBottomDrawer) {
    return (
      <ConsumerInvoicePaymentBottomDrawer
        ref={paymentStripeRef}
        applyBalanceToInvoiceCallbacks={applyBalanceToInvoiceCallbacks}
        companyId={companyId}
        handleClose={handleClose}
        invoiceUuid={consumerInvoice?.uuid}
        isOpen={isOpen}
        memberId={memberId}
        onPaymentSuccess={handlePaymentSuccess}
        stripePaymentElementConfig={stripePaymentElementConfig}
        title={title}
      />
    );
  }

  return (
    <ConsumerInvoicePaymentModal
      ref={paymentStripeRef}
      applyBalanceToInvoiceCallbacks={applyBalanceToInvoiceCallbacks}
      companyId={companyId}
      handleClose={handleClose}
      invoiceUuid={consumerInvoice?.uuid}
      isOpen={isOpen}
      memberId={memberId}
      onPaymentSuccess={handlePaymentSuccess}
      stripePaymentElementConfig={stripePaymentElementConfig}
      title={title}
    />
  );
};

export const ConsumerInvoicePaymentPortalStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerInvoicePaymentPortal>
>()(ConsumerInvoicePaymentPortal);

export default React.memo(ConsumerInvoicePaymentPortal);
