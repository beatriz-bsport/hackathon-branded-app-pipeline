import React from 'react';

import { useTranslation } from 'react-i18next';

import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#Fabrique/PortalContainer';
import { ConsumerSubscriptionCommitmentPeriodContent } from '.';

import '../styles.css';

type Props = {
  /** If the unsubscribe process has failed */
  hasFailed: boolean;
  /** If the unsubscribe process has succeeded */
  hasSucceeded: boolean;
  /** Manages modal opening */
  isOpen: boolean;
  /** Download process is active  */
  isProcessing: boolean;
  /** Action when closing modal */
  onClose: () => void;
  /** Action when clicking on unsubscribe */
  onStopSubscriptionClick: () => void;
  /** If the subscription has already started */
  hasSubscriptionStarted: boolean;
  /** The forecasted expiration date of the subscription when it has started */
  subscriptionForecastedExpirationDate: string | null;
};

const ConsumerSubscriptionCommitmentPeriodModal: React.FC<Props> = ({
  hasFailed,
  hasSucceeded,
  isOpen,
  isProcessing,
  onClose,
  onStopSubscriptionClick,
  hasSubscriptionStarted,
  subscriptionForecastedExpirationDate,
}) => {
  const { t } = useTranslation('consumerSpace');

  const isButtonDisabled = isProcessing || hasSucceeded || hasFailed;

  return (
    <PortalContainer wrapperId="bs-consumer-subscription-commitment-period-modal-portal-container">
      <Blanket
        className="bs-consumer__subscription__blanket"
        isOpen={isOpen}
        onClick={onClose}
      >
        <ModalDialog
          cancelLabel={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.cancel',
          )}
          confirmButtonColor="error"
          confirmLabel={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.buttonsLabel.unsubscribe',
          )}
          isCancelButtonDisabled={isButtonDisabled}
          isConfirmButtonDisabled={isButtonDisabled}
          isSubmitLoading={isProcessing}
          onCancel={onClose}
          onClose={onClose}
          onConfirm={onStopSubscriptionClick}
          title={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.title',
          )}
        >
          <ConsumerSubscriptionCommitmentPeriodContent
            hasFailed={hasFailed}
            hasSubscriptionStarted={hasSubscriptionStarted}
            hasSucceeded={hasSucceeded}
            isProcessing={isProcessing}
            subscriptionForecastedExpirationDate={
              subscriptionForecastedExpirationDate
            }
          />
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionCommitmentPeriodModal);
