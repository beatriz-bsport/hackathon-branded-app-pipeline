import { useQueries } from "@tanstack/react-query";

import {
  type AssetForBlueprint,
  type RoomBlueprint,
  type SpotType,
  assetsForBlueprintQueryOptions,
  roomBlueprintDetailQueryOptions,
  sessionStatusQueryOptions,
  spotTypesQueryOptions,
} from "@bsport/api-book";
import { retrieveTeacherQueryOptions } from "@bsport/api-core";
import type { Fetch } from "@bsport/fetch";

import type { TeacherCoach } from "#src/components/spot-selector/spot-canvas/elements/teacher-dimensions";

export type UseCanvasDataArgs = {
  blueprintId: number | null;
  sessionId: number | null;
  fetch: Fetch;
  /** When provided, the hook fetches the corresponding teacher record so the
   *  TeacherElement can render the coach photo and display name. */
  coachId?: number | null;
};

export type UseCanvasDataResult = {
  isLoading: boolean;
  error: Error | null;
  roomBlueprint: RoomBlueprint | undefined;
  assets: AssetForBlueprint[];
  spotTypes: SpotType[];
  takenSpots: number[];
  coach: TeacherCoach | undefined;
};

// Stable empty arrays so consumers that memoise on these fields don't
// recompute on every loading/disabled render.
const EMPTY_ASSETS: AssetForBlueprint[] = [];
const EMPTY_SPOT_TYPES: SpotType[] = [];
const EMPTY_TAKEN_SPOTS: number[] = [];

/**
 * Fetches the four queries the canvas needs (blueprint, assets, spot types,
 * session status) in parallel and aggregates loading/error state.
 *
 * Pass `blueprintId: null` to keep all queries disabled — useful while the
 * caller is still resolving the session.
 */
export const useCanvasData = ({
  blueprintId,
  sessionId,
  fetch,
  coachId,
}: UseCanvasDataArgs): UseCanvasDataResult => {
  const enabled = blueprintId !== null;
  const coachEnabled = enabled && coachId != null && coachId > 0;

  const [blueprint, assets, spotTypes, status, teacher] = useQueries({
    queries: [
      {
        ...roomBlueprintDetailQueryOptions(fetch as never, blueprintId ?? 0),
        enabled,
      },
      {
        ...assetsForBlueprintQueryOptions(fetch as never, blueprintId ?? 0),
        enabled,
      },
      {
        ...spotTypesQueryOptions(fetch as never, blueprintId ?? undefined),
        enabled,
      },
      {
        ...sessionStatusQueryOptions(fetch as never, sessionId ?? 0),
        enabled: enabled && sessionId !== null,
      },
      {
        ...retrieveTeacherQueryOptions(fetch as never, coachId ?? 0),
        enabled: coachEnabled,
      },
    ],
  });

  // The teacher query failing must not surface as a critical canvas error —
  // the spot map should render with a fallback avatar rather than erroring
  // out the whole modal.
  const blockingQueries = [blueprint, assets, spotTypes, status];

  return {
    isLoading: enabled && blockingQueries.some((q) => q.isLoading),
    error:
      (blockingQueries.find((q) => q.error)?.error as Error | null) ?? null,
    roomBlueprint: blueprint.data,
    assets: assets.data?.results ?? EMPTY_ASSETS,
    spotTypes: spotTypes.data ?? EMPTY_SPOT_TYPES,
    takenSpots: status.data?.taken_spots ?? EMPTY_TAKEN_SPOTS,
    // Pass the cached Teacher record directly — its reference is stable
    // across renders, so downstream `React.memo` on <TeacherElement> /
    // <SpotElement> holds. Rewrapping into a TeacherCoach literal would
    // mint a fresh object every render and bust memoisation.
    coach: teacher.data,
  };
};
