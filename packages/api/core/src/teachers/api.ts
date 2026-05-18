import { mutationOptions, queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  FetchTeachersParams,
  FuzzySearchTeacherParams,
  PaginatedFetchTeachersParams,
  ReplacementRequestConfiguration,
  Teacher,
  UpdateReplacementRequestConfigurationParams,
} from "#src/teachers/types";

import { API_V1_URL } from "../constants";

const API_URL_COACH = `${API_V1_URL}/coach`;
const API_URL_ASSOCIATED_COACH = `${API_V1_URL}/associated_coach`;
const API_URL_REPLACEMENT_REQUEST_CONFIGURATION =
  "book/v1/replacement_request/configuration";

// TODO: Use the teacherKeys and TEACHERS_STALE_TIME in the react-query hooks to ensure consistency in query keys across the app
const TEACHERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const teacherKeys = {
  all: ["@api-core", "teacher"] as const,
  list: (params: FetchTeachersParams = {}) =>
    [...teacherKeys.all, "list", params] as const,
  company: (companyId: number | undefined, params: FetchTeachersParams = {}) =>
    [...teacherKeys.all, "company", companyId, params] as const,
  detail: (teacherId: number) => [...teacherKeys.all, teacherId] as const,
  replacementRequestConfiguration: () =>
    [...teacherKeys.all, "replacement-request-configuration"] as const,
  search: (params: FetchTeachersParams = {}) =>
    [...teacherKeys.all, "search", params] as const,
} as const;

const fetchTeachersAPIConfig = (
  params: PaginatedFetchTeachersParams | FetchTeachersParams,
): ApiConfig => {
  return [`${API_URL_ASSOCIATED_COACH}/${buildUrlParams(params)}`];
};

const paginatedfetchTeachersAPIConfig = (
  params: PaginatedFetchTeachersParams,
): ApiConfig => {
  const { page, page_size, ...otherParams } = params;

  const finalParams = { ...otherParams, page, page_size, paginated: true };

  return fetchTeachersAPIConfig(finalParams);
};

export const fetchPaginatedTeachers = async (
  fetch: Fetch<PaginatedResponse<Teacher>>,
  params: PaginatedFetchTeachersParams,
): Promise<PaginatedResponse<Teacher>> => {
  const [uri, init] = paginatedfetchTeachersAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchFlatTeachers = async (
  fetch: Fetch<Teacher[]>,
  params: FetchTeachersParams,
): Promise<Teacher[]> => {
  const [uri, init] = fetchTeachersAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

const fuzzySearchTeachersAPIConfig = (
  params: FuzzySearchTeacherParams,
): ApiConfig => {
  const { queryString, ...otherParams } = params;
  return [
    `${API_URL_ASSOCIATED_COACH}/search/${buildUrlParams({ ...otherParams, q: queryString ?? "" })}`,
  ];
};

export const fuzzySearchTeachers = async (
  fetch: Fetch<PaginatedResponse<Teacher>>,
  params: FuzzySearchTeacherParams,
): Promise<PaginatedResponse<Teacher>> => {
  const [uri, init] = fuzzySearchTeachersAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

const archiveTeacherAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL_COACH}/${id}`,
    {
      method: "DELETE",
    },
  ];
};

export const archiveTeacher = async (
  fetch: Fetch<Teacher>,
  { id }: { id: number },
): Promise<Teacher> => {
  const [uri, init] = archiveTeacherAPIConfig({ id });

  const { data } = await fetch(uri, init);

  return data;
};

const restoreTeacherAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL_ASSOCIATED_COACH}/${id}/restore/`,
    {
      method: "PUT",
    },
  ];
};

export const restoreTeacher = async (
  fetch: Fetch<Teacher>,
  { id }: { id: number },
): Promise<Teacher> => {
  const [uri, init] = restoreTeacherAPIConfig({ id });

  const { data } = await fetch(uri, init);

  return data;
};

const linkByEmailAPIConfig = ({ email }: { email: string }): ApiConfig => {
  return [
    `${API_URL_COACH}/link_by_email/`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  ];
};

export const linkTeacherByEmail = async (
  fetch: Fetch<Teacher>,
  { email }: { email: string },
): Promise<Teacher> => {
  const [uri, init] = linkByEmailAPIConfig({ email });

  const { data } = await fetch(uri, init);

  return data;
};

export const retrieveTeacher = async (
  fetch: Fetch<Teacher>,
  teacherId: number,
): Promise<Teacher> => {
  const { data } = await fetch(`${API_URL_ASSOCIATED_COACH}/${teacherId}/`);

  return data;
};

export const retrieveTeacherQueryOptions = (
  fetch: Fetch<Teacher>,
  teacherId: number,
) => {
  const queryFn = retrieveTeacher.bind(null, fetch, teacherId);

  return queryOptions({
    queryKey: teacherKeys.detail(teacherId),
    queryFn,
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const retrieveReplacementRequestConfiguration = async (
  fetch: Fetch<ReplacementRequestConfiguration>,
): Promise<ReplacementRequestConfiguration> => {
  const { data } = await fetch(
    `${API_URL_REPLACEMENT_REQUEST_CONFIGURATION}/me/`,
  );

  return data;
};

export const retrieveReplacementRequestConfigurationQueryOptions = (
  fetch: Fetch<ReplacementRequestConfiguration>,
) => {
  const queryFn = retrieveReplacementRequestConfiguration.bind(null, fetch);

  return queryOptions({
    queryKey: teacherKeys.replacementRequestConfiguration(),
    queryFn,
    staleTime: TEACHERS_STALE_TIME,
  });
};

export const updateReplacementRequestConfigurationAPI = ({
  companyId,
  data,
}: UpdateReplacementRequestConfigurationParams): ApiConfig => {
  return [
    `${API_URL_REPLACEMENT_REQUEST_CONFIGURATION}/${companyId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  ];
};

export const updateReplacementRequestConfigurationAPIRequest = async (
  fetch: Fetch<ReplacementRequestConfiguration>,
  params: UpdateReplacementRequestConfigurationParams,
): Promise<ReplacementRequestConfiguration> => {
  const [uri, init] = updateReplacementRequestConfigurationAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const updateReplacementRequestConfigurationMutationOptions = (
  fetch: Fetch<ReplacementRequestConfiguration>,
) =>
  mutationOptions({
    mutationFn: (params: UpdateReplacementRequestConfigurationParams) =>
      updateReplacementRequestConfigurationAPIRequest(fetch, params),
  });
