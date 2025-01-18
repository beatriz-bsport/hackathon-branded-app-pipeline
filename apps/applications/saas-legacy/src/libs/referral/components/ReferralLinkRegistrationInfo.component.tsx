import React from 'react';

import { useTranslation } from 'react-i18next';
import { SadSmileyIcon } from '#src/components/icons/SadSmileyIcon.component';
import Welcome from '#src/libs/login/components/Welcome.component';
import type { ReferralLinkStatus } from '../types';

import { isReferralUsable } from '../utils';

import './ReferralLinkRegistrationInfo.css';

type Props = {
  referralLinkStatus: ReferralLinkStatus | null;
  referralExceptionCode: number;
  hasBeenRegistered: boolean;
  onConfirm: () => void;
  companyName: string;
};

const ReferralLinkRegistrationInfo: React.FC<Props> = (props) => {
  const {
    referralLinkStatus,
    referralExceptionCode,
    hasBeenRegistered,
    onConfirm,
    companyName,
  } = props;

  const { t } = useTranslation(['login', 'referral']);

  if (!referralLinkStatus) return null;

  if (
    isReferralUsable(referralLinkStatus) &&
    !hasBeenRegistered &&
    !referralExceptionCode
  ) {
    return (
      <div>
        {t('referral.signUpNow', {
          referringMemberFirstName:
            referralLinkStatus?.referring_member_first_name,
        })}
      </div>
    );
  }

  return (
    <div className="bs-referral-dialog-container__body">
      {hasBeenRegistered && (
        <>
          <Welcome companyName={companyName} onConfirm={onConfirm} />
        </>
      )}
      {referralExceptionCode && (
        <div className="bs-referral-exception-block">
          <div>
            <SadSmileyIcon />
          </div>
          <div className="bs-referral-dialog-container__body__title">
            {referralLinkStatus.is_max_referral_uses_reached
              ? t('referral:referralErrors.maxUsesReached.title')
              : t(`referral:referralErrors.${referralExceptionCode}.title`)}
          </div>
          <div className="bs-referral-dialog-container__body__description">
            {referralLinkStatus.is_max_referral_uses_reached
              ? t('referral:referralErrors.maxUsesReached.description')
              : t(
                  `referral:referralErrors.${referralExceptionCode}.description`,
                )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ReferralLinkRegistrationInfo);
