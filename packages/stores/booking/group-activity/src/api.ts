import { getAuthToken } from "@bsport/b2b-backbone";
import { buildUrlParams } from "@bsport/fetch";
import type { ApiConfig } from "@bsport/store-base";
import type { FetchGroupActivitiesParams } from "#src/types";
import { DEFAULT_CURRENT_PAGE, DEFAULT_ROWS_PER_PAGE } from "#src/constants";

const BASE_URL = "book/v1/meta-activity/";

/**
 * Fetches a paginated list of group activities based on the provided parameters.
 *
 * @param params - The parameters for fetching group activities.
 * @param params.customerEnabled - Whether customer-related activities should be included.
 * @param params.page - The current page number (by default 1).
 * @param params.pageSize - The number of items per page (by default 10).
 */
export const fetchGroupActivities = ({
  page,
  pageSize,
  customerEnabled,
}: FetchGroupActivitiesParams): ApiConfig => {
  const params = {
    customer_enabled: customerEnabled,
    page: page || DEFAULT_CURRENT_PAGE,
    page_size: pageSize || DEFAULT_ROWS_PER_PAGE,
    is_workshop: false,
  };
  return [
    `${BASE_URL}${buildUrlParams(params)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${getAuthToken()}`,
      },
    },
  ];
};

/**
 * Check if a group activity can be archived based on its ID
 *
 * @param groupActivityId - The ID of the group activity to be archived.
 */
export const checkCanArchiveGroupActivity = (
  groupActivityId: string,
): ApiConfig => {
  return [
    `${BASE_URL}${groupActivityId}/can_destroy/`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${getAuthToken()}`,
      },
    },
  ];
};

/**
 * Archives (deletes) a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to be archived.
 */
export const archiveGroupActivity = (groupActivityId: string): ApiConfig => {
  return [
    `${BASE_URL}${groupActivityId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${getAuthToken()}`,
      },
    },
  ];
};

/**
 * Unarchive (restore) a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to be unarchived.
 */
export const unarchiveGroupActivity = (groupActivityId: string): ApiConfig => {
  return [
    `${BASE_URL}${groupActivityId}/restore/`,
    {
      method: "PUT",
      headers: {
        Authorization: `Token ${getAuthToken()}`,
      },
    },
  ];
};

/**
 * Duplicates a group activity by its ID.
 *
 * @param groupActivityId - The ID of the group activity to duplicate.
 */
export const duplicateGroupActivity = (groupActivityId: string): ApiConfig => {
  return [
    `${BASE_URL}${groupActivityId}/copy/`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${getAuthToken()}`,
      },
    },
  ];
};
