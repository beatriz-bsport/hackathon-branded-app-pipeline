import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  type Xhr,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

import { API_URL, BOOKING_QUERY_KEY, DEFAULT_STALE_TIME } from "#src/constants";
import type {
  CanArchiveGroupActivityResponse,
  CreateGroupActivityPayload,
  EditGroupActivityPayload,
  FetchGroupActivitiesParams,
  GroupActivityCustomRestriction,
  MetaActivity,
  SearchGroupActivitiesParams,
} from "#src/group-activity/types";

const META_ACTIVITY_URL = API_URL + "v1/meta-activity";

export const groupActivityKeys = {
  all: [BOOKING_QUERY_KEY, "group-activities"] as const,
  detail: (id: number) => [...groupActivityKeys.all, id] as const,
  searches: () => [...groupActivityKeys.all, "search"] as const,
  search: (params: SearchGroupActivitiesParams) =>
    [...groupActivityKeys.searches(), params] as const,
};

const mapGroupActivitiesUrlParams = ({
  customerEnabled,
  page,
  pageSize,
  inCategoryIds,
  isWorkshop,
  notInCategoryIds,
  inIdList,
}: FetchGroupActivitiesParams) => ({
  ...(customerEnabled !== undefined
    ? { customer_enabled: customerEnabled }
    : {}),
  ...(page !== undefined ? { page: page } : {}),
  ...(pageSize !== undefined ? { page_size: pageSize } : {}),
  ...(isWorkshop !== undefined ? { is_workshop: isWorkshop } : {}),
  ...(inCategoryIds && inCategoryIds.length > 0
    ? { sct__in: inCategoryIds }
    : {}),
  ...(notInCategoryIds && notInCategoryIds.length > 0
    ? { sct__not_in: notInCategoryIds }
    : {}),
  ...(inIdList && inIdList.length > 0 ? { id__in: inIdList } : {}),
});

/**
 * Fetches a paginated list of group activities ONLY based on the provided parameters.
 * Use `fetchGroupActivitiesAndWorkshops` to fetch both group activities and workshops.
 *
 * @param params - The parameters for fetching group activities.
 * @param params.customerEnabled - Whether customer-related activities should be included.
 * @param params.page - The current page number (by default 1).
 * @param params.pageSize - The number of items per page (by default 10).
 */
const fetchGroupActivitiesAPI = (
  params: FetchGroupActivitiesParams,
): ApiConfig => {
  const paramsWithNoWorkshop = {
    ...params,
    isWorkshop: false,
  };
  return [
    `${META_ACTIVITY_URL}/${buildUrlParams(mapGroupActivitiesUrlParams(paramsWithNoWorkshop))}`,
  ];
};

export const fetchGroupActivities = async (
  fetch: Fetch<PaginatedResponse<MetaActivity>>,
  params: FetchGroupActivitiesParams,
): Promise<PaginatedResponse<MetaActivity>> => {
  const [uri, init] = fetchGroupActivitiesAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

/**
 * Fetches a paginated list of group activities and workshops based on the provided parameters.
 *
 * @param params - The parameters for fetching group activities.
 * @param params.customerEnabled - Whether customer-related activities should be included.
 * @param params.page - The current page number (by default 1).
 * @param params.pageSize - The number of items per page (by default 10).
 * @param params.inCategoryIds - List of category IDs to filter the group activities/workshops.
 * Only group activities/workshops belonging to these categories will be included.
 * @param params.notInCategoryIds - List of category IDs to exclude from the group activities/workshops.
 * Group activities/workshops belonging to these categories will be excluded.
 * @param params.inIdList - List of specific group activity/workshop IDs to include in the results.
 * Only group activities/workshops with these IDs will be included.
 * If undefined or empty, no filtering by IDs will be applied.
 */
const fetchGroupActivitiesAndWorkshopsAPI = (
  params: FetchGroupActivitiesParams,
): ApiConfig => {
  return [
    `${META_ACTIVITY_URL}/${buildUrlParams(mapGroupActivitiesUrlParams(params))}`,
  ];
};

export const fetchGroupActivitiesAndWorkshops = async (
  fetch: Fetch<PaginatedResponse<MetaActivity>>,
  params: FetchGroupActivitiesParams,
): Promise<PaginatedResponse<MetaActivity>> => {
  const [uri, init] = fetchGroupActivitiesAndWorkshopsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

const searchGroupActivitiesAPIConfig = (
  params: SearchGroupActivitiesParams,
): ApiConfig => {
  return [
    `${META_ACTIVITY_URL}/search/${buildUrlParams({
      ...mapGroupActivitiesUrlParams({ ...params, isWorkshop: false }),
      q: params.searchQuery ?? "",
    })}`,
  ];
};

/**
 * Searches a paginated list of group activities ONLY based on the provided parameters.
 * Use `searchGroupActivitiesAndWorkshops` to search both group activities and workshops.
 *
 * @param params - The parameters for searching group activities.
 */
export const searchGroupActivitiesAPI = async (
  fetch: Fetch<SearchResponse<MetaActivity>>,
  params: SearchGroupActivitiesParams,
): Promise<SearchResponse<MetaActivity>> => {
  const [uri, init] = searchGroupActivitiesAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

const searchGroupActivitiesAndWorkshopsAPIConfig = (
  params: SearchGroupActivitiesParams,
): ApiConfig => {
  return [
    `${META_ACTIVITY_URL}/search/${buildUrlParams({
      ...mapGroupActivitiesUrlParams(params),
      q: params.searchQuery ?? "",
    })}`,
  ];
};

/**
 * Searches a paginated list of group activities and workshops based on the provided parameters.
 *
 * @param params - The parameters for searching group activities.
 */
export const searchGroupActivitiesAndWorkshopsAPI = async (
  fetch: Fetch<SearchResponse<MetaActivity>>,
  params: SearchGroupActivitiesParams,
): Promise<SearchResponse<MetaActivity>> => {
  const [uri, init] = searchGroupActivitiesAndWorkshopsAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};
/**
 * Check if a group activity can be archived based on its ID
 *
 * @param groupActivityId - The ID of the group activity to be archived.
 */
const checkCanArchiveGroupActivityAPI = (
  groupActivityId: string,
): ApiConfig => {
  return [`${META_ACTIVITY_URL}/${groupActivityId}/can_destroy/`];
};

export const checkCanArchiveGroupActivity = async (
  fetch: Fetch<CanArchiveGroupActivityResponse>,
  groupActivityId: string,
): Promise<CanArchiveGroupActivityResponse> => {
  const [uri, init] = checkCanArchiveGroupActivityAPI(groupActivityId);
  const { data } = await fetch(uri, init);

  return data;
};

/**
 * Archives (deletes) a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to be archived.
 */
const archiveGroupActivityAPI = (groupActivityId: string): ApiConfig => {
  return [
    `${META_ACTIVITY_URL}/${groupActivityId}/`,
    {
      method: "DELETE",
    },
  ];
};

export const archiveGroupActivity = async (
  fetch: Fetch<MetaActivity>,
  groupActivityId: string,
): Promise<MetaActivity> => {
  const [uri, init] = archiveGroupActivityAPI(groupActivityId);
  const { data } = await fetch(uri, init);
  return data;
};

/**
 * Unarchive (restore) a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to be unarchived.
 */
const unarchiveGroupActivityAPI = (groupActivityId: string): ApiConfig => {
  return [
    `${META_ACTIVITY_URL}/${groupActivityId}/restore/`,
    {
      method: "PUT",
    },
  ];
};

export const unarchiveGroupActivity = async (
  fetch: Fetch<MetaActivity>,
  groupActivityId: string,
): Promise<MetaActivity> => {
  const [uri, init] = unarchiveGroupActivityAPI(groupActivityId);
  const { data } = await fetch(uri, init);

  return data;
};

/**
 * Duplicates a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to duplicate.
 */
const duplicateGroupActivityAPI = (groupActivityId: string): ApiConfig => {
  return [
    `${META_ACTIVITY_URL}/${groupActivityId}/copy/`,
    {
      method: "POST",
    },
  ];
};

export const duplicateGroupActivity = async (
  fetch: Fetch<MetaActivity>,
  groupActivityId: string,
): Promise<MetaActivity> => {
  const [uri, init] = duplicateGroupActivityAPI(groupActivityId);
  const { data } = await fetch(uri, init);
  return data;
};

export const retrieveGroupActivity = async (
  fetch: Fetch<MetaActivity>,
  metaActivityId: number,
): Promise<MetaActivity> => {
  const { data } = await fetch(`${META_ACTIVITY_URL}/${metaActivityId}/`);
  return data;
};

export const retrieveGroupActivityQueryOptions = (
  fetch: Fetch<MetaActivity>,
  metaActivityId: number,
) =>
  queryOptions({
    queryKey: groupActivityKeys.detail(metaActivityId),
    queryFn: () => retrieveGroupActivity(fetch, metaActivityId),
    staleTime: DEFAULT_STALE_TIME,
  });

export const searchGroupActivitiesQueryOptions = (
  fetch: Fetch<SearchResponse<MetaActivity>>,
  params: SearchGroupActivitiesParams,
) =>
  queryOptions({
    queryKey: groupActivityKeys.search(params),
    queryFn: () => searchGroupActivitiesAPI(fetch, params),
    staleTime: DEFAULT_STALE_TIME,
  });

export const searchGroupActivitiesAndWorkshopsQueryOptions = (
  fetch: Fetch<SearchResponse<MetaActivity>>,
  params: SearchGroupActivitiesParams,
) =>
  queryOptions({
    queryKey: groupActivityKeys.search(params), // using same query key as searchGroupActivitiesQueryOptions
    queryFn: () => searchGroupActivitiesAndWorkshopsAPI(fetch, params),
    staleTime: DEFAULT_STALE_TIME,
  });

const appendFormDataValue = (
  formData: FormData,
  key: string,
  value: string | number | boolean | Blob,
) => {
  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  formData.append(key, String(value));
};

const serializeCustomRestrictionRule = (
  customRestrictionRule: GroupActivityCustomRestriction[],
): string => JSON.stringify(customRestrictionRule);

const toGroupActivityFormData = (
  data: CreateGroupActivityPayload | EditGroupActivityPayload,
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (value === null) {
      formData.append(key, "");
      return;
    }

    if (key === "custom_restriction_rule") {
      formData.append(
        key,
        serializeCustomRestrictionRule(
          value as GroupActivityCustomRestriction[],
        ),
      );
      return;
    }

    if (key === "images") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        appendFormDataValue(
          formData,
          key,
          typeof item === "object" ? JSON.stringify(item) : item,
        );
      });
      return;
    }

    appendFormDataValue(formData, key, value);
  });

  return formData;
};

// Create use multipart because cover_main is a file upload.
// We intentionally use Xhr + FormData here instead of Fetch + JSON so the class form
// has a single transport path. Non-scalar fields such as custom_restriction_rule must
// be serialized in one place to keep the public API typed.
const createGroupActivityAPIConfig = (data: FormData): XhrApiConfig => {
  return [
    `${META_ACTIVITY_URL}/`,
    {
      method: "POST",
      formData: data,
    },
  ];
};

export const createGroupActivity = async (
  xhr: Xhr<MetaActivity>,
  data: CreateGroupActivityPayload,
): Promise<MetaActivity> => {
  const [uri, init] = createGroupActivityAPIConfig(
    toGroupActivityFormData(data),
  );
  const { data: result } = await xhr(uri, init);
  return result;
};

// Edit use multipart because cover_main is a file upload.
// We intentionally use Xhr + FormData here instead of Fetch + JSON so the class form
// has a single transport path. Non-scalar fields such as custom_restriction_rule must
// be serialized in one place to keep the public API typed.
const editGroupActivityAPIConfig = (
  groupActivityId: number,
  data: FormData,
): XhrApiConfig => {
  return [
    `${META_ACTIVITY_URL}/${groupActivityId}/`,
    {
      method: "PATCH",
      formData: data,
    },
  ];
};

export const editGroupActivity = async (
  xhr: Xhr<MetaActivity>,
  groupActivityId: number,
  data: EditGroupActivityPayload,
): Promise<MetaActivity> => {
  const [uri, init] = editGroupActivityAPIConfig(
    groupActivityId,
    toGroupActivityFormData(data),
  );
  const { data: result } = await xhr(uri, init);
  return result;
};
