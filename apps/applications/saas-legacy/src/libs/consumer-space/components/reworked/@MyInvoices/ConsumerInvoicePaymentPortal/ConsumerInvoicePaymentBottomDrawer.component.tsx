import React from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import { ConsumerInvoicePaymentContent } from '.';
import { PortalContainer } from '#src/components/css-only/Fabrique/PortalContainer';
import { useInvoicePaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/invoice-payment/hooks/useInvoicePaymentStatusTracker';
import type { OptionCallback } from '#src/state/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';

import './styles.css';

type Props = {
  companyId: number;
  isOpen: boolean;
  memberId: number;
  ref: React.Ref<any>;
  title: string;
  handleClose: () => void;
  onPaymentSuccess: () => void;
  invoiceUuid: string;
  applyBalanceToInvoiceCallbacks: OptionCallback;
  stripePaymentElementConfig: StripePaymentElementConfig;
};

const ConsumerInvoicePaymentBottomDrawer: React.FC<Props> = React.forwardRef(
  (
    {
      companyId,
      isOpen,
      memberId,
      handleClose,
      onPaymentSuccess,
      title,
      invoiceUuid,
      applyBalanceToInvoiceCallbacks,
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
      ref?.current?.onResetInvoicePaymentSetup?.();
    }, [ref]);

    React.useEffect(() => {
      return () => {
        handleResetInvoicePaymentSetup();
      };
    }, [handleResetInvoicePaymentSetup]);

    const {
      isPaymentProcessing,
      setupPaymentError,
      hasPaymentSucceeded,
      isBackendProcessingAfterPayment,
      isPaymentInterfaceLoading,
    } = useInvoicePaymentStatusTracker({
      invoiceUuid,
      memberId,
    });

    const hasPaymentSucceededAndBackendProcessedIt =
      hasPaymentSucceeded && !isBackendProcessingAfterPayment;

    return (
      <PortalContainer wrapperId="bs-consumer-invoice-page__payment-portal__modal__portal-container">
        <BottomDrawer
          blanketProps={{ isOpen, onClick: handleClose }}
          className="bs-consumer-invoice-page__payment-portal__bottom-drawer"
          modalDialogProps={{
            cancelLabel:
              hasPaymentSucceeded &&
              !isBackendProcessingAfterPayment &&
              t('common:close'),
            confirmLabel: t(
              'consumerSpace:reworked.myInvoices.payment.confirm',
            ),
            classes: {
              content:
                'bs-consumer-invoice-page__payment-portal__bottom-drawer__content',
            },
            isSubmitLoading:
              isPaymentProcessing ||
              isPaymentInterfaceLoading ||
              isBackendProcessingAfterPayment,
            title,
            onCancel: handleClose,
            onClose: handleClose,
            onConfirm:
              !setupPaymentError &&
              !hasPaymentSucceededAndBackendProcessedIt &&
              !isBackendProcessingAfterPayment &&
              !isPaymentInterfaceLoading
                ? handleConfirmPayment
                : null,
          }}
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
        </BottomDrawer>
      </PortalContainer>
    );
  },
);

export default React.memo(ConsumerInvoicePaymentBottomDrawer);
