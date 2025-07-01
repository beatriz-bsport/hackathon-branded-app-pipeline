import { referralStore } from "#src/store";
import type { ReferralSettings } from "#src/types";

export const setReferralSettings = (data: ReferralSettings) => {
  referralStore.setState(() => {
    return {
      settings: {
        ...data,
      },
    };
  });
};
