import { type ApiConfig, buildUrlParams } from "@bsport/store-base";
import type { Establishment } from "@bsport/store-core-data-establishment";
import type { Teacher } from "@bsport/store-core-data-teacher";

import { fetch } from "#src/utils/fetch";

const API_URL = "book/v1";
const API_URL_SESSION = `${API_URL}/offer`;
const CORE_DATA_API_URL = "core-data/v1";
const API_URL_ASSOCIATED_COACH = `${CORE_DATA_API_URL}/associated_coach`;
const API_URL_ESTABLISHMENT = `${CORE_DATA_API_URL}/establishment`;

type FetchSessionsParams = {
  min_date: string;
  max_date: string;
};

export const fetchManagerSessionsAPI = (
  params: FetchSessionsParams,
): ApiConfig => {
  return [`${API_URL_SESSION}/as_manager/${buildUrlParams(params)}`];
};

export const fetchTeachers = async (
  teacherIds: number[],
): Promise<Teacher[]> => {
  const uri = `${API_URL_ASSOCIATED_COACH}/${buildUrlParams({ id__in: teacherIds })}`;
  const { data } = await fetch<Teacher[]>(uri);
  return data;
};

export const fetchEstablishments = async (
  establishmentIds: number[],
): Promise<Establishment[]> => {
  const uri = `${API_URL_ESTABLISHMENT}/${buildUrlParams({ id__in: establishmentIds })}`;
  const { data } = await fetch<{ results: Establishment[] }>(uri);
  return data.results;
};
