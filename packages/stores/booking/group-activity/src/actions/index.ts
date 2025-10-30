import { Result } from "typescript-result";

import type {
  Action,
  PaginatedResponse,
  SearchResponse,
} from "@bsport/store-base";

import {
  archiveGroupActivityAPI,
  checkCanArchiveGroupActivityAPI,
  duplicateGroupActivityAPI,
  fetchGroupActivitiesAPI,
  fetchGroupActivitiesAndWorkshopsAPI,
  searchGroupActivitiesAPI,
  unarchiveGroupActivityAPI,
} from "#src/api";
import type {
  FetchGroupActivitiesParams,
  MetaActivity,
  SearchGroupActivitiesParams,
} from "#src/types";

import {
  setGroupActivities,
  setInterrogate,
  updateGroupActivity,
} from "./store";

export const fetchGroupActivitiesAction: Action<
  FetchGroupActivitiesParams,
  PaginatedResponse<MetaActivity>
> = async (fetch, params) => {
  const [uri, init] = fetchGroupActivitiesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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
  const [uri, init] = fetchGroupActivitiesAndWorkshopsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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
  const [uri, init] = searchGroupActivitiesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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

type CanArchiveGroupActivityResponse = {
  can_destroy: boolean;
  offers: number[];
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

  const [uri, init] = checkCanArchiveGroupActivityAPI(groupActivityId);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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

  const [uri, init] = archiveGroupActivityAPI(groupActivityId);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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

  const [uri, init] = unarchiveGroupActivityAPI(groupActivityId);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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

  const [uri, init] = duplicateGroupActivityAPI(groupActivityId);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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
