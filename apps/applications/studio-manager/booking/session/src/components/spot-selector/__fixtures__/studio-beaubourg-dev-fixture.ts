import type { QueryClient } from "@tanstack/react-query";

import {
  type AssetForBlueprint,
  type Session,
  type SessionStatus,
  sessionKeys,
  spotSchedulingKeys,
} from "@bsport/api-book";
import { type Teacher, teacherKeys } from "@bsport/api-book";
import type { PaginatedResponse } from "@bsport/store-base";

import coachPhoto from "#src/components/spot-selector/assets/coach.jpeg";

import {
  STUDIO_BEAUBOURG_BLUEPRINT_ID,
  studioBeaubourgAssets,
  studioBeaubourgBlueprint,
  studioBeaubourgSpotTypes,
} from "./studio-beaubourg-blueprint-fixtures";

const STUB_COACH_ID = 1;
const DEFAULT_TAKEN_SPOTS: readonly number[] = [3, 31];

const stubSession: Session = {
  room_blueprint: STUDIO_BEAUBOURG_BLUEPRINT_ID,
  coach: STUB_COACH_ID,
  coach_override: null,
} as Session;

const stubTeacher = {
  id: STUB_COACH_ID,
  name: "Sandrine Dupont",
  firstname: "Sandrine",
  photo: coachPhoto,
} as Teacher;

const assetsResponse: PaginatedResponse<AssetForBlueprint> = {
  count: studioBeaubourgAssets.length,
  links: { next: null, previous: null },
  next_page: null,
  page: 1,
  results: studioBeaubourgAssets,
};

/**
 * Pre-populates a TanStack QueryClient with the Studio Beaubourg production
 * payloads (room blueprint 922, its asset, its spot types) plus stub
 * session/status/teacher records so the spot-selector modal renders against
 * realistic personalized-image data without a backend.
 *
 * Used by:
 *  - the SpotSelectorModal storybook story (`WithCustomShapesBackgroundAndColours`)
 *  - any future integration test that needs Studio-Beaubourg-shaped data
 *
 * NOT imported by production component code: production builds tree-shake
 * this whole file out via the storybook-only / test-only import chain.
 */
export const seedStudioBeaubourgFixture = (
  client: QueryClient,
  sessionId: number,
  takenSpots: readonly number[] = DEFAULT_TAKEN_SPOTS,
): void => {
  client.setQueryData(sessionKeys.detail(sessionId), stubSession);
  client.setQueryData(
    spotSchedulingKeys.roomBlueprint(STUDIO_BEAUBOURG_BLUEPRINT_ID),
    studioBeaubourgBlueprint,
  );
  client.setQueryData(
    spotSchedulingKeys.assetsForBlueprint(STUDIO_BEAUBOURG_BLUEPRINT_ID),
    assetsResponse,
  );
  client.setQueryData(
    spotSchedulingKeys.spotTypes(STUDIO_BEAUBOURG_BLUEPRINT_ID),
    studioBeaubourgSpotTypes,
  );
  client.setQueryData(sessionKeys.status(sessionId, undefined), {
    taken_spots: [...takenSpots],
  } as SessionStatus);
  client.setQueryData(teacherKeys.detail(STUB_COACH_ID), stubTeacher);
};
