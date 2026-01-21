import {
  ApiConfig,
  Fetch,
  PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_URL } from "#src/constants";

import { RoomBlueprint, RoomBlueprintFilters } from "./types";

const API_V1_URL = `${API_URL}v1`;
const API_URL_SPOT_SCHEDULING = `${API_V1_URL}/spot-scheduling`;
const API_URL_ROOM_BLUEPRINT = `${API_URL_SPOT_SCHEDULING}/room-blueprint`;

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
