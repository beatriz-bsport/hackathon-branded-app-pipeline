/**
 * TODO: Should be moved CDP business component
 */
import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";
import {
  type GetMemberParams,
  type SearchMembersParams,
  getMemberAPI,
  searchMembersAPI,
} from "@bsport/store-core-data-member";

import type { Member } from "#src/types/member";

/**
 * Searches a list of members corresponding to the provided text
 * @param text Query string to search for
 * @param params.hide_archived Whether to select only active members
 * @param params.only_archived Whether to select only archived members
 * @returns Array of Member objects
 */
export const searchMembersAction: Action<
  SearchMembersParams,
  Array<Member>
> = async (fetch, params) => {
  const [uri, init] = searchMembersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to search members",
        params,
      }),
  );
};

/**
 * Fetches a single member by ID
 * @param memberId The ID of the member to fetch
 * @returns Member object
 */
export const getMembers: Action<GetMemberParams, Member> = async (
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
