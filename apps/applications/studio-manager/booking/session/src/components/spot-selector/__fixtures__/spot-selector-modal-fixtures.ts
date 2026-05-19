import { QueryClient } from "@tanstack/react-query";

import type {
  AssetForBlueprint,
  RoomBlueprint,
  Session,
  SessionStatus,
  SpotType,
} from "@bsport/api-book";
import { sessionKeys, spotSchedulingKeys } from "@bsport/api-book";
import { type Teacher, teacherKeys } from "@bsport/api-book";
import type { Fetch } from "@bsport/fetch";

import {
  baseSpotType,
  doorElement,
  lineElement,
  rectElement,
  screenElement,
  spotElement,
} from "#src/components/spot-selector/__fixtures__/canvas-elements";
import { seedStudioBeaubourgFixture } from "#src/components/spot-selector/__fixtures__/studio-beaubourg-dev-fixture";
import coachPhoto from "#src/components/spot-selector/assets/coach.jpeg";
import spinBikeAvailable from "#src/components/spot-selector/assets/spin-bike-available.jpg";
import spinBikeSelected from "#src/components/spot-selector/assets/spin-bike-selected.jpg";
import spinBikeTaken from "#src/components/spot-selector/assets/spin-bike-taken.jpeg";

export const SESSION_ID = 1;
export const BLUEPRINT_ID = 42;
export const COACH_ID = 99;
export const TAKEN_SPOTS = [3, 7, 12, 18];
// Production marks the participant's own spot as taken too.
export const TAKEN_SPOTS_WITH_CURRENT = [...TAKEN_SPOTS, 10];

// Mixed-blueprint fixture — used by the FullBlueprint story to show how every
// element type (spots of varying types, teacher, screen, walls, door,
// decorative rect) composes in the live modal.
export const MIXED_SESSION_ID = 2;
export const MIXED_BLUEPRINT_ID = 43;
export const MIXED_COACH_ID = 100;
export const MIXED_TAKEN_SPOTS = [3, 8, 13];

// Locally-vendored portrait so the seeded story is self-contained.
const COACH_PHOTO = coachPhoto;

const roomBlueprint: RoomBlueprint = {
  id: BLUEPRINT_ID,
  disabled: false,
  name: "Studio A",
  company: 1,
  establishment: 1,
  canvas: {
    // Production blueprints ship `coachHeight: 1` (a scale factor on the
    // 80px avatar base size). Using 30 here pre-dated the teacher fix and
    // produced a 2400px avatar.
    coachHeight: 1,
    elements: [
      ...Array.from({ length: 24 }).map((_, i) =>
        spotElement(i + 1, (i % 6) * 60 - 150, Math.floor(i / 6) * 60 - 90),
      ),
      {
        id: "teacher-1",
        type: "teacher" as const,
        // Avatar is 80px tall and the name baseline sits ~15px below the
        // avatar bottom. Place the teacher far enough above row 1 (y=-90,
        // radius 20 → top at y=-110) that the name doesn't overlap.
        data: { x: 0, y: -220 },
      },
    ],
  },
};

const assets: AssetForBlueprint[] = [];
const spotTypes: SpotType[] = [baseSpotType];
const session = {
  room_blueprint: BLUEPRINT_ID,
  coach: COACH_ID,
  coach_override: null,
} as Session;
const coachTeacher = {
  id: COACH_ID,
  name: "Sandrine Dupont",
  firstname: "Sandrine",
  photo: COACH_PHOTO,
} as Teacher;

const mixedSpotTypes: SpotType[] = [
  { ...baseSpotType, id: 1, prefix: null, name: "Cycle" },
  {
    ...baseSpotType,
    id: 2,
    prefix: "V",
    name: "VIP",
    fill_color: "#FEF3C7",
    stroke_color: "#D97706",
  },
];

const buildMixedSpotGrid = () => {
  const elements = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col + 1;
      // Top row is the VIP spot type so the authored colour shows; the rest
      // use the default cycle spot type.
      const spotTypeId = row === 0 ? 2 : 1;
      elements.push(
        spotElement(index, col * 80 - 120, row * 60 - 60, spotTypeId),
      );
    }
  }
  return elements;
};

const mixedBlueprint: RoomBlueprint = {
  id: MIXED_BLUEPRINT_ID,
  disabled: false,
  name: "Studio A — full layout",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Coach at the top of the room.
      {
        id: "teacher-mixed",
        type: "teacher" as const,
        data: { x: 0, y: -280 },
      },
      // Chalkboard screen below the coach.
      screenElement("screen-mixed", 0, -180, 160, undefined, {
        stroke: "#1F4F4D",
        strokeWidth: 14,
      }),
      // Perimeter wall as a multi-segment polyline.
      lineElement(
        "perimeter",
        [
          [-220, -140],
          [-220, 200],
          [220, 200],
          [220, -140],
          [-220, -140],
        ],
        { stroke: "#475569", strokeWidth: 3 },
      ),
      // Door on the right-hand wall (rotation 180° → bar lands against the
      // wall and the swing-arrow points toward it).
      doorElement("door-mixed", 200, 60, {
        stroke: "#1F2937",
        strokeWidth: 2,
        rotation: 180,
      }),
      // Decorative rect — equipment storage area in the top-right corner of
      // the room, with a dashed outline so it doesn't read as a wall.
      rectElement("mat-zone", 110, -110, 90, 40, {
        fill: "#DBEAFE",
        stroke: "#1D4ED8",
        strokeWidth: 1.5,
        strokeDasharray: "5 3",
      }),
      // 16 spots (4 rows × 4 cols) — top row VIP, others default.
      ...buildMixedSpotGrid(),
    ],
  },
};

const mixedSession = {
  room_blueprint: MIXED_BLUEPRINT_ID,
  coach: MIXED_COACH_ID,
  coach_override: null,
} as Session;

const mixedCoachTeacher = {
  id: MIXED_COACH_ID,
  name: "Marc Lefevre",
  firstname: "Marc",
  photo: coachPhoto,
} as Teacher;

// Personalized-image fixture — drives the `WithImageSpotIcons` story. The
// SpotType ships its own free/taken/selected images (the vendored spin-bike
// photos) and `customization: "personalized"`, so every spot renders the
// image instead of the default circle.
export const IMAGE_SPOTS_SESSION_ID = 3;
export const IMAGE_SPOTS_BLUEPRINT_ID = 44;
export const IMAGE_SPOTS_COACH_ID = 101;
export const IMAGE_SPOTS_TAKEN: number[] = [5, 9];
export const IMAGE_SPOTS_CURRENT = 7;

const cyclePersonalizedType: SpotType = {
  ...baseSpotType,
  id: 1,
  name: "Cycle",
  prefix: null,
  // Production parity (room-blueprint 8218 / spot-type 23 "Cycle"):
  // circular shape with personalized art per state on the SpotType itself.
  shape: "circular",
  customization: "personalized",
  free_image: spinBikeAvailable,
  taken_image: spinBikeTaken,
  selected_image: spinBikeSelected,
};

const imageSpotsBlueprint: RoomBlueprint = {
  id: IMAGE_SPOTS_BLUEPRINT_ID,
  disabled: false,
  name: "Studio — image spots",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Coach above the room.
      {
        id: "teacher-image-spots",
        type: "teacher" as const,
        data: { x: 0, y: -260 },
      },
      // Chalkboard screen below the coach.
      screenElement("screen-image-spots", 0, -170, 160, undefined, {
        stroke: "#1F4F4D",
        strokeWidth: 14,
      }),
      // 3×3 grid of cycle bikes. The personalized SpotType's images render
      // edge-to-edge in each spot's authored box.
      ...Array.from({ length: 9 }).map((_, i) =>
        spotElement(
          i + 1,
          (i % 3) * 100 - 100,
          Math.floor(i / 3) * 100 - 50,
          cyclePersonalizedType.id,
          null,
          { width: 70, height: 70 },
        ),
      ),
    ],
  },
};

const imageSpotsSession = {
  room_blueprint: IMAGE_SPOTS_BLUEPRINT_ID,
  coach: IMAGE_SPOTS_COACH_ID,
  coach_override: null,
} as Session;

const imageSpotsCoachTeacher = {
  id: IMAGE_SPOTS_COACH_ID,
  name: "Elena Marchetti",
  firstname: "Elena",
  photo: coachPhoto,
} as Teacher;

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
  client.setQueryData(teacherKeys.detail(COACH_ID), coachTeacher);
  return client;
};

// Production-shaped scenario (blueprint 922 / company 2443). The current
// spot (40) is intentionally included in `taken_spots` because that's what
// the real API does — the participant's own booking is "taken" from the
// server's perspective. Locks in the legacy-parity fix for current+taken.
export const STUDIO_BEAUBOURG_SESSION_ID = 9220;
export const STUDIO_BEAUBOURG_CURRENT_SPOT = 40;
export const STUDIO_BEAUBOURG_TAKEN_SPOTS: readonly number[] = [
  3,
  31,
  STUDIO_BEAUBOURG_CURRENT_SPOT,
];

/**
 * Seeds the Studio Beaubourg production blueprint (verbatim wire payloads:
 * 56 spots across two SpotType groups, unbound-asset background, teacher).
 * Use with {@link STUDIO_BEAUBOURG_SESSION_ID} to drive the modal against
 * realistic personalized-image data.
 */
export const seededStudioBeaubourgSpotSelectorClient = (
  takenSpots: readonly number[] = STUDIO_BEAUBOURG_TAKEN_SPOTS,
): QueryClient => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  seedStudioBeaubourgFixture(client, STUDIO_BEAUBOURG_SESSION_ID, takenSpots);
  return client;
};

/**
 * Seeds the mixed blueprint: spots of two types (with authored colours),
 * teacher with photo, screen, perimeter wall, door, and a decorative rect.
 * Use with {@link MIXED_SESSION_ID} to demonstrate every element type in the
 * live modal.
 */
export const seededFullBlueprintSpotSelectorClient = (
  takenSpots: number[] = MIXED_TAKEN_SPOTS,
): QueryClient => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  client.setQueryData(sessionKeys.detail(MIXED_SESSION_ID), mixedSession);
  client.setQueryData(
    spotSchedulingKeys.roomBlueprint(MIXED_BLUEPRINT_ID),
    mixedBlueprint,
  );
  client.setQueryData(
    spotSchedulingKeys.assetsForBlueprint(MIXED_BLUEPRINT_ID),
    assets,
  );
  client.setQueryData(
    spotSchedulingKeys.spotTypes(MIXED_BLUEPRINT_ID),
    mixedSpotTypes,
  );
  client.setQueryData(sessionKeys.status(MIXED_SESSION_ID, undefined), {
    taken_spots: takenSpots,
  } as SessionStatus);
  client.setQueryData(teacherKeys.detail(MIXED_COACH_ID), mixedCoachTeacher);
  return client;
};

/**
 * Seeds the image-spots blueprint: a single personalized SpotType whose
 * free/taken/selected art are the vendored spin-bike photos. Use with
 * {@link IMAGE_SPOTS_SESSION_ID} and {@link IMAGE_SPOTS_CURRENT} to drive
 * the modal against an image-driven blueprint.
 */
export const seededImageSpotsSpotSelectorClient = (
  takenSpots: number[] = IMAGE_SPOTS_TAKEN,
): QueryClient => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  client.setQueryData(
    sessionKeys.detail(IMAGE_SPOTS_SESSION_ID),
    imageSpotsSession,
  );
  client.setQueryData(
    spotSchedulingKeys.roomBlueprint(IMAGE_SPOTS_BLUEPRINT_ID),
    imageSpotsBlueprint,
  );
  client.setQueryData(
    spotSchedulingKeys.assetsForBlueprint(IMAGE_SPOTS_BLUEPRINT_ID),
    assets,
  );
  client.setQueryData(spotSchedulingKeys.spotTypes(IMAGE_SPOTS_BLUEPRINT_ID), [
    cyclePersonalizedType,
  ]);
  client.setQueryData(sessionKeys.status(IMAGE_SPOTS_SESSION_ID, undefined), {
    taken_spots: takenSpots,
  } as SessionStatus);
  client.setQueryData(
    teacherKeys.detail(IMAGE_SPOTS_COACH_ID),
    imageSpotsCoachTeacher,
  );
  return client;
};
