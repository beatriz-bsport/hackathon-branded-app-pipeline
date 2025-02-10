import { Result } from "typescript-result";

import {
  fetchGroupActivities as apiFetchGroupActivities,
  archiveGroupActivity as apiArchiveGroupActivity,
  unarchiveGroupActivity as apiUnarchiveGroupActivity,
  duplicateGroupActivity as apiDuplicateGroupActivity,
  checkCanArchiveGroupActivity as apiCheckCanArchiveGroupActivity,
} from "#src/api";

import type { Action } from "@bsport/store-base";
import type {
  CanArchiveGroupActivityResponse,
  FetchGroupActivitiesParams,
  MetaActivity,
  PaginatedResponse,
} from "#src/types";

/**
 * Fetches group activities based on the provided parameters.
 *
 * @param fetch - The fetch function to use for making the network request.
 * @param params - The parameters for fetching group activities.
 * @param params.page - The page number to fetch.
 * @param params.pageSize - The number of items per page.
 * @param params.customerEnabled - Whether customer-enabled activities should be fetched.
 * @returns A promise that resolves to a result containing the paginated response of meta activities or an error.
 * @throws An error if the fetch request fails or if the response is not ok.
 */
export const fetchGroupActivities: Action<
  FetchGroupActivitiesParams,
  Result<PaginatedResponse<MetaActivity>, Error>
> = async (fetch, params) => {
  const [uri, init] = apiFetchGroupActivities(params);

  return Result.try(
    async () => {
      const response = await fetch(uri, init);
      if (!response.ok) {
        return new Error("Response was not ok");
      }
      return response.json();
    },
    (error) => new Error("Failed to fetch group activities", { cause: error }),
  );
};

/**
 * Check if a group activity can be archived based on its ID
 *
 * @param fetch - The fetch function to use for making the network request.
 * @param groupActivityId - The ID of the group activity to archive.
 * @returns A promise that resolves to a result containing can_destroy (boolean) and the offers related to this group activity.
 * @throws An error if the groupActivityId is not provided, if the fetch request fails, or if the response is not ok.
 */
export const checkCanArchiveGroupActivity: Action<
  string,
  Result<CanArchiveGroupActivityResponse, Error>
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error(
        "A group activity Id is required to check if it can be archived.",
      ),
    );

  const [uri, init] = apiCheckCanArchiveGroupActivity(groupActivityId);

  return Result.try(
    async () => {
      const response = await fetch(uri, init);
      if (!response.ok) {
        return new Error("Response was not ok");
      }
      return response.json();
    },
    (error) =>
      new Error(`Failed to check group activity with ID: ${groupActivityId}`, {
        cause: error,
      }),
  );
};

/**
 * Archives a group activity by its ID.
 *
 * @param fetch - The fetch function to use for making the network request.
 * @param groupActivityId - The ID of the group activity to archive.
 * @returns A promise that resolves to a result containing the the archived group activity or an error.
 * @throws An error if the groupActivityId is not provided, if the fetch request fails, or if the response is not ok.
 */
export const archiveGroupActivity: Action<
  string,
  Result<MetaActivity, Error>
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to archive."),
    );

  const [uri, init] = apiArchiveGroupActivity(groupActivityId);

  return Result.try(
    async () => {
      const response = await fetch(uri, init);
      if (!response.ok) {
        return new Error("Response was not ok");
      }
      return response.json();
    },
    (error) =>
      new Error(
        `Failed to archive group activity with ID: ${groupActivityId}`,
        {
          cause: error,
        },
      ),
  );
};

/**
 * Unarchives a group activity by its ID.
 *
 * @param fetch - The fetch function to use for making the network request.
 * @param groupActivityId - The ID of the group activity to unarchive.
 * @returns A promise that resolves to a result containing the the unarchived group activity or an error.
 * @throws An error if the groupActivityId is not provided, if the fetch request fails, or if the response is not ok.
 */
export const unarchiveGroupActivity: Action<
  string,
  Result<MetaActivity, Error>
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to unarchive."),
    );

  const [uri, init] = apiUnarchiveGroupActivity(groupActivityId);

  return Result.try(
    async () => {
      const response = await fetch(uri, init);
      if (!response.ok) {
        return new Error("Response was not ok");
      }
      return response.json();
    },
    (error) =>
      new Error(
        `Failed to unarchive group activity with ID: ${groupActivityId}`,
        {
          cause: error,
        },
      ),
  );
};

/**
 * Duplicate a group activity by its ID.
 *
 * @param fetch - The fetch function to use for making the network request.
 * @param groupActivityId - The ID of the group activity to duplicate.
 * @returns A promise that resolves to the duplicated group activity.
 * @throws An error if the groupActivityId is not provided, if the fetch request fails, or if the response is not ok.
 */
export const duplicateGroupActivity: Action<
  string,
  Result<MetaActivity, Error>
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to duplicate it."),
    );

  const [uri, init] = apiDuplicateGroupActivity(groupActivityId);

  return Result.try(
    async () => {
      const response = await fetch(uri, init);
      if (!response.ok) {
        return new Error("Response was not ok");
      }
      return response.json();
    },
    (error) =>
      new Error(
        `Failed to unarchive group activity with ID: ${groupActivityId}`,
        {
          cause: error,
        },
      ),
  );
};
