import { Result } from "typescript-result";

import type { Member } from "@bsport/api-cdp";
import { type Action, createErrorWithContext } from "@bsport/store-base";
import {
  type GetMemberParams,
  getMemberAPI,
} from "@bsport/store-core-data-member";

/**
 * Fetches a single member by ID for the checkout flow.
 * @param memberId The ID of the member to fetch
 * @returns Member object
 */
export const getMember: Action<GetMemberParams, Member> = async (
  fetch,
  params,
) => {
  const [uri, init] = getMemberAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch member",
        params,
      }),
  );
};
