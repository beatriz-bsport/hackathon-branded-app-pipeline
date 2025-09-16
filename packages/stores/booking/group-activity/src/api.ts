import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchGroupActivitiesParams,
  SearchGroupActivitiesParams,
} from "./types";

const API_URL = "book/v1/meta-activity";

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
  ...(isWorkshop !== undefined
    ? { is_workshop: isWorkshop }
    : { is_workshop: false }),
  ...(inCategoryIds && inCategoryIds.length > 0
    ? { sct__in: inCategoryIds }
    : {}),
  ...(notInCategoryIds && notInCategoryIds.length > 0
    ? { sct__not_in: notInCategoryIds }
    : {}),
  ...(inIdList && inIdList.length > 0 ? { id__in: inIdList } : {}),
});

/**
 * Fetches a paginated list of group activities based on the provided parameters.
 *
 * @param params - The parameters for fetching group activities.
 * @param params.customerEnabled - Whether customer-related activities should be included.
 * @param params.page - The current page number (by default 1).
 * @param params.pageSize - The number of items per page (by default 10).
 */
export const fetchGroupActivitiesAPI = (
  params: FetchGroupActivitiesParams,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(mapGroupActivitiesUrlParams(params))}`];
};

/**
 * Fetches a paginated list of group activities based on the provided parameters.
 *
 * @param params - The parameters for fetching group activities.
 * @param params.customerEnabled - Whether customer-related activities should be included.
 * @param params.page - The current page number (by default 1).
 * @param params.pageSize - The number of items per page (by default 10).
 */
export const searchGroupActivitiesAPI = (
  params: SearchGroupActivitiesParams,
): ApiConfig => {
  return [
    `${API_URL}/search/${buildUrlParams({
      ...mapGroupActivitiesUrlParams(params),
      q: params.searchQuery ?? "",
    })}`,
  ];
};

/**
 * Check if a group activity can be archived based on its ID
 *
 * @param groupActivityId - The ID of the group activity to be archived.
 */
export const checkCanArchiveGroupActivityAPI = (
  groupActivityId: string,
): ApiConfig => {
  return [`${API_URL}/${groupActivityId}/can_destroy/`];
};

/**
 * Archives (deletes) a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to be archived.
 */
export const archiveGroupActivityAPI = (groupActivityId: string): ApiConfig => {
  return [
    `${API_URL}/${groupActivityId}/`,
    {
      method: "DELETE",
    },
  ];
};

/**
 * Unarchive (restore) a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to be unarchived.
 */
export const unarchiveGroupActivityAPI = (
  groupActivityId: string,
): ApiConfig => {
  return [
    `${API_URL}/${groupActivityId}/restore/`,
    {
      method: "PUT",
    },
  ];
};

/**
 * Duplicates a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to duplicate.
 */
export const duplicateGroupActivityAPI = (
  groupActivityId: string,
): ApiConfig => {
  return [
    `${API_URL}/${groupActivityId}/copy/`,
    {
      method: "POST",
    },
  ];
};
