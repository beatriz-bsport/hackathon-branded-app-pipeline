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
import type { Fetch } from "@bsport/fetch";

export type UseCanvasDataArgs = {
  blueprintId: number | null;
  sessionId: number | null;
  fetch: Fetch;
};

export type UseCanvasDataResult = {
  isLoading: boolean;
  error: Error | null;
  roomBlueprint: RoomBlueprint | undefined;
  assets: AssetForBlueprint[];
  spotTypes: SpotType[];
  takenSpots: number[];
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
}: UseCanvasDataArgs): UseCanvasDataResult => {
  const enabled = blueprintId !== null;

  const [blueprint, assets, spotTypes, status] = useQueries({
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
    ],
  });

  const queries = [blueprint, assets, spotTypes, status];

  return {
    isLoading: enabled && queries.some((q) => q.isLoading),
    error: (queries.find((q) => q.error)?.error as Error | null) ?? null,
    roomBlueprint: blueprint.data,
    assets: assets.data?.results ?? EMPTY_ASSETS,
    spotTypes: spotTypes.data ?? EMPTY_SPOT_TYPES,
    takenSpots: status.data?.taken_spots ?? EMPTY_TAKEN_SPOTS,
  };
};
