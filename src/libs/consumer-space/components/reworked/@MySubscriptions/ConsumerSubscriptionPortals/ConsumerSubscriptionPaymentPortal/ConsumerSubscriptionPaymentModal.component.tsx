import React from 'react';
import type { AxiosResponse } from 'axios';

import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#Fabrique/PortalContainer';

import type { OptionCallback } from '#src/state/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import type { SubscriptionREST } from '#src/libs/subscription/types';
import { ConsumerSubscriptionPaymentContent } from '.';

import './styles.css';

type Props = {
  cancelLabel: string;
  enabledPaymentGroupMethodIdentifierIds: number[];
  isOpen: boolean;
  isProcessing: boolean;
  memberMail: string;
  memberName: string;
  paymentMethodList: PaymentMethod[];
  paymentMethodLoading: boolean;
  paymentMethodUsed: PaymentMethod;
  selectedPaymentMethodId: string | null;
  selectedSubscription: SubscriptionREST;
  switchSucceeded: boolean;
  title: string;
  detachPaymentMethod: (id: string, options?: OptionCallback) => void;
  handleClose: () => void;
  handleConfirm: () => void;
  refreshSavedPaymentMethodList: () => void;
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{ client_secret: string }>
  >;
  setSelectedSavedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
};

const ConsumerSubscriptionPaymentModal: React.FC<Props> = ({
  cancelLabel,
  enabledPaymentGroupMethodIdentifierIds,
  isOpen,
  isProcessing,
  memberMail,
  memberName,
  paymentMethodList,
  paymentMethodLoading,
  paymentMethodUsed,
  selectedPaymentMethodId,
  selectedSubscription,
  switchSucceeded,
  title,
  detachPaymentMethod,
  handleClose,
  handleConfirm,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  setSelectedSavedPaymentMethod,
}) => {
  return (
    <PortalContainer wrapperId="bs-consumer-subscription-payment-modal-portal-container">
      <Blanket
        className="bs-consumer__subscription__blanket"
        isOpen={isOpen}
        onClick={handleClose}
      >
        <ModalDialog
          cancelLabel={switchSucceeded && cancelLabel}
          classes={{
            content: 'bs-consumer-subscription-payment-modal__content',
          }}
          isConfirmButtonDisabled={!selectedPaymentMethodId}
          isSubmitLoading={isProcessing}
          onCancel={handleClose}
          onClose={handleClose}
          onConfirm={
            !switchSucceeded && selectedSubscription ? handleConfirm : null
          }
          title={title}
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
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionPaymentModal);
