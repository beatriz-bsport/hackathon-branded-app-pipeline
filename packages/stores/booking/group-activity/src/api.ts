import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "book/v1/meta-activity";

export type FetchGroupActivitiesParams = {
  page: number;
  pageSize: number;
  customerEnabled: boolean; // if false, the endpoint should return the archived group activities
};

/**
 * Fetches a paginated list of group activities based on the provided parameters.
 *
 * @param params - The parameters for fetching group activities.
 * @param params.customerEnabled - Whether customer-related activities should be included.
 * @param params.page - The current page number (by default 1).
 * @param params.pageSize - The number of items per page (by default 10).
 */
export const fetchGroupActivitiesAPI = ({
  page,
  pageSize,
  customerEnabled,
}: FetchGroupActivitiesParams): ApiConfig => {
  const params = {
    customer_enabled: customerEnabled,
    page: page,
    page_size: pageSize,
    is_workshop: false,
  };
  return [`${API_URL}${buildUrlParams(params)}`];
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
