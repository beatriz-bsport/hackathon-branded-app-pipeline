import {
  type ReferralSettings,
  fetchReferralProgramSettingsAction,
  selectReferralProgramSettings,
  useReferralStore,
} from "@bsport/store-cdp-referral";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseFetchReferralProgramParams = {
  onSuccess?: (referralProgram: ReferralSettings) => void;
  onFailure?: (error: Error) => void;
};

const _fetchReferralProgram = fetchReferralProgramSettingsAction.bind(
  null,
  fetch,
);

/**
 * Hook for fetching the company referral program
 * @param params - Parameters for fetching the referral program
 * @param params.onSuccess - Callback function to be called when the referral program is fetched successfully
 * @param params.onFailure - Callback function to be called when the referral program fetch fails
 * @returns Object containing the loading state and the fetch function for the referral program
 */
export function useFetchCompanyReferralProgram({
  onSuccess,
  onFailure,
}: UseFetchReferralProgramParams = {}) {
  const [{ isLoading }, fetchReferralProgram] = useAsync<
    typeof _fetchReferralProgram
  >({
    asyncFn: _fetchReferralProgram,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  const referralProgram = useReferralStore(selectReferralProgramSettings);

  return {
    isLoading,
    fetchReferralProgram,
    referralProgram,
  };
}
