import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_URL, QUERY_KEY_MAIN } from "#src/constants";

import type {
  CreateRoleDefinitionParams,
  CreateUserRoleParams,
  PaginatedUserRoleListParams,
  Role,
  UpdateRoleDefinitionParams,
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
  paginatedList: (params: PaginatedUserRoleListParams) =>
    [...staffRoleKeys.lists(), "paginated", params] as const,
  details: () => [...staffRoleKeys.all, "detail"] as const,
  detail: (id: number) => [...staffRoleKeys.details(), id] as const,
} as const;

export const roleDefinitionKeys = {
  all: [QUERY_KEY_MAIN, "role-definition"] as const,
  lists: () => [...roleDefinitionKeys.all, "list"] as const,
  list: () => [...roleDefinitionKeys.lists()] as const,
  details: () => [...roleDefinitionKeys.all, "detail"] as const,
  detail: (id: number) => [...roleDefinitionKeys.details(), id] as const,
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

const fetchPaginatedUserRolesAPIConfig = (
  params: PaginatedUserRoleListParams,
): ApiConfig => {
  return [
    `${API_URL_USER_ROLE}/${buildUrlParams({ ...params, paginated: true })}`,
  ];
};

export const fetchPaginatedUserRolesAPI = async (
  fetch: Fetch<PaginatedResponse<UserRole>>,
  params: PaginatedUserRoleListParams,
): Promise<PaginatedResponse<UserRole>> => {
  const [uri, init] = fetchPaginatedUserRolesAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const paginatedUserRolesQueryOptions = (
  fetch: Fetch<PaginatedResponse<UserRole>>,
  params: PaginatedUserRoleListParams,
) =>
  queryOptions({
    queryKey: staffRoleKeys.paginatedList(params),
    queryFn: () => fetchPaginatedUserRolesAPI(fetch, params),
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

// #region Role Definition List

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

// #region Role Definition Detail

const fetchRoleDefinitionAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL_ROLE_DEFINITION}/${id}/`];
};

export const fetchRoleDefinitionAPI = async (
  fetch: Fetch<Role>,
  params: { id: number },
): Promise<Role> => {
  const [uri, init] = fetchRoleDefinitionAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchRoleDefinitionQueryOptions = (
  fetch: Fetch<Role>,
  params: { id: number },
) =>
  queryOptions({
    queryKey: roleDefinitionKeys.detail(params.id),
    queryFn: () => fetchRoleDefinitionAPI(fetch, params),
  });

// #endregion

// #region Role Definition Create

const createRoleDefinitionAPIConfig = (
  data: CreateRoleDefinitionParams,
): ApiConfig => {
  return [
    `${API_URL_ROLE_DEFINITION}/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  ];
};

export const createRoleDefinitionAPI = async (
  fetch: Fetch<Role>,
  params: CreateRoleDefinitionParams,
): Promise<Role> => {
  const [uri, init] = createRoleDefinitionAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region Role Definition Update

const updateRoleDefinitionAPIConfig = ({
  id,
  data,
}: UpdateRoleDefinitionParams): ApiConfig => {
  return [
    `${API_URL_ROLE_DEFINITION}/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  ];
};

export const updateRoleDefinitionAPI = async (
  fetch: Fetch<Role>,
  params: UpdateRoleDefinitionParams,
): Promise<Role> => {
  const [uri, init] = updateRoleDefinitionAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region Role Definition Delete

const deleteRoleDefinitionAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL_ROLE_DEFINITION}/${id}/`, { method: "DELETE" }];
};

export const deleteRoleDefinitionAPI = async (
  fetch: Fetch<void>,
  params: { id: number },
): Promise<void> => {
  const [uri, init] = deleteRoleDefinitionAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// #endregion
