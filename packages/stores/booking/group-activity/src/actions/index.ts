import { Result } from "typescript-result";

import {
  type CanArchiveGroupActivityResponse,
  type FetchGroupActivitiesParams,
  type MetaActivity,
  type SearchGroupActivitiesParams,
  archiveGroupActivity,
  checkCanArchiveGroupActivity,
  duplicateGroupActivity,
  fetchGroupActivities,
  fetchGroupActivitiesAndWorkshops,
  searchGroupActivities,
  unarchiveGroupActivity,
} from "@bsport/api-book";
import type {
  Action,
  PaginatedResponse,
  SearchResponse,
} from "@bsport/store-base";

import {
  setGroupActivities,
  setInterrogate,
  updateGroupActivity,
} from "./store";

export const fetchGroupActivitiesAction: Action<
  FetchGroupActivitiesParams,
  PaginatedResponse<MetaActivity>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchGroupActivities(fetch, params);

      setGroupActivities({
        groupActivities: data.results,
        count: data.count,
        page: data.page,
        search: false,
      });

      return data;
    },
    (error) => new Error("Failed to fetch group activities", { cause: error }),
  );
};

export const fetchGroupActivitiesAndWorkshopsAction: Action<
  Omit<FetchGroupActivitiesParams, "isWorkshop">,
  PaginatedResponse<MetaActivity>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchGroupActivitiesAndWorkshops(fetch, params);

      setGroupActivities({
        groupActivities: data.results,
        count: data.count,
        page: data.page,
        search: false,
      });

      return data;
    },
    (error) =>
      new Error("Failed to fetch group activities and workshops", {
        cause: error,
      }),
  );
};

export const searchGroupActivitiesAction: Action<
  SearchGroupActivitiesParams,
  SearchResponse<MetaActivity>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await searchGroupActivities(fetch, params);

      setGroupActivities({
        groupActivities: data.results,
        count: data.count,
        page: params?.page || 1,
        search: true,
      });

      return data;
    },
    (error) => new Error("Failed to search group activities", { cause: error }),
  );
};

export const checkCanArchiveGroupActivityAction: Action<
  string,
  CanArchiveGroupActivityResponse
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error(
        "A group activity Id is required to check if it can be archived.",
      ),
    );

  return Result.try(
    async () => {
      const data = await checkCanArchiveGroupActivity(fetch, groupActivityId);

      setInterrogate({
        canDestroy: data.can_destroy,
        offers: data.offers,
      });

      return data;
    },
    (error) =>
      new Error(`Failed to check group activity with ID: ${groupActivityId}`, {
        cause: error,
      }),
  );
};

export const archiveGroupActivityAction: Action<string, MetaActivity> = async (
  fetch,
  groupActivityId,
) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to archive."),
    );

  return Result.try(
    async () => {
      const data = await archiveGroupActivity(fetch, groupActivityId);

      updateGroupActivity(data);

      return data;
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

export const unarchiveGroupActivityAction: Action<
  string,
  MetaActivity
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to unarchive."),
    );

  return Result.try(
    async () => {
      const data = await unarchiveGroupActivity(fetch, groupActivityId);

      updateGroupActivity(data);

      return data;
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

export const duplicateGroupActivityAction: Action<
  string,
  MetaActivity
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to duplicate it."),
    );

  return Result.try(
    async () => {
      const data = await duplicateGroupActivity(fetch, groupActivityId);

      updateGroupActivity(data);

      return data;
    },
    (error) =>
      new Error(
        `Failed to duplicate group activity with ID: ${groupActivityId}`,
        {
          cause: error,
        },
      ),
  );
};
