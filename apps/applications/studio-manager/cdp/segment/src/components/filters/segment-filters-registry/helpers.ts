import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { FilterSelectorOption } from "../filter-selector-popover";
import type { SmartlistFiltersManagerFilterType } from "../shared/types-guards";
import type {
  DraftFilter,
  SavedFilter,
  SegmentFilterRegistryEntry,
} from "./types";

let draftCounter = 0;

/**
 * Generates a unique client id for an unsaved filter draft card.
 */
export const createDraftClientId = (
  filterType: SmartlistFiltersManagerFilterType,
): string => {
  draftCounter += 1;
  return `${filterType}-filter-draft-${draftCounter}-${Date.now()}`;
};

/**
 * Builds selector options from the registry, preserving declaration order.
 */
export const buildAddableFilterOptions = (
  registryEntries: SegmentFilterRegistryEntry[],
): FilterSelectorOption[] =>
  registryEntries.map((entry) => ({
    id: entry.filterType,
    label: i18nInstance.t(entry.selector.titleKey, {
      ns: I18N_SEGMENT_NAMESPACES.FILTERS,
    }),
    description: i18nInstance.t(entry.selector.descriptionKey, {
      ns: I18N_SEGMENT_NAMESPACES.FILTERS,
    }),
    category: entry.selector.category,
  }));

/**
 * Maps API filter collections into saved filter cards.
 */
export const buildSavedFilters = <TData extends Record<string, unknown[]>>(
  filtersData: TData,
  registryEntries: SegmentFilterRegistryEntry[],
): SavedFilter[] =>
  registryEntries.flatMap((entry) => {
    const apiFilters = filtersData[entry.queryDataKey] ?? [];

    const validFilters = apiFilters.filter(
      (apiFilter: unknown): apiFilter is { id: number } =>
        typeof apiFilter === "object" &&
        apiFilter !== null &&
        "id" in apiFilter &&
        typeof apiFilter.id === "number",
    );

    return validFilters.map((apiFilter) => ({
      key: `${entry.savedKeyPrefix}-${apiFilter.id}`,
      filterType: entry.filterType,
      value: entry.mapToFormValue(apiFilter),
    }));
  });

/**
 * Creates a draft filter from a registry entry.
 */
export const createDraftFilter = (
  entry: SegmentFilterRegistryEntry,
  smartlistId: number,
): DraftFilter => ({
  clientId: createDraftClientId(entry.filterType),
  filterType: entry.filterType,
  value: entry.createDefault(smartlistId),
});
