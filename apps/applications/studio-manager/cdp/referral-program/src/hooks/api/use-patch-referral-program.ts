import {
  type ReferralSettings,
  updateReferralProgramSettingsAction,
} from "@bsport/store-cdp-referral";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UsePatchReferralProgramParams = {
  onSuccess?: (referralProgramSettings: ReferralSettings) => void;
  onFailure?: (error: Error) => void;
};

const _patchReferralProgram = updateReferralProgramSettingsAction.bind(
  null,
  fetch,
);

/**
 * Hook for updating the referral program
 * @param params - Parameters for updating the referral program
 * @param params.onSuccess - Callback function to be called when the referral program is patchd successfully
 * @param params.onFailure - Callback function to be called when the referral program patch fails
 * @returns Object containing the loading state and the patch referral program function
 */
export function usePatchReferralProgram({
  onSuccess,
  onFailure,
}: UsePatchReferralProgramParams = {}) {
  const [{ isLoading }, triggerPatchReferralProgram] = useAsync<
    typeof _patchReferralProgram
  >({
    asyncFn: _patchReferralProgram,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    patchReferralProgram: triggerPatchReferralProgram,
  };
}
