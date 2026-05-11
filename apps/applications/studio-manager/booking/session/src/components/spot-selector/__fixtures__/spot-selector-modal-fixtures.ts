import { QueryClient } from "@tanstack/react-query";

import type {
  AssetForBlueprint,
  RoomBlueprint,
  Session,
  SessionStatus,
  SpotType,
} from "@bsport/api-book";
import { sessionKeys, spotSchedulingKeys } from "@bsport/api-book";
import type { Fetch } from "@bsport/fetch";

import {
  baseSpotType,
  spotElement,
} from "#src/components/spot-selector/__fixtures__/canvas-elements";

export const SESSION_ID = 1;
export const BLUEPRINT_ID = 42;
export const TAKEN_SPOTS = [3, 7, 12, 18];
// Production marks the participant's own spot as taken too.
export const TAKEN_SPOTS_WITH_CURRENT = [...TAKEN_SPOTS, 10];

const roomBlueprint: RoomBlueprint = {
  id: BLUEPRINT_ID,
  disabled: false,
  name: "Studio A",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 30,
    elements: [
      ...Array.from({ length: 24 }).map((_, i) =>
        spotElement(i + 1, (i % 6) * 60 - 150, Math.floor(i / 6) * 60 - 90),
      ),
      {
        id: "teacher-1",
        type: "teacher" as const,
        data: { x: 0, y: -150 },
      },
    ],
  },
};

const assets: AssetForBlueprint[] = [];
const spotTypes: SpotType[] = [baseSpotType];
const session = { room_blueprint: BLUEPRINT_ID } as Session;

// Never invoked: every query is pre-seeded below.
export const noopFetch = (() =>
  Promise.resolve({ data: null })) as unknown as Fetch;

export const seededSpotSelectorClient = (takenSpots: number[]): QueryClient => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  client.setQueryData(sessionKeys.detail(SESSION_ID), session);
  client.setQueryData(
    spotSchedulingKeys.roomBlueprint(BLUEPRINT_ID),
    roomBlueprint,
  );
  // TODO(api-book): once `fetchAssetsForBlueprintAPI` returns the full
  // PaginatedResponse, seed { count, links, next_page, page, results: assets }.
  client.setQueryData(
    spotSchedulingKeys.assetsForBlueprint(BLUEPRINT_ID),
    assets,
  );
  client.setQueryData(spotSchedulingKeys.spotTypes(BLUEPRINT_ID), spotTypes);
  client.setQueryData(sessionKeys.status(SESSION_ID, undefined), {
    taken_spots: takenSpots,
  } as SessionStatus);
  return client;
};
