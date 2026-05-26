import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  type Xhr,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  CheckDeleteEstablishmentData,
  CreateEstablishmentPayload,
  Establishment,
  FetchEstablishmentParams,
  SearchEstablishmentParams,
  UpdateEstablishmentPayload,
} from "#src/establishments/types";

import {
  API_V1_URL,
  BOOKING_QUERY_KEY,
  DEFAULT_STALE_TIME,
} from "../constants";

// ----------------------------------------------------------------------------

const ESTABLISHMENT_API_URL = `${API_V1_URL}/establishment`;

export const establishmentKeys = {
  all: [BOOKING_QUERY_KEY, "establishments"] as const,

  lists: () => [...establishmentKeys.all, "lists"] as const,
  list: (params: FetchEstablishmentParams) =>
    [...establishmentKeys.lists(), params] as const,

  infiniteLists: () => [...establishmentKeys.lists(), "infinite"] as const,
  infiniteList: (params: FetchEstablishmentParams) =>
    [...establishmentKeys.infiniteLists(), params] as const,

  searches: () => [...establishmentKeys.lists(), "search"] as const,
  search: (params: SearchEstablishmentParams) =>
    [...establishmentKeys.searches(), params] as const,

  details: () => [...establishmentKeys.all, "detail"] as const,
  detail: (id: number) => [...establishmentKeys.details(), id] as const,

  checkDeletion: (id: number) =>
    [...establishmentKeys.all, "check-deletion", id] as const,
};

// ----------------------------------------------------------------------------

const fetchEstablishmentsAPI = (
  params: FetchEstablishmentParams = {},
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/${buildUrlParams(params)}`];
};

export const fetchEstablishments = async (
  fetch: Fetch<PaginatedResponse<Establishment>>,
  params: FetchEstablishmentParams = {},
): Promise<PaginatedResponse<Establishment>> => {
  const [uri, init] = fetchEstablishmentsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const fetchEstablishmentsQueryOptions = (
  fetch: Fetch<PaginatedResponse<Establishment>>,
  params: FetchEstablishmentParams = {},
) => {
  const queryFn = fetchEstablishments.bind(null, fetch, params);
  return queryOptions({
    queryKey: establishmentKeys.list(params),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const fetchEstablishmentsInfiniteQueryOptions = (
  fetch: Fetch<PaginatedResponse<Establishment>>,
  params: FetchEstablishmentParams = {},
) => {
  return infiniteQueryOptions({
    queryKey: establishmentKeys.infiniteList(params),
    queryFn: ({ pageParam }) => {
      return fetchEstablishments(fetch, { ...params, page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    enabled: Boolean(params.company && params.company > 0),
    staleTime: DEFAULT_STALE_TIME,
  });
};

// ----------------------------------------------------------------------------

const searchEstablishmentsAPI = (
  params: SearchEstablishmentParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/search/${buildUrlParams(params)}`];
};

export const searchEstablishments = async (
  fetch: Fetch<SearchResponse<Establishment>>,
  params: SearchEstablishmentParams,
): Promise<SearchResponse<Establishment>> => {
  const [uri, init] = searchEstablishmentsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const searchEstablishmentsQueryOptions = (
  fetch: Fetch<SearchResponse<Establishment>>,
  params: SearchEstablishmentParams,
) => {
  const queryFn = searchEstablishments.bind(null, fetch, params);
  return queryOptions({
    queryKey: establishmentKeys.search(params),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

// ----------------------------------------------------------------------------

export const retrieveEstablishment = async (
  fetch: Fetch<Establishment>,
  establishmentId: number,
): Promise<Establishment> => {
  const { data } = await fetch(`${ESTABLISHMENT_API_URL}/${establishmentId}/`);
  return data;
};

export const retrieveEstablishmentQueryOptions = (
  fetch: Fetch<Establishment>,
  establishmentId: number,
) => {
  const queryFn = retrieveEstablishment.bind(null, fetch, establishmentId);
  return queryOptions({
    queryKey: establishmentKeys.detail(establishmentId),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

// ----------------------------------------------------------------------------

const appendFormDataValue = (
  formData: FormData,
  key: string,
  value: string | number | boolean | Blob,
) => {
  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }
  formData.append(key, String(value));
};

const toEstablishmentFormData = (
  payload: CreateEstablishmentPayload | UpdateEstablishmentPayload,
): FormData => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    // cover is a file field: only send it when an actual File was picked.
    if (key === "cover") {
      if (value instanceof Blob) {
        formData.append(key, value);
      }
      return;
    }
    if (value === null) {
      formData.append(key, "");
      return;
    }
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }
    appendFormDataValue(formData, key, value);
  });

  return formData;
};

// Create uses multipart because cover is a file upload. We use Xhr + FormData
// instead of Fetch + JSON so the cover File and the nested location object share
// a single transport path (location serialized as a JSON string).
const createEstablishmentAPIConfig = (data: FormData): XhrApiConfig => {
  return [
    `${ESTABLISHMENT_API_URL}/`,
    {
      method: "POST",
      formData: data,
    },
  ];
};

export const createEstablishment = async (
  xhr: Xhr<Establishment>,
  payload: CreateEstablishmentPayload,
): Promise<Establishment> => {
  const [uri, init] = createEstablishmentAPIConfig(
    toEstablishmentFormData(payload),
  );
  const { data } = await xhr(uri, init);
  return data;
};

export const createEstablishmentMutationOptions = (xhr: Xhr<Establishment>) =>
  mutationOptions({
    mutationFn: (payload: CreateEstablishmentPayload) =>
      createEstablishment(xhr, payload),
  });

// ----------------------------------------------------------------------------

// Update uses multipart for the same reason as create (cover file + location
// JSON). A string cover means "keep the existing image" and is dropped by
// toEstablishmentFormData; a File replaces it.
const updateEstablishmentAPIConfig = (
  id: number,
  data: FormData,
): XhrApiConfig => {
  return [
    `${ESTABLISHMENT_API_URL}/${id}/`,
    {
      method: "PUT",
      formData: data,
    },
  ];
};

export const updateEstablishment = async (
  xhr: Xhr<Establishment>,
  id: number,
  payload: UpdateEstablishmentPayload,
): Promise<Establishment> => {
  const [uri, init] = updateEstablishmentAPIConfig(
    id,
    toEstablishmentFormData(payload),
  );
  const { data } = await xhr(uri, init);
  return data;
};

export const updateEstablishmentMutationOptions = (xhr: Xhr<Establishment>) =>
  mutationOptions({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateEstablishmentPayload;
    }) => updateEstablishment(xhr, id, payload),
  });

// ----------------------------------------------------------------------------

export const checkDeleteEstablishment = async (
  fetch: Fetch<CheckDeleteEstablishmentData>,
  id: number,
): Promise<CheckDeleteEstablishmentData> => {
  const { data } = await fetch(
    `${ESTABLISHMENT_API_URL}/${id}/check_before_deletion/`,
  );
  return data;
};

export const checkDeleteEstablishmentQueryOptions = (
  fetch: Fetch<CheckDeleteEstablishmentData>,
  id: number,
) => {
  const queryFn = checkDeleteEstablishment.bind(null, fetch, id);
  return queryOptions({
    queryKey: establishmentKeys.checkDeletion(id),
    queryFn,
  });
};

// ----------------------------------------------------------------------------

export const deleteEstablishment = async (
  fetch: Fetch<void>,
  id: number,
): Promise<void> => {
  await fetch(
    `${ESTABLISHMENT_API_URL}/${id}/perform_destroy_with_side_effects/`,
    { method: "DELETE" },
  );
};

export const deleteEstablishmentMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (id: number) => deleteEstablishment(fetch, id),
  });

// ----------------------------------------------------------------------------

export const restoreEstablishment = async (
  fetch: Fetch<Establishment>,
  id: number,
): Promise<Establishment> => {
  const { data } = await fetch(`${ESTABLISHMENT_API_URL}/${id}/restore/`, {
    method: "PUT",
  });
  return data;
};

export const restoreEstablishmentMutationOptions = (
  fetch: Fetch<Establishment>,
) =>
  mutationOptions({
    mutationFn: (id: number) => restoreEstablishment(fetch, id),
  });
