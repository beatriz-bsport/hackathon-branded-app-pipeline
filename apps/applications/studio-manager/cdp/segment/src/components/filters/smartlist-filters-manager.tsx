import { useMemo, useState } from "react";

import { usePassesQuery } from "#src/api/use-passes-query";
import { useSmartlistFiltersQuery } from "#src/api/use-smartlist-filters-query";
import { QueryBoundary } from "#src/components/QueryBoundary/QueryBoundary";
import { useTranslation } from "#src/utils/i18n";

import { FilterManager } from "./filter-manager";
import {
  type FilterSelectorOption,
  FilterSelectorPopover,
} from "./filter-selector-popover";
import { FILTER_SELECTOR_CATEGORIES } from "./filter-selector.constants";
import { PassesFilterCard } from "./passes-filter/components/passes-filter-card";
import { PassesFilterCardSkeleton } from "./passes-filter/components/passes-filter-card-skeleton";
import { createDefaultPassesFilter } from "./passes-filter/default-value";
import { mapApiFilterToFormValue as mapPaymentPackFilterToFormValue } from "./passes-filter/mappers/api-to-form-value";
import type { PassesFilterFormValue } from "./passes-filter/types";
import {
  SMARTLIST_FILTERS_MANAGER_FILTER_TYPES,
  type SmartlistFiltersManagerFilterType,
  isSmartlistFiltersManagerFilterType,
} from "./shared/types-guards";
import { TotalBookingNumberFilterCard } from "./total-booking/components/total-booking-number-filter-card";
import { createDefaultTotalBookingNumberFilter } from "./total-booking/default-value";
import { mapTotalBookingFilterToFormValue } from "./total-booking/mappers/api-to-form-value";
import type { TotalBookingNumberFilterFormValue } from "./total-booking/types";

type SmartlistFiltersManagerProps = {
  smartlistId: string;
};

const FILTER_TYPES = SMARTLIST_FILTERS_MANAGER_FILTER_TYPES;

type FilterType = SmartlistFiltersManagerFilterType;
type FilterValueByType = {
  passes: PassesFilterFormValue;
  totalBookingNumber: TotalBookingNumberFilterFormValue;
};

type DraftFilter =
  | {
      clientId: string;
      filterType: "passes";
      value: FilterValueByType["passes"];
    }
  | {
      clientId: string;
      filterType: "totalBookingNumber";
      value: FilterValueByType["totalBookingNumber"];
    };

type SavedFilter =
  | {
      key: string;
      filterType: "passes";
      value: FilterValueByType["passes"];
    }
  | {
      key: string;
      filterType: "totalBookingNumber";
      value: FilterValueByType["totalBookingNumber"];
    };

type RenderFilterParams<TFilterType extends FilterType> = {
  key: string;
  value: FilterValueByType[TFilterType];
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

let draftCounter = 0;
const createDraftClientId = (filterType: FilterType): string => {
  draftCounter += 1;
  return `${filterType}-filter-draft-${draftCounter}-${Date.now()}`;
};

/**
 * Card wrapper that lazily fetches pass options per rendered pass filter card.
 */
const PassesFilterCardWithData = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: {
  smartlistId: string;
  filterValue: PassesFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
}) => {
  const { data } = usePassesQuery("");
  const passOptions = data?.results ?? [];

  return (
    <PassesFilterCard
      smartlistId={smartlistId}
      filterValue={filterValue}
      passOptions={passOptions}
      onDeleteUnsavedFilter={onDeleteUnsavedFilter}
      onSaveSuccess={onSaveSuccess}
    />
  );
};

/**
 * Central manager for all smartlist filter types.
 * Every filter family shares the same draft management and rendering flow.
 */
export const SmartlistFiltersManager = ({
  smartlistId,
}: SmartlistFiltersManagerProps) => {
  const { t } = useTranslation("filters");
  const smartlistNumericId = Number(smartlistId);
  const [draftFilters, setDraftFilters] = useState<DraftFilter[]>([]);

  const {
    data: smartlistFilters,
    isLoading,
    isError,
  } = useSmartlistFiltersQuery(smartlistId);
  const paymentPackFilters = smartlistFilters?.paymentPackFilters ?? [];
  const totalBookingFilters = smartlistFilters?.totalBookingFilters ?? [];

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

  const renderFilterCardByType: {
    [Key in FilterType]: (params: RenderFilterParams<Key>) => React.JSX.Element;
  } = {
    passes: ({ key, value, onDeleteUnsavedFilter, onSaveSuccess }) => (
      <QueryBoundary key={key} loadingFallback={<PassesFilterCardSkeleton />}>
        <PassesFilterCardWithData
          smartlistId={smartlistId}
          filterValue={value}
          onDeleteUnsavedFilter={onDeleteUnsavedFilter}
          onSaveSuccess={onSaveSuccess}
        />
      </QueryBoundary>
    ),
    totalBookingNumber: ({
      key,
      value,
      onDeleteUnsavedFilter,
      onSaveSuccess,
    }) => (
      <TotalBookingNumberFilterCard
        key={key}
        smartlistId={smartlistId}
        filterValue={value}
        onDeleteUnsavedFilter={onDeleteUnsavedFilter}
        onSaveSuccess={onSaveSuccess}
      />
    ),
  };

  const createDraftFilterByType: {
    [Key in FilterType]: () => DraftFilter;
  } = {
    passes: () => ({
      clientId: createDraftClientId(FILTER_TYPES.passes),
      filterType: FILTER_TYPES.passes,
      value: createDefaultPassesFilter(smartlistNumericId),
    }),
    totalBookingNumber: () => ({
      clientId: createDraftClientId(FILTER_TYPES.totalBookingNumber),
      filterType: FILTER_TYPES.totalBookingNumber,
      value: createDefaultTotalBookingNumberFilter(smartlistNumericId),
    }),
  };

  const renderFilterCard = <TFilterType extends FilterType>(
    filterType: TFilterType,
    params: RenderFilterParams<TFilterType>,
  ) => {
    const renderer = renderFilterCardByType[filterType] as (
      rendererParams: RenderFilterParams<TFilterType>,
    ) => React.JSX.Element;
    return renderer(params);
  };

  const addableFilterOptions = useMemo<FilterSelectorOption[]>(
    () => [
      {
        id: FILTER_TYPES.passes,
        label: t("filters.19.title"),
        description: t("filterSelector.options.passes.description"),
        category: FILTER_SELECTOR_CATEGORIES.passes,
      },
      {
        id: FILTER_TYPES.totalBookingNumber,
        label: t("filters.22.title"),
        description: t("filterSelector.options.totalBookingNumber.description"),
        category: FILTER_SELECTOR_CATEGORIES.bookings,
      },
    ],
    [t],
  );

  const savedFilters: SavedFilter[] = [
    ...paymentPackFilters.map((paymentPackFilter) => ({
      key: `saved-passes-${paymentPackFilter.id}`,
      filterType: FILTER_TYPES.passes,
      value: mapPaymentPackFilterToFormValue(paymentPackFilter),
    })),
    ...totalBookingFilters.map((totalBookingFilter) => ({
      key: `saved-total-booking-number-${totalBookingFilter.id}`,
      filterType: FILTER_TYPES.totalBookingNumber,
      value: mapTotalBookingFilterToFormValue(totalBookingFilter),
    })),
  ];

  return (
    <FilterManager isLoading={isLoading} isError={isError}>
      <div className="flex flex-col gap-sm w-[500px]">
        {savedFilters.map((savedFilter) =>
          renderFilterCard(savedFilter.filterType, {
            key: savedFilter.key,
            value: savedFilter.value,
          }),
        )}

        {draftFilters.map((draftFilter) =>
          renderFilterCard(draftFilter.filterType, {
            key: draftFilter.clientId,
            value: draftFilter.value,
            onDeleteUnsavedFilter: () => removeDraft(draftFilter.clientId),
            onSaveSuccess: () => removeDraft(draftFilter.clientId),
          }),
        )}

        <FilterSelectorPopover
          options={addableFilterOptions}
          onSelectOption={(selectedFilterType) => {
            if (!isSmartlistFiltersManagerFilterType(selectedFilterType)) {
              return;
            }
            addDraft(createDraftFilterByType[selectedFilterType]());
          }}
        />
      </div>
    </FilterManager>
  );
};
