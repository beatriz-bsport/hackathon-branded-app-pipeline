import type { ReferralState } from "./store";

export const selectReferralProgramSettings = (state: ReferralState) => {
  return state.settings;
};
