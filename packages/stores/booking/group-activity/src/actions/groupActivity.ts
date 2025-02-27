import { Result } from "typescript-result";

import {
  fetchGroupActivities as apiFetchGroupActivities,
  archiveGroupActivity as apiArchiveGroupActivity,
  unarchiveGroupActivity as apiUnarchiveGroupActivity,
  duplicateGroupActivity as apiDuplicateGroupActivity,
  checkCanArchiveGroupActivity as apiCheckCanArchiveGroupActivity,
} from "#src/api";

import type { GenericAction } from "@bsport/store-base";
import type {
  CanArchiveGroupActivityResponse,
  FetchGroupActivitiesParams,
  MetaActivity,
  PaginatedResponse,
} from "#src/types";

export const fetchGroupActivities: GenericAction<
  FetchGroupActivitiesParams,
  PaginatedResponse<MetaActivity>
> = async (fetch, params) => {
  const [uri, init] = apiFetchGroupActivities(params);

  return Result.try(
    async () => {
      return (await fetch<PaginatedResponse<MetaActivity>>(uri, init)).data;
    },
    (error) => new Error("Failed to fetch group activities", { cause: error }),
  );
};

export const checkCanArchiveGroupActivity: GenericAction<
  string,
  CanArchiveGroupActivityResponse
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
      return (await fetch<CanArchiveGroupActivityResponse>(uri, init)).data;
    },
    (error) =>
      new Error(`Failed to check group activity with ID: ${groupActivityId}`, {
        cause: error,
      }),
  );
};

export const archiveGroupActivity: GenericAction<string, MetaActivity> = async (
  fetch,
  groupActivityId,
) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to archive."),
    );

  const [uri, init] = apiArchiveGroupActivity(groupActivityId);

  return Result.try(
    async () => {
      return (await fetch<MetaActivity>(uri, init)).data;
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

export const unarchiveGroupActivity: GenericAction<
  string,
  MetaActivity
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to unarchive."),
    );

  const [uri, init] = apiUnarchiveGroupActivity(groupActivityId);

  return Result.try(
    async () => {
      return (await fetch<MetaActivity>(uri, init)).data;
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

export const duplicateGroupActivity: GenericAction<
  string,
  MetaActivity
> = async (fetch, groupActivityId) => {
  if (!groupActivityId)
    return Result.error(
      new Error("A group activity Id is required to duplicate it."),
    );

  const [uri, init] = apiDuplicateGroupActivity(groupActivityId);

  return Result.try(
    async () => {
      return (await fetch<MetaActivity>(uri, init)).data;
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
