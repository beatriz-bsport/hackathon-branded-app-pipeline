import React from 'react';
import type { AxiosResponse } from 'axios';

import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#Fabrique/PortalContainer';

import { ConsumerSubscriptionPaymentContent } from '.';

import type { PaymentMethod } from '#libs/payment/types';
import type { OptionCallback } from '../../../../../../../state/types';
import type { SubscriptionREST } from '#libs/subscription/types';

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

const ConsumerSubscriptionPaymentModal: React.FC<Props> = ({
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
      <Blanket
        className="bs-consumer__subscription__blanket"
        isOpen={isOpen}
        onClick={handleClose}
      >
        <ModalDialog
          cancelLabel={switchSucceeded && cancelLabel}
          isSubmitLoading={!selectedPaymentMethodId || isProcessing}
          onCancel={handleClose}
          onClose={selectedSubscription && handleClose}
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
