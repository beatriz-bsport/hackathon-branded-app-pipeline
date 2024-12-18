import React from 'react';
import { useTranslation } from 'react-i18next';

import { PortalContainer } from '#Fabrique/PortalContainer';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';

import { ReferralConditionsContent } from '.';
import type {
  ReferralConditionsContentProps,
  ReferralConditionsModalProps,
} from './types';

type Props = ReferralConditionsContentProps & ReferralConditionsModalProps;

import './styles.css';

const ReferralConditionsDialog: React.FC<Props> = ({
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
      <Blanket
        className="bs-referral-conditions-blanket"
        isOpen={showConditions}
      >
        <ModalDialog
          classes={{ content: 'bs-referral-conditions__content' }}
          className="bs-referral-conditions-modal"
          onClose={closeConditionsModal}
          title={t('conditions.title')}
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
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(ReferralConditionsDialog);
