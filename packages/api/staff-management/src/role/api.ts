import { type Fetch, buildUrlParams } from "@bsport/store-base";

import { API_URL, QUERY_KEY_MAIN } from "#src/constants";

import { UserRole, UserRoleListParams } from "./types";

const API_URL_ROLE = `${API_URL}/role`;
const API_URL_USER_ROLE = `${API_URL_ROLE}/user`;

export const staffRoleKeys = {
  all: [QUERY_KEY_MAIN, "role"] as const,
  lists: () => [...staffRoleKeys.all, "list"] as const,
  list: (params: UserRoleListParams = {}) =>
    [...staffRoleKeys.lists(), params] as const,
} as const;

export const fetchFlatUserRolesAPI = async (
  fetch: Fetch<UserRole[]>,
  params: UserRoleListParams = {},
): Promise<UserRole[]> => {
  const { data } = await fetch(
    `${API_URL_USER_ROLE}/${buildUrlParams(params)}`,
  );
  return data;
};

export const flatUserRolesQueryOption = (
  fetch: Fetch<UserRole[]>,
  params: UserRoleListParams = {},
) => ({
  queryKey: staffRoleKeys.list(params),
  queryFn: () => fetchFlatUserRolesAPI(fetch, params),
});
