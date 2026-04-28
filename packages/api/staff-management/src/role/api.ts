import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import { API_URL, QUERY_KEY_MAIN } from "#src/constants";

import type {
  CreateUserRoleParams,
  Role,
  UpdateUserRoleParams,
  UserRole,
  UserRoleListParams,
} from "./types";

const API_URL_ROLE = `${API_URL}/role`;
const API_URL_USER_ROLE = `${API_URL_ROLE}/user`;
const API_URL_ROLE_DEFINITION = `${API_URL_ROLE}/role`;

// #region Query Keys

export const staffRoleKeys = {
  all: [QUERY_KEY_MAIN, "role"] as const,
  lists: () => [...staffRoleKeys.all, "list"] as const,
  list: (params: UserRoleListParams = {}) =>
    [...staffRoleKeys.lists(), params] as const,
  details: () => [...staffRoleKeys.all, "detail"] as const,
  detail: (id: number) => [...staffRoleKeys.details(), id] as const,
} as const;

export const roleDefinitionKeys = {
  all: [QUERY_KEY_MAIN, "role-definition"] as const,
  lists: () => [...roleDefinitionKeys.all, "list"] as const,
  list: () => [...roleDefinitionKeys.lists()] as const,
} as const;

// #endregion

// #region Staff List

const fetchFlatUserRolesAPIConfig = (params: UserRoleListParams): ApiConfig => {
  return [`${API_URL_USER_ROLE}/${buildUrlParams(params)}`];
};

export const fetchFlatUserRolesAPI = async (
  fetch: Fetch<UserRole[]>,
  params: UserRoleListParams = {},
): Promise<UserRole[]> => {
  const [uri, init] = fetchFlatUserRolesAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const flatUserRolesQueryOptions = (
  fetch: Fetch<UserRole[]>,
  params: UserRoleListParams = {},
) =>
  queryOptions({
    queryKey: staffRoleKeys.list(params),
    queryFn: () => fetchFlatUserRolesAPI(fetch, params),
  });

// #endregion

// #region Staff Detail

const fetchUserRoleAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL_USER_ROLE}/${id}/`];
};

export const fetchUserRoleAPI = async (
  fetch: Fetch<UserRole>,
  params: { id: number },
): Promise<UserRole> => {
  const [uri, init] = fetchUserRoleAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchUserRoleQueryOptions = (
  fetch: Fetch<UserRole>,
  params: { id: number },
) =>
  queryOptions({
    queryKey: staffRoleKeys.detail(params.id),
    queryFn: () => fetchUserRoleAPI(fetch, params),
  });

// #endregion

// #region Staff Create

const createUserRoleAPIConfig = (data: CreateUserRoleParams): ApiConfig => {
  return [
    `${API_URL_USER_ROLE}/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  ];
};

export const createUserRoleAPI = async (
  fetch: Fetch<UserRole>,
  params: CreateUserRoleParams,
): Promise<UserRole> => {
  const [uri, init] = createUserRoleAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region Staff Update

const updateUserRoleAPIConfig = ({
  id,
  data,
}: UpdateUserRoleParams): ApiConfig => {
  return [
    `${API_URL_USER_ROLE}/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  ];
};

export const updateUserRoleAPI = async (
  fetch: Fetch<UserRole>,
  params: UpdateUserRoleParams,
): Promise<UserRole> => {
  const [uri, init] = updateUserRoleAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region Staff Delete

const deleteUserRoleAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL_USER_ROLE}/${id}/`, { method: "DELETE" }];
};

export const deleteUserRoleAPI = async (
  fetch: Fetch<void>,
  params: { id: number },
): Promise<void> => {
  const [uri, init] = deleteUserRoleAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region Role Definitions

const fetchRoleDefinitionsAPIConfig = (): ApiConfig => {
  return [`${API_URL_ROLE_DEFINITION}/`];
};

export const fetchRoleDefinitionsAPI = async (
  fetch: Fetch<Role[]>,
): Promise<Role[]> => {
  const [uri, init] = fetchRoleDefinitionsAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchRoleDefinitionsQueryOptions = (fetch: Fetch<Role[]>) =>
  queryOptions({
    queryKey: roleDefinitionKeys.list(),
    queryFn: () => fetchRoleDefinitionsAPI(fetch),
  });

// #endregion
