import React from 'react';
import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import { ReferralConditionsBottomDrawer, ReferralConditionsDialog } from '.';

import type {
  ReferralConditionsContentProps,
  ReferralConditionsModalProps,
} from './types';

import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';

import './styles.css';

type Props = ReferralConditionsContentProps & ReferralConditionsModalProps;

const ReferralConditionsModal: React.FC<Props> = ({
  applicationTimeLimitIntervals,
  applicationTimeLimitUnit,
  closeConditionsModal,
  hideReferredReduction,
  hideReferringReward,
  maxReferralUses,
  minBasketAmount,
  referredReduction,
  referringReward,
  showConditions,
}) => {
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  if (isMobile) {
    return (
      <ReferralConditionsBottomDrawer
        applicationTimeLimitIntervals={applicationTimeLimitIntervals}
        applicationTimeLimitUnit={applicationTimeLimitUnit}
        closeConditionsModal={closeConditionsModal}
        hideReferredReduction={hideReferredReduction}
        hideReferringReward={hideReferringReward}
        maxReferralUses={maxReferralUses}
        minBasketAmount={minBasketAmount}
        referredReduction={referredReduction}
        referringReward={referringReward}
        showConditions={showConditions}
      />
    );
  }
  return (
    <ReferralConditionsDialog
      applicationTimeLimitIntervals={applicationTimeLimitIntervals}
      applicationTimeLimitUnit={applicationTimeLimitUnit}
      closeConditionsModal={closeConditionsModal}
      hideReferredReduction={hideReferredReduction}
      hideReferringReward={hideReferringReward}
      maxReferralUses={maxReferralUses}
      minBasketAmount={minBasketAmount}
      referredReduction={referredReduction}
      referringReward={referringReward}
      showConditions={showConditions}
    />
  );
};

export const ReferralConditionsModalStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ReferralConditionsModal>
>()(ReferralConditionsModal);
export default React.memo(ReferralConditionsModal);
