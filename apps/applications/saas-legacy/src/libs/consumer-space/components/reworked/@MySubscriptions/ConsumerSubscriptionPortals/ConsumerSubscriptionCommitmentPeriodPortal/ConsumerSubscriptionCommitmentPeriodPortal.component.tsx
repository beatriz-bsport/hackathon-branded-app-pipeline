import React, { useState, useCallback } from 'react';

import {
  ConsumerSubscriptionCommitmentPeriodBottomDrawer,
  ConsumerSubscriptionCommitmentPeriodModal,
} from '.';

import type { OptionBackgroundCallback } from '#src/state/types';

import '../styles.css';

type Props = {
  /** Indicates if we should display bottom drawer instead of a modal */
  displayBottomDrawer: boolean;
  /** Action executed when clicking on the unsubscribe button */
  stopSubscriptionFromMemberProfile: (
    options: OptionBackgroundCallback,
  ) => void;
  /** Manages modal opening */
  isOpen: boolean;
  /** Action when closing modal */
  onClose: () => void;
  /** If the subscription has already started */
  hasSubscriptionStarted: boolean;
  /** The forecasted expiration date of the subscription when it has started */
  subscriptionForecastedExpirationDate: string | null;
  /** If the subscription is processing */
  isSubscriptionCancellationLoading: boolean;
};

const ConsumerSubscriptionCommitmentPeriodPortal: React.FC<Props> = ({
  displayBottomDrawer,
  stopSubscriptionFromMemberProfile,
  isOpen,
  onClose,
  hasSubscriptionStarted,
  subscriptionForecastedExpirationDate,
  isSubscriptionCancellationLoading,
}) => {
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const onStopSubscriptionClick = useCallback(() => {
    {
      stopSubscriptionFromMemberProfile({
        onSuccess: () => {
          setHasSucceeded(true);
        },
        onError: () => {
          setHasFailed(true);
        },
      });
    }
  }, [stopSubscriptionFromMemberProfile]);

  if (displayBottomDrawer) {
    return (
      <ConsumerSubscriptionCommitmentPeriodBottomDrawer
        hasFailed={hasFailed}
        hasSubscriptionStarted={hasSubscriptionStarted}
        hasSucceeded={hasSucceeded}
        isOpen={isOpen}
        isProcessing={isSubscriptionCancellationLoading}
        onClose={onClose}
        onStopSubscriptionClick={onStopSubscriptionClick}
        subscriptionForecastedExpirationDate={
          subscriptionForecastedExpirationDate
        }
      />
    );
  }

  return (
    <ConsumerSubscriptionCommitmentPeriodModal
      hasFailed={hasFailed}
      hasSubscriptionStarted={hasSubscriptionStarted}
      hasSucceeded={hasSucceeded}
      isOpen={isOpen}
      isProcessing={isSubscriptionCancellationLoading}
      onClose={onClose}
      onStopSubscriptionClick={onStopSubscriptionClick}
      subscriptionForecastedExpirationDate={
        subscriptionForecastedExpirationDate
      }
    />
  );
};

export default React.memo(ConsumerSubscriptionCommitmentPeriodPortal);
