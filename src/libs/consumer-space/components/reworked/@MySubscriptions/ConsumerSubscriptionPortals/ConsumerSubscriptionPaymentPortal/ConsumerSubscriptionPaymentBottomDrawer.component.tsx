import React from 'react';
import type { AxiosResponse } from 'axios';

import BottomDrawer from '#Fabrique/BottomDrawer';
import { PortalContainer } from '#src/components/css-only/Fabrique/PortalContainer';

import type { OptionCallback } from '#src/state/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import type { SubscriptionREST } from '#src/libs/subscription/types';
import { ConsumerSubscriptionPaymentContent } from '.';

type Props = {
  cancelLabel: string;
  detachPaymentMethod: (id: string, options?: OptionCallback) => void;
  enabledPaymentGroupMethodIdentifierIds: number[];
  handleClose: () => void;
  handleConfirm: () => void;
  isOpen: boolean;
  isProcessing: boolean;
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
  selectedSubscription: SubscriptionREST;
  setSelectedSavedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  switchSucceeded: boolean;
  title: string;
};

const ConsumerSubscriptionPaymentBottomDrawer: React.FC<Props> = ({
  cancelLabel,
  detachPaymentMethod,
  enabledPaymentGroupMethodIdentifierIds,
  handleClose,
  handleConfirm,
  isOpen,
  isProcessing,
  memberMail,
  memberName,
  paymentMethodList,
  paymentMethodLoading,
  paymentMethodUsed,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  selectedPaymentMethodId,
  selectedSubscription,
  setSelectedSavedPaymentMethod,
  switchSucceeded,
  title,
}) => {
  return (
    <PortalContainer wrapperId="bs-consumer-subscription-payment-modal-portal-container">
      <BottomDrawer
        blanketProps={{ isOpen, onClick: handleClose }}
        className="bs-consumer-booking-details-drawer__root"
        modalDialogProps={{
          classes: {
            content: 'bs-consumer-subscription-payment-modal__content',
          },
          isSubmitLoading: isProcessing,
          isConfirmButtonDisabled: !selectedPaymentMethodId,
          title,
          onClose: handleClose,
          onCancel: handleClose,
          onConfirm:
            !switchSucceeded && selectedSubscription ? handleConfirm : null,
          cancelLabel: switchSucceeded && cancelLabel,
        }}
      >
        <ConsumerSubscriptionPaymentContent
          detachPaymentMethod={detachPaymentMethod}
          enabledPaymentGroupMethodIdentifierIds={
            enabledPaymentGroupMethodIdentifierIds
          }
          memberMail={memberMail}
          memberName={memberName}
          paymentMethodList={paymentMethodList}
          paymentMethodLoading={paymentMethodLoading}
          paymentMethodUsed={paymentMethodUsed}
          refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
          requestSetupIntentSecret={requestSetupIntentSecret}
          selectedPaymentMethodId={selectedPaymentMethodId}
          setSelectedSavedPaymentMethod={setSelectedSavedPaymentMethod}
          switchSucceeded={switchSucceeded}
        />
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionPaymentBottomDrawer);
