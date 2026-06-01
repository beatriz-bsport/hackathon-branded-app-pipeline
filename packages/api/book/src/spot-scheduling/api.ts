import { mutationOptions, queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, DEFAULT_STALE_TIME } from "#src/constants";

import type {
  AssetForBlueprint,
  AssetsForBlueprintFilters,
  RoomBlueprint,
  RoomBlueprintCreatePayload,
  RoomBlueprintFilters,
  SpotType,
  SpotTypesFilters,
} from "./types";

const API_URL_SPOT_SCHEDULING = `${API_V1_URL}/spot-scheduling`;
const API_URL_ROOM_BLUEPRINT = `${API_URL_SPOT_SCHEDULING}/room-blueprint`;
const API_URL_ASSET_FOR_BLUEPRINT = `${API_URL_SPOT_SCHEDULING}/asset-for-blueprint`;
const API_URL_SPOT_FOR_BLUEPRINT = `${API_URL_SPOT_SCHEDULING}/spot-for-blueprint`;

// Backend defaults silently truncate. asset-for-blueprint uses DRF's default
// pagination (page_size=15, max_page_size=100) — so this 1000 is clamped to
// 100, and blueprints with >100 assets still drop the rest. spot-for-blueprint
// uses UserControlledPagination(default_size=300) with no max, so 1000 is
// honored there. Bumping the asset endpoint's max_page_size on the backend is
// the proper fix.
const BLUEPRINT_LIST_PAGE_SIZE = 1000;

export const spotSchedulingKeys = {
  all: ["@api-book", "spot-scheduling"] as const,
  roomBluePrintScope: () =>
    [...spotSchedulingKeys.all, "room-blueprint"] as const,
  roomBluePrintList: (params?: RoomBlueprintFilters) =>
    [...spotSchedulingKeys.roomBluePrintScope(), "list", params] as const,
  roomBlueprint: (id: number) =>
    [...spotSchedulingKeys.roomBluePrintScope(), id] as const,
  assetsForBlueprint: (blueprintId: number) =>
    [...spotSchedulingKeys.all, "assets-for-blueprint", blueprintId] as const,
  spotTypes: (blueprintId: number | undefined) =>
    [...spotSchedulingKeys.all, "spot-types", blueprintId ?? "all"] as const,
} as const;

export const fetchRoomBlueprintsAPIConfig = (
  params?: RoomBlueprintFilters,
): ApiConfig => {
  return [`${API_URL_ROOM_BLUEPRINT}/${buildUrlParams(params ?? {})}`];
};

export const fetchRoomBlueprintsAPI = async (
  fetch: Fetch<PaginatedResponse<RoomBlueprint>>,
  params?: RoomBlueprintFilters,
): Promise<PaginatedResponse<RoomBlueprint>> => {
  const [uri, init] = fetchRoomBlueprintsAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const roomBlueprintsQueryOptions = (
  fetch: Fetch<PaginatedResponse<RoomBlueprint>>,
  params?: RoomBlueprintFilters,
) => {
  const queryFn = fetchRoomBlueprintsAPI.bind(null, fetch, params);
  return queryOptions({
    queryKey: spotSchedulingKeys.roomBluePrintList(params),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const fetchRoomBlueprintDetailAPIConfig = (id: number): ApiConfig => [
  `${API_URL_ROOM_BLUEPRINT}/${id}/`,
];

export const fetchRoomBlueprintDetailAPI = async (
  fetch: Fetch<RoomBlueprint>,
  id: number,
): Promise<RoomBlueprint> => {
  const [uri, init] = fetchRoomBlueprintDetailAPIConfig(id);
  const { data } = await fetch(uri, init);
  return data;
};

export const roomBlueprintDetailQueryOptions = (
  fetch: Fetch<RoomBlueprint>,
  id: number,
) =>
  queryOptions({
    queryKey: spotSchedulingKeys.roomBlueprint(id),
    queryFn: () => fetchRoomBlueprintDetailAPI(fetch, id),
    staleTime: DEFAULT_STALE_TIME,
  });

export const fetchAssetsForBlueprintAPIConfig = (
  params: AssetsForBlueprintFilters,
): ApiConfig => [`${API_URL_ASSET_FOR_BLUEPRINT}/${buildUrlParams(params)}`];

export const fetchAssetsForBlueprintAPI = async (
  fetch: Fetch<PaginatedResponse<AssetForBlueprint>>,
  params: AssetsForBlueprintFilters,
): Promise<PaginatedResponse<AssetForBlueprint>> => {
  const [uri, init] = fetchAssetsForBlueprintAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const assetsForBlueprintQueryOptions = (
  fetch: Fetch<PaginatedResponse<AssetForBlueprint>>,
  blueprintId: number,
) =>
  queryOptions({
    queryKey: spotSchedulingKeys.assetsForBlueprint(blueprintId),
    queryFn: () =>
      fetchAssetsForBlueprintAPI(fetch, {
        blueprint: blueprintId,
        page_size: BLUEPRINT_LIST_PAGE_SIZE,
      }),
    staleTime: DEFAULT_STALE_TIME,
  });

export const fetchSpotTypesAPIConfig = (
  params: SpotTypesFilters = {},
): ApiConfig => [`${API_URL_SPOT_FOR_BLUEPRINT}/${buildUrlParams(params)}`];

export const fetchSpotTypesAPI = async (
  fetch: Fetch<PaginatedResponse<SpotType>>,
  params: SpotTypesFilters = {},
): Promise<SpotType[]> => {
  const [uri, init] = fetchSpotTypesAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data.results;
};

export const spotTypesQueryOptions = (
  fetch: Fetch<PaginatedResponse<SpotType>>,
  blueprintId: number | undefined = undefined,
) =>
  queryOptions({
    queryKey: spotSchedulingKeys.spotTypes(blueprintId),
    queryFn: () =>
      fetchSpotTypesAPI(
        fetch,
        blueprintId === undefined
          ? { page_size: BLUEPRINT_LIST_PAGE_SIZE }
          : { blueprint: blueprintId, page_size: BLUEPRINT_LIST_PAGE_SIZE },
      ),
    staleTime: DEFAULT_STALE_TIME,
  });

export const deleteRoomBlueprintAPI = async (
  fetch: Fetch<void>,
  id: number,
): Promise<void> => {
  await fetch(`${API_URL_ROOM_BLUEPRINT}/${id}/`, { method: "DELETE" });
};

export const deleteRoomBlueprintMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (id: number) => deleteRoomBlueprintAPI(fetch, id),
  });

export const createRoomBlueprintAPI = async (
  fetch: Fetch<RoomBlueprint>,
  payload: RoomBlueprintCreatePayload,
): Promise<RoomBlueprint> => {
  const { data } = await fetch(`${API_URL_ROOM_BLUEPRINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
};

export const createRoomBlueprintMutationOptions = (
  fetch: Fetch<RoomBlueprint>,
) =>
  mutationOptions({
    mutationFn: (payload: RoomBlueprintCreatePayload) =>
      createRoomBlueprintAPI(fetch, payload),
  });
