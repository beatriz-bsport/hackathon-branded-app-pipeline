import { ReferralTimeLimitUnits } from '../../constants';

export type ReferralConditionsContentProps = {
  applicationTimeLimitIntervals: number;
  applicationTimeLimitUnit: ReferralTimeLimitUnits;
  hideReferredReduction: boolean;
  hideReferringReward: boolean;
  maxReferralUses: number;
  minBasketAmount: string;
  referredReduction: string;
  referringReward: string;
};

export type ReferralConditionsModalProps = {
  closeConditionsModal: () => void;
  showConditions: boolean;
};
