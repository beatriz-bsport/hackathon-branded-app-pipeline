import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { ReferredVoucherTypeChoices } from './constants';
import type { ReferralLinkStatus } from './types';

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
