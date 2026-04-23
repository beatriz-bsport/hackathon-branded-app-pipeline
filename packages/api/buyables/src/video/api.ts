import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type Xhr,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

import type {
  CreateVideoParams,
  FetchVideosByIdsParams,
  FetchVideosParams,
  UpdateVideoParams,
  UploadInstruction,
  UploadInstructionParams,
  Video,
} from "./types";

const API_URL = `${API_V1_URL}/vod/video`;

// #region Query Keys

export const videoKeys = {
  all: [QUERY_KEY_MAIN, "video"] as const,

  lists: () => [...videoKeys.all, "list"] as const,
  list: (params: FetchVideosParams) => [...videoKeys.lists(), params] as const,

  detail: (id: number) => [...videoKeys.all, "detail", id] as const,

  byIdsLists: () => [...videoKeys.all, "by-ids"] as const,
  byIds: (params: FetchVideosByIdsParams) =>
    [...videoKeys.byIdsLists(), params] as const,
} as const;

// #endregion

// #region List

const fetchVideosAPIConfig = (params: FetchVideosParams): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export const fetchVideosAPI = async (
  fetch: Fetch<PaginatedResponse<Video>>,
  params: FetchVideosParams,
): Promise<PaginatedResponse<Video>> => {
  const [uri, init] = fetchVideosAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const fetchVideosQueryOptions = (
  fetch: Fetch<PaginatedResponse<Video>>,
  params: FetchVideosParams,
) =>
  queryOptions({
    queryKey: videoKeys.list(params),
    queryFn: () => fetchVideosAPI(fetch, params),
  });

// #endregion

// #region Detail

const fetchVideoAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL}/${id}/`];
};

export const fetchVideoAPI = async (
  fetch: Fetch<Video>,
  params: { id: number },
): Promise<Video> => {
  const [uri, init] = fetchVideoAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const fetchVideoQueryOptions = (
  fetch: Fetch<Video>,
  params: { id: number },
) =>
  queryOptions({
    queryKey: videoKeys.detail(params.id),
    queryFn: () => fetchVideoAPI(fetch, params),
  });

// #endregion

// #region Create

const createVideoAPIConfig = (data: CreateVideoParams): XhrApiConfig => {
  return [`${API_URL}/`, { method: "POST", formData: data }];
};

export const createVideoAPI = async (
  xhr: Xhr<Video>,
  params: CreateVideoParams,
): Promise<Video> => {
  const [uri, init] = createVideoAPIConfig(params);
  const { data } = await xhr(uri, init);

  return data;
};

// #endregion

// #region Update

const updateVideoAPIConfig = ({
  id,
  data,
}: UpdateVideoParams): XhrApiConfig => {
  return [`${API_URL}/${id}/`, { method: "PATCH", formData: data }];
};

export const updateVideoAPI = async (
  xhr: Xhr<Video>,
  params: UpdateVideoParams,
): Promise<Video> => {
  const [uri, init] = updateVideoAPIConfig(params);
  const { data } = await xhr(uri, init);

  return data;
};

// #endregion

// #region Delete

const deleteVideoAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL}/${id}/`, { method: "DELETE" }];
};

export const deleteVideoAPI = async (
  fetch: Fetch<void>,
  params: { id: number },
): Promise<void> => {
  const [uri, init] = deleteVideoAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region Duplicate

const duplicateVideoAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL}/${id}/duplicate/`, { method: "POST" }];
};

export const duplicateVideoAPI = async (
  fetch: Fetch<Video>,
  params: { id: number },
): Promise<Video> => {
  const [uri, init] = duplicateVideoAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region Upload Instruction

const UploadInstructionAPIConfig = ({
  id,
  file_extension,
}: UploadInstructionParams): ApiConfig => {
  return [
    `${API_URL}/${id}/upload_instruction/`,
    {
      method: "POST",
      body: JSON.stringify(file_extension ? { file_extension } : {}),
    },
  ];
};

export const requestUploadInstructionAPI = async (
  fetch: Fetch<UploadInstruction>,
  params: UploadInstructionParams,
): Promise<UploadInstruction> => {
  const [uri, init] = UploadInstructionAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

// #endregion

// #region By Ids

const fetchVideosByIdsAPIConfig = (
  params: FetchVideosByIdsParams,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export const fetchVideosByIdsAPI = async (
  fetch: Fetch<PaginatedResponse<Video>>,
  params: FetchVideosByIdsParams,
): Promise<Video[]> => {
  if (params.id__in.length === 0) {
    return [];
  }

  const [uri, init] = fetchVideosByIdsAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data.results ?? [];
};

export const fetchVideosByIdsQueryOptions = (
  fetch: Fetch<PaginatedResponse<Video>>,
  params: FetchVideosByIdsParams,
) =>
  queryOptions({
    queryKey: videoKeys.byIds(params),
    queryFn: () => fetchVideosByIdsAPI(fetch, params),
  });

// #endregion
