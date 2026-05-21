import type { RoomBlueprint, SpotType } from "@bsport/api-book";

import { isSpotElement } from "./canvas-transformer";

export type SpotSummary = {
  /** Number of free (un-taken) spots on the canvas. */
  freeCount: number;
  /** Number of taken spots — `data.takenSpots` ∩ canvas spot indices. */
  takenCount: number;
  /** Total spot count, free + taken. */
  totalCount: number;
  /**
   * SpotTypes the canvas actually references. The `/spot-for-blueprint`
   * endpoint sometimes returns company-wide SpotTypes that belong to sibling
   * blueprints — filtering keeps the legend honest about what the user can
   * actually pick.
   */
  usedSpotTypes: SpotType[];
};

export type SummarizeSpotsParams = {
  roomBlueprint: RoomBlueprint | undefined;
  takenSpots: readonly number[];
  spotTypes: SpotType[];
};

const EMPTY_SUMMARY: SpotSummary = {
  freeCount: 0,
  takenCount: 0,
  totalCount: 0,
  usedSpotTypes: [],
};

/**
 * Single pass over the blueprint's spot elements: counts free/taken/total
 * and collects the set of SpotType IDs the canvas actually references, then
 * filters `spotTypes` down to that set.
 *
 * Shared between `SpotSelectorModal` (the interactive picker) and
 * `FloorPlanBlock` (the read-only session-panel preview) so the two views
 * agree on what's "in use." Pure — wrap in `useMemo` at the call site.
 */
export const summarizeSpots = ({
  roomBlueprint,
  takenSpots,
  spotTypes,
}: SummarizeSpotsParams): SpotSummary => {
  if (!roomBlueprint) return EMPTY_SUMMARY;

  const takenSet = new Set(takenSpots);
  const referencedIds = new Set<number>();
  let total = 0;
  let taken = 0;

  for (const el of roomBlueprint.canvas.elements ?? []) {
    if (!isSpotElement(el)) continue;
    total += 1;
    if (takenSet.has(el.data.index)) taken += 1;
    referencedIds.add(el.data.spotTypeId);
  }

  return {
    freeCount: total - taken,
    takenCount: taken,
    totalCount: total,
    usedSpotTypes: spotTypes.filter((st) => referencedIds.has(st.id)),
  };
};
