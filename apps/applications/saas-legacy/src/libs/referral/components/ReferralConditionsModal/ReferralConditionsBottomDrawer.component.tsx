import React from 'react';
import { useTranslation } from 'react-i18next';

import { PortalContainer } from '#Fabrique/PortalContainer';
import BottomDrawer from '#src/components/css-only/Fabrique/BottomDrawer';
import { ReferralConditionsContent } from '.';

import type {
  ReferralConditionsContentProps,
  ReferralConditionsModalProps,
} from './types';

import './styles.css';

type Props = ReferralConditionsContentProps & ReferralConditionsModalProps;

const ReferralConditionsBottomDrawer: React.FC<Props> = ({
  showConditions,
  closeConditionsModal,
  maxReferralUses,
  referredReduction,
  minBasketAmount,
  applicationTimeLimitIntervals,
  applicationTimeLimitUnit,
  referringReward,
  hideReferredReduction,
  hideReferringReward,
}) => {
  const { t } = useTranslation('referral');

  return (
    <PortalContainer wrapperId="bs-referral-conditions-portal-container">
      <BottomDrawer
        blanketProps={{
          isOpen: showConditions,
          onClick: closeConditionsModal,
          className: 'bs-referral-conditions-blanket',
        }}
        className="bs-referral-conditions-bottom-drawer"
        modalDialogProps={{
          classes: { content: 'bs-referral-conditions__content' },
          title: t('conditions.title'),
          onClose: closeConditionsModal,
        }}
      >
        <ReferralConditionsContent
          applicationTimeLimitIntervals={applicationTimeLimitIntervals}
          applicationTimeLimitUnit={applicationTimeLimitUnit}
          hideReferredReduction={hideReferredReduction}
          hideReferringReward={hideReferringReward}
          maxReferralUses={maxReferralUses}
          minBasketAmount={minBasketAmount}
          referredReduction={referredReduction}
          referringReward={referringReward}
        />
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(ReferralConditionsBottomDrawer);
