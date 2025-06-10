import React from 'react';
import { useTranslation } from 'react-i18next';

import { PortalContainer } from '#Fabrique/PortalContainer';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import { ConsumerInvoicePaymentContent } from '.';

import './styles.css';
import { useInvoicePaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/invoice-payment/hooks/useInvoicePaymentStatusTracker';
import type { OptionCallback } from '#src/state/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';

type Props = {
  applyBalanceToInvoiceCallbacks: OptionCallback;
  companyId: number;
  isOpen: boolean;
  memberId: number;
  invoiceUuid: string;
  ref: React.Ref<any>;
  title: string;
  handleClose: () => void;
  onPaymentSuccess: () => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
};

const ConsumerInvoicePaymentModal: React.FC<Props> = React.forwardRef(
  (
    {
      applyBalanceToInvoiceCallbacks,
      companyId,
      invoiceUuid,
      isOpen,
      memberId,
      title,
      handleClose,
      onPaymentSuccess,
      stripePaymentElementConfig,
    },
    ref,
  ) => {
    const { t } = useTranslation(['consumerSpace', 'common']);

    const handleConfirmPayment = React.useCallback(
      (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // @ts-expect-error
        !!event && ref?.current?.onPaymentConfirm?.(event);
      },
      [ref],
    );
    const handleResetInvoicePaymentSetup = React.useCallback(() => {
      // @ts-expect-error
      ref?.current?.onResetInvoicePaymentSetup?.(event);
    }, [ref]);

    React.useEffect(() => {
      return () => {
        handleResetInvoicePaymentSetup();
      };
    }, [handleResetInvoicePaymentSetup]);

    const {
      isPaymentProcessing,
      setupPaymentError,
      isBackendProcessingAfterPayment,
      hasPaymentSucceeded,
      isPaymentInterfaceLoading,
    } = useInvoicePaymentStatusTracker({
      invoiceUuid,
      memberId,
    });

    const hasPaymentSucceededAndBackendProcessedIt =
      hasPaymentSucceeded && !isBackendProcessingAfterPayment;

    return (
      <PortalContainer wrapperId="bs-consumer-invoice-page__payment-portal__modal__portal-container">
        <Blanket
          className="bs-consumer-invoice-page__payment-portal__modal__blanket"
          isOpen={isOpen}
          onClick={handleClose}
        >
          <ModalDialog
            isFullWidth
            cancelLabel={
              hasPaymentSucceededAndBackendProcessedIt && t('common:close')
            }
            className={
              hasPaymentSucceededAndBackendProcessedIt
                ? 'bs-consumer-invoice-page__payment-portal__modal--success'
                : 'bs-consumer-invoice-page__payment-portal__modal--payment'
            }
            confirmLabel={t(
              'consumerSpace:reworked.myInvoices.payment.confirm',
            )}
            isSubmitLoading={
              isPaymentProcessing ||
              isPaymentInterfaceLoading ||
              isBackendProcessingAfterPayment
            }
            onCancel={handleClose}
            onClose={handleClose}
            onConfirm={
              !setupPaymentError &&
              !hasPaymentSucceededAndBackendProcessedIt &&
              !isBackendProcessingAfterPayment &&
              !isPaymentInterfaceLoading
                ? handleConfirmPayment
                : null
            }
            size="lg"
            title={title}
          >
            <ConsumerInvoicePaymentContent
              ref={ref}
              applyBalanceToInvoiceCallbacks={applyBalanceToInvoiceCallbacks}
              companyId={companyId}
              invoiceUuid={invoiceUuid}
              memberId={memberId}
              onPaymentSuccess={onPaymentSuccess}
              stripePaymentElementConfig={stripePaymentElementConfig}
            />
          </ModalDialog>
        </Blanket>
      </PortalContainer>
    );
  },
);

export default React.memo(ConsumerInvoicePaymentModal);
