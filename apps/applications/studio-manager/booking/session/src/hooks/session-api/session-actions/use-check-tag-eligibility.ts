import { useMutation } from "@tanstack/react-query";

import {
  type CheckTagEligibilityParams,
  checkTagEligibilityAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const checkTagEligibility = checkTagEligibilityAPI.bind(null, fetch);

type CheckTagEligibilityVariables = {
  sessionId: number;
  params?: CheckTagEligibilityParams;
};

// checkTagEligibility is expected to return 204 No Content if the session is eligible, and 403 Forbidden if not eligible.
// We can use the presence of an error to determine eligibility, so we return void on success.
// We don't need to invalidate any queries on success since this action doesn't change any data, it just checks eligibility.
export const useCheckTagEligibility = () =>
  useMutation<void, Error, CheckTagEligibilityVariables>({
    mutationFn: ({ sessionId, params }) =>
      checkTagEligibility(sessionId, params),
  });
