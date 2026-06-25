import { Fragment, useEffect, useMemo, useState } from "react";

import { Divider } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSmartlistFiltersQuery } from "#src/api/use-smartlist-filters-query";
import { useFilterDraftGuardStore } from "#src/stores/filter-draft-guard/store";

import { FilterManager } from "./filter-manager";
import { FilterSelectorPopover } from "./filter-selector-popover";
import { ProfileStatusFilterCard } from "./profile-status-filter/profile-status-filter-card";
import {
  SegmentFiltersEmptyStateHeader,
  SegmentFiltersTopFilterShortcuts,
} from "./segment-filters-empty-state";
import {
  type DraftFilter,
  SEGMENT_FILTER_REGISTRY_ENTRIES,
  type SavedFilter,
  buildAddableFilterOptions,
  buildSavedFilters,
  createSegmentDraftFilter,
  renderSegmentFilterCard,
} from "./segment-filters-registry";
import { FilterAndSeparator } from "./shared/filter-and-separator";
import { type SmartlistFiltersManagerFilterType } from "./shared/types-guards";

type SegmentFiltersManagerProps = {
  smartlistId: string;
};

/**
 * Central manager for all smartlist filter types.
 * Every filter family shares the same draft management and rendering flow.
 */
export const SegmentFiltersManager = ({
  smartlistId,
}: SegmentFiltersManagerProps) => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const smartlistNumericId = Number(smartlistId);
  const [draftFilters, setDraftFilters] = useState<DraftFilter[]>([]);
  const setUnsavedNewFilterCount = useFilterDraftGuardStore(
    (state) => state.setUnsavedNewFilterCount,
  );
  const resetFilterDraftGuard = useFilterDraftGuardStore(
    (state) => state.reset,
  );

  useEffect(() => {
    setUnsavedNewFilterCount(draftFilters.length);
  }, [draftFilters.length, setUnsavedNewFilterCount]);

  useEffect(() => {
    return () => {
      resetFilterDraftGuard();
    };
  }, [resetFilterDraftGuard]);

  const {
    data: smartlistFilters,
    isLoading,
    isError,
  } = useSmartlistFiltersQuery(smartlistId);

  const renderContext = { smartlistId, companyId };

  const addDraft = (draftFilter: DraftFilter) => {
    setDraftFilters((previousDraftFilters) => [
      ...previousDraftFilters,
      draftFilter,
    ]);
  };

  const removeDraft = (clientId: string) =>
    setDraftFilters((previousDraftFilters) =>
      previousDraftFilters.filter(
        (draftFilter) => draftFilter.clientId !== clientId,
      ),
    );

  const addableFilterOptions = useMemo(
    () => buildAddableFilterOptions(SEGMENT_FILTER_REGISTRY_ENTRIES),
    [],
  );

  const savedFilters: SavedFilter[] = smartlistFilters
    ? buildSavedFilters(smartlistFilters, SEGMENT_FILTER_REGISTRY_ENTRIES)
    : [];

  const hasFilters = savedFilters.length > 0 || draftFilters.length > 0;

  const handleAddFilter = (filterType: SmartlistFiltersManagerFilterType) => {
    addDraft(createSegmentDraftFilter(filterType, smartlistNumericId));
  };

  const activeFilterSections = [
    ...savedFilters.map((savedFilter) => ({
      key: savedFilter.key,
      content: renderSegmentFilterCard(savedFilter.filterType, renderContext, {
        key: savedFilter.key,
        value: savedFilter.value,
      }),
    })),
    ...draftFilters.map((draftFilter) => ({
      key: draftFilter.clientId,
      content: renderSegmentFilterCard(draftFilter.filterType, renderContext, {
        key: draftFilter.clientId,
        value: draftFilter.value,
        cleanDraftComponent: () => removeDraft(draftFilter.clientId),
      }),
    })),
  ];

  return (
    <div className="flex flex-col gap-sm w-full">
      <ProfileStatusFilterCard key={smartlistId} />

      <Divider />

      <FilterManager isLoading={isLoading} isError={isError}>
        <div className="flex flex-col gap-sm w-full">
          {!hasFilters ? <SegmentFiltersEmptyStateHeader /> : null}

          {activeFilterSections.map((filterSection, filterSectionIndex) => (
            <Fragment key={filterSection.key}>
              {filterSectionIndex > 0 ? <FilterAndSeparator /> : null}
              {filterSection.content}
            </Fragment>
          ))}

          <FilterSelectorPopover
            key={`${savedFilters.length}-${draftFilters.length}`}
            options={addableFilterOptions}
            onSelectOption={handleAddFilter}
          />
          {!hasFilters ? (
            <SegmentFiltersTopFilterShortcuts
              onSelectShortcut={handleAddFilter}
            />
          ) : null}
        </div>
      </FilterManager>
    </div>
  );
};
