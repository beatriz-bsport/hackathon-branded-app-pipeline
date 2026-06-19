import type { ReactElement } from "react";

import type { SmartlistFiltersQueryData } from "#src/api/use-smartlist-filters-query";

import type { FilterSelectorCategory } from "../filter-selector.constants";
import type { SmartlistFiltersManagerFilterType } from "../shared/types-guards";

export type SegmentFilterRenderContext = {
  smartlistId: string;
  companyId: number | undefined;
};

export type RenderFilterParams<TValue> = {
  key: string;
  value: TValue;
  cleanDraftComponent?: () => void;
};

/** Draft lifecycle props shared between registry render params and filter cards. */
export type SegmentFilterCardDraftProps<TFormValue = unknown> = Omit<
  RenderFilterParams<TFormValue>,
  "key" | "value"
>;

/** Base props every standard smartlist filter card receives. */
export type SegmentFilterCardProps<TFormValue> = {
  smartlistId: string;
  filterValue: TFormValue;
} & SegmentFilterCardDraftProps<TFormValue>;

/** Props for filters that also need the studio company id. */
export type CompanyScopedSegmentFilterCardProps<TFormValue> = {
  companyId: number;
} & SegmentFilterCardProps<TFormValue>;

export type SegmentFilterSelectorConfig = {
  titleKey: string;
  descriptionKey: string;
  category: FilterSelectorCategory;
};

/**
 * The API filter shape stored under a given key of the smartlist filters query data.
 */
type ApiFilterFor<TQueryKey extends keyof SmartlistFiltersQueryData> =
  SmartlistFiltersQueryData[TQueryKey][number];

/**
 * Strongly-typed configuration for a single smartlist filter.
 * `TFormValue` ties together the default factory, the API mapper, and the renderer,
 * while `TQueryKey` ties the API filter shape passed to `mapToFormValue` to the
 * collection it is read from.
 */
export type SegmentFilterRegistryEntryConfig<
  TQueryKey extends keyof SmartlistFiltersQueryData,
  TFormValue,
> = {
  filterType: SmartlistFiltersManagerFilterType;
  queryDataKey: TQueryKey;
  savedKeyPrefix: string;
  selector: SegmentFilterSelectorConfig;
  createDefault: (smartlistId: number) => TFormValue;
  mapToFormValue: (apiFilter: ApiFilterFor<TQueryKey>) => TFormValue;
  render: (
    context: SegmentFilterRenderContext,
    params: RenderFilterParams<TFormValue>,
  ) => ReactElement;
};

/**
 * Type-erased registry entry, used so heterogeneous filter entries can live in one array.
 */
export type SegmentFilterRegistryEntry = {
  filterType: SmartlistFiltersManagerFilterType;
  queryDataKey: keyof SmartlistFiltersQueryData;
  savedKeyPrefix: string;
  selector: SegmentFilterSelectorConfig;
  createDefault: (smartlistId: number) => unknown;
  mapToFormValue: (apiFilter: unknown) => unknown;
  render: (
    context: SegmentFilterRenderContext,
    params: RenderFilterParams<unknown>,
  ) => ReactElement;
};

/**
 * Defines a smartlist filter registry entry with full per-filter type inference.
 * Each filter declares its config once; the form-value type is inferred from
 * `createDefault` / `mapToFormValue` and enforced on `render`. The returned entry
 * is type-erased so all filters can be collected into a single registry array.
 */
export const defineSegmentFilterEntry = <
  TQueryKey extends keyof SmartlistFiltersQueryData,
  TFormValue,
>(
  entry: SegmentFilterRegistryEntryConfig<TQueryKey, TFormValue>,
): SegmentFilterRegistryEntry => entry as unknown as SegmentFilterRegistryEntry;

export type DraftFilter = {
  [Key in SmartlistFiltersManagerFilterType]: {
    clientId: string;
    filterType: Key;
    value: unknown;
  };
}[SmartlistFiltersManagerFilterType];

export type SavedFilter = {
  [Key in SmartlistFiltersManagerFilterType]: {
    key: string;
    filterType: Key;
    value: unknown;
  };
}[SmartlistFiltersManagerFilterType];
