import type { ReferralProgram } from '#src/libs/referral/types';

export type ReferralCardProps = {
  hasUnknownError: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  nbRemainingReferralUses: number;
  referralLink: string;
  referralProgram: ReferralProgram;
};
