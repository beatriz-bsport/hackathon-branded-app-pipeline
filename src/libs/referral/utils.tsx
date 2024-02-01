import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { ReferredVoucherTypeChoices } from './constants';
import type { ReferralLinkStatus } from './types';
import Config from '../../config';

/* This function builds the referral link which is given to a member,
so they can send it to the people they want to refer.

BE CAREFUL if you want to change the shape of the link:
this same link is also created in the backend for transactional emails
-> if you change the shape of the link here you also have to change it in the backend */
export const buildMemberReferralLink = (
  companyId: number,
  referral_uuid: string,
) => `/referral/${referral_uuid}?membership=${companyId}`;

export const isReferralUsable = (
  referralLinkStatus: ReferralLinkStatus | null,
) => referralLinkStatus && !referralLinkStatus.is_max_referral_uses_reached;

export const getReferredReduction = ({
  referred_voucher_type,
  amount_off_referred,
  percent_off_referred,
}: {
  referred_voucher_type: string;
  amount_off_referred: string;
  percent_off_referred: number;
}) => {
  let referredReduction: string;
  let hideReferredReduction: boolean;

  switch (referred_voucher_type) {
    case ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_AMOUNT:
      referredReduction = getCurrencyDisplayWithPrice(amount_off_referred);
      hideReferredReduction = parseInt(amount_off_referred, 10) === 0;
      break;

    case ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_PERCENT:
      referredReduction = `${percent_off_referred} %`;
      hideReferredReduction = percent_off_referred === 0;
      break;

    default:
      break;
  }

  return { referredReduction, hideReferredReduction };
};

// Temporary condition to hide the referral page while the feature is not finished
// Condition will be removed once the feature is finished
export const shouldHideReferral =
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ||
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'production';
