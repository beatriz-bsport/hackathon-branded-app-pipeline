import { Membership } from '#src/libs/membership/types';
import { Tag } from '#src/libs/tag/types';
import {
  ReferralTimeLimitUnits,
  ReferredVoucherTypeChoices,
} from './constants';

export type ReferralProgram = {
  id: number;
  name: string;
  company: number;
  minimum_basket_amount: string;
  maximum_referral_uses: number;
  amount_off_referred: string;
  percent_off_referred: number;
  referred_voucher_type: ReferredVoucherTypeChoices;
  application_time_limit_intervals: number; // integer
  application_time_limit_unit: ReferralTimeLimitUnits; // 'days', 'weeks' or 'months'
  amount_reward_referring: string;
  redirect_link?: string;
  tag_referred_member?: Tag;
};

export type ReferralMemberStatus = {
  member_id: number;
  nb_remaining_referral_uses: number;
  referring_member_id?: string;
  referring_member_name?: string;
};

export type ReferralLinkStatus = {
  referring_member_id: number;
  referring_member_first_name: string;
  company_id: number;
  application_time_limit_intervals: number;
  application_time_limit_unit: ReferralTimeLimitUnits;
  is_max_referral_uses_reached: boolean;
  redirect_link: string;
};

export type ReferralState = {
  referralProgram: {
    byId: { [id: number]: ReferralProgram };
    loading: boolean;
    error: Error | null;
  };
  updateReferralProgram: {
    loading: boolean;
    error: Error | null;
  };
  referralMemberStatus: {
    byId: { [id: number]: ReferralMemberStatus };
    loading: boolean;
    error: Error | null;
  };
  referralLinkStatus: {
    byId: { [id: number]: ReferralLinkStatus };
    loading: boolean;
    error: Error | null;
  };
  referralException: {
    registrationErrorCode: number | null;
  };
};

export type LinkToCompanyWithReferralPayload = {
  referral_exception_code: number;
  member: Membership;
};
