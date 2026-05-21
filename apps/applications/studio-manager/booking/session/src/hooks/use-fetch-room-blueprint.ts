import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  RoomBlueprintFilters,
  fetchRoomBlueprintsAPI,
  spotSchedulingKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const ROOM_BLUEPRINT_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchRoomBlueprints = async (params?: RoomBlueprintFilters) => {
  const { results } = await fetchRoomBlueprintsAPI(fetch, params);
  return results;
};

export const roomBlueprintQueryOptions = (params?: RoomBlueprintFilters) => {
  return queryOptions({
    queryKey: spotSchedulingKeys.roomBluePrintList(params),
    queryFn: () => fetchRoomBlueprints(params),
    staleTime: ROOM_BLUEPRINT_STALE_TIME,
    enabled: !!params?.establishment,
  });
};

export const useFetchRoomBlueprints = (params?: RoomBlueprintFilters) => {
  return useQuery({
    ...roomBlueprintQueryOptions(params),
    select: (roomBlueprints) =>
      roomBlueprints?.filter((roomBlueprint) => !roomBlueprint.disabled),
  });
};
