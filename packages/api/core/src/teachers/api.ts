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
  Teacher,
} from "#src/teachers/types";

import { API_V1_URL } from "../constants";

const API_URL_COACH = `${API_V1_URL}/coach`;
const API_URL_ASSOCIATED_COACH = `${API_V1_URL}/associated_coach`;

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
