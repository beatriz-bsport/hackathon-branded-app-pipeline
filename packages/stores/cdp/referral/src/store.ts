import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { ReferralSettings } from "#src/types";

export interface ReferralState {
  settings: ReferralSettings;
}

export const referralStore = createStore<ReferralState>()(() => ({
  settings: {
    id: 0,
    name: "",
    company: 0,
    minimum_basket_amount: "",
    maximum_referral_uses: 0,
    amount_off_referred: "",
    percent_off_referred: 0,
    referred_voucher_type: "amount_off",
    application_time_limit_intervals: 0,
    application_time_limit_unit: "days",
    amount_reward_referring: "",
    redirect_link: null,
    tag_referred_member: null,
  },
}));

export const useReferralStore = bindStore(referralStore);
