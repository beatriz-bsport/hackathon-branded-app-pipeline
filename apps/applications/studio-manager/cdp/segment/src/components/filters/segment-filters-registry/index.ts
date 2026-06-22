import type { SmartlistFiltersManagerFilterType } from "../shared/types-guards";
import { createDraftFilter } from "./helpers";
import { SEGMENT_FILTER_REGISTRY_ENTRIES } from "./segment-filter-registry-entries";
import type {
  DraftFilter,
  RenderFilterParams,
  SegmentFilterRegistryEntry,
  SegmentFilterRenderContext,
} from "./types";

export { SEGMENT_FILTER_REGISTRY_ENTRIES } from "./segment-filter-registry-entries";
export { buildAddableFilterOptions, buildSavedFilters } from "./helpers";
export {
  defineSegmentFilterEntry,
  type CompanyScopedSegmentFilterCardProps,
  type DraftFilter,
  type SavedFilter,
  type SegmentFilterCardDraftProps,
  type SegmentFilterCardProps,
  type SegmentFilterRegistryEntry,
  type SegmentFilterRegistryEntryConfig,
  type SegmentFilterRenderContext,
} from "./types";

export const segmentFilterRegistryByType = Object.fromEntries(
  SEGMENT_FILTER_REGISTRY_ENTRIES.map((entry) => [entry.filterType, entry]),
) as Record<SmartlistFiltersManagerFilterType, SegmentFilterRegistryEntry>;

/**
 * Renders a filter card for the given filter type using registry configuration.
 */
export const renderSegmentFilterCard = (
  filterType: SmartlistFiltersManagerFilterType,
  context: SegmentFilterRenderContext,
  params: RenderFilterParams<unknown>,
) => segmentFilterRegistryByType[filterType].render(context, params);

/**
 * Creates a draft filter for the given filter type.
 */
export const createSegmentDraftFilter = (
  filterType: SmartlistFiltersManagerFilterType,
  smartlistId: number,
): DraftFilter =>
  createDraftFilter(segmentFilterRegistryByType[filterType], smartlistId);
