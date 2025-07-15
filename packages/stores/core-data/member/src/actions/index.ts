import { Result } from "typescript-result";

import {
  type Action,
  HTTPException,
  type PaginatedResponse,
  type XhrAction,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  type FetchMembersParams,
  type ImportLeadsParams,
  type SearchMembersParams,
  archiveMemberAPI,
  fetchMembersAPI,
  importLeadsAPI,
  interrogateMemberRegularityAPI,
  restoreMemberAPI,
  searchMembersAPI,
} from "#src/api";
import type { Member } from "#src/types";

import {
  setMembers,
  setSearchMembers,
  updateIrregularities,
  updateMember,
} from "./store";

/**
 * Fetches a list of paginated members.
 * @param page The page number.
 * @param page_size The number of items per page.
 */
export const fetchMembersAction: Action<
  FetchMembersParams,
  PaginatedResponse<Member>
> = async (fetch, params) => {
  const [uri, init] = fetchMembersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setMembers({
        members: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch members", { cause: error }),
  );
};

/**
 * Searches a list of members corresponding to the provided text
 * @param text Query string to search for
 * @param params.hide_archived Whether to select only active members
 * @param params.only_archived Whether to select only archived members
 * @returns
 */
export const searchMembersAction: Action<
  SearchMembersParams,
  Array<Member>
> = async (fetch, params) => {
  const [uri, init] = searchMembersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSearchMembers({
        members: data,
        archived: !!params.params?.only_archived,
      });

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
 * Archive an active member
 * @param memberId Id of the member to archive
 */
export const archiveMemberAction: Action<{ memberId: number }, Member> = async (
  fetch,
  params,
) => {
  const [uri, init] = archiveMemberAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateMember(data);

      return data;
    },
    (error) =>
      new Error(`Failed to archive member n°${params.memberId}`, {
        cause: error,
      }),
  );
};

/**
 * Restore an archived member
 * @param memberId Id of the member to restore
 */
export const restoreMemberAction: Action<{ memberId: number }, Member> = async (
  fetch,
  params,
) => {
  const [uri, init] = restoreMemberAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateMember(data);

      return data;
    },
    (error) =>
      new Error(`Failed to restore member n°${params.memberId}`, {
        cause: error,
      }),
  );
};

/**
 * Check if the member has irregularity and retrieve a list of error code
 * @param memberId Id of the member to interrogate
 * @returns A list of error codes, that is empty if the member is regularized
 */
export const interrogateMemberRegularityAction: Action<
  { memberId: number },
  number[]
> = async (fetch, params) => {
  const [uri, init] = interrogateMemberRegularityAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateIrregularities(data);

      return data;
    },
    (error) =>
      new Error(
        `Failed to check irregularities for member n°${params.memberId}`,
        {
          cause: error,
        },
      ),
  );
};

export const importLeadsAction: XhrAction<
  ImportLeadsParams,
  { backgroundTaskUuid: string },
  HTTPException
> = async (xhr, params) => {
  const [uri, init] = importLeadsAPI(params);

  return Result.try(
    async () => {
      const { backgroundTaskUuid } = await xhr(uri, init);
      return { backgroundTaskUuid: backgroundTaskUuid ?? "" };
    },
    (error) => {
      if (params.signal.aborted) {
        return new HTTPException({
          path: uri,
          message: "Abort Import Leads",
          context: "Upload has been aborted by the user",
          statusCode: 200,
        });
      }
      return createErrorWithContext(error, {});
    },
  );
};
