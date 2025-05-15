import React from 'react';

import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import { PortalContainer } from '#src/components/css-only/Fabrique/PortalContainer';
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
  /** The expiration date of the subscription when it has started */
  subscriptionForecastedExpirationDate: string | null;
};

const ConsumerSubscriptionCommitmentPeriodBottomDrawer: React.FC<Props> = ({
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
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-consumer-booking-details-drawer__root"
        modalDialogProps={{
          title: t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.title',
          ),
          onClose,
          onCancel: onClose,
          confirmButtonColor: 'error',
          confirmLabel: t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.buttonsLabel.unsubscribe',
          ),
          cancelLabel: t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.cancel',
          ),
          onConfirm: onStopSubscriptionClick,
          isSubmitLoading: isProcessing,
          isCancelButtonDisabled: isButtonDisabled,
          isConfirmButtonDisabled: isButtonDisabled,
        }}
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
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionCommitmentPeriodBottomDrawer);
