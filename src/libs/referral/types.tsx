import { Tag } from '#libs/tag/types';
import {
  ReferralTimeLimitUnits,
  ReferredVoucherTypeChoices,
} from './constants';

export type ReferralProgram = {
  id: number;
  name: string;
  company: number;
  is_referral_program_activated: boolean;
  minimum_basket_amount: number;
  maximum_referral_uses: number;
  amount_off_referred: number;
  percent_off_referred: number;
  referred_voucher_type: ReferredVoucherTypeChoices;
  application_time_limit_intervals: number; // integer
  application_time_limit_unit: ReferralTimeLimitUnits; // 'days', 'weeks' or 'months'
  amount_reward_referring: number;
  redirect_link?: string;
  tag_referred_member?: Tag;
};

export type ReferralMemberStatus = {
  member_id: number;
  nb_remaining_referral_uses: number;
  referring_member_id?: string;
  referring_member_name?: string;
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
};
