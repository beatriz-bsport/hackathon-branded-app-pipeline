import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import {
  fetchSportCategoriesAction,
  selectSportCategories,
  useSportCategoryStore,
} from "@bsport/store-core-data-masterdata";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export type ActiveCategoryFilters = {
  [filter in CategoryFilter]: string[];
};

enum CategoryFilter {
  IS = "is",
  IS_NOT = "isNot",
}

const emptyFilters: ActiveCategoryFilters = {
  [CategoryFilter.IS]: [],
  [CategoryFilter.IS_NOT]: [],
};

const toCategoryFilters = (
  filters: FilterElementState[],
): ActiveCategoryFilters => {
  return filters.reduce(
    (acc, filter) => {
      if (filter.field !== "category") return acc;
      if (filter.filter === CategoryFilter.IS)
        acc[CategoryFilter.IS] = filter.valueIds;

      if (filter.filter === CategoryFilter.IS_NOT)
        acc[CategoryFilter.IS_NOT] = filter.valueIds;

      return acc;
    },
    { ...emptyFilters },
  );
};

export const useCategoryFilter = (): {
  categoryFiltersConfig: FilterProps;
  categoryFiltersRef: React.RefObject<{ resetFilters: () => void }>;
  activeCategoryFilters: ActiveCategoryFilters;
  resetFilters?: () => void;
} => {
  const { t } = useTranslation();
  const filterRef = useRef<{ resetFilters: () => void }>(null);
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyId = companyTheme?.company;

  const [activeCategoryFilters, setActiveCategoryFilters] =
    useState<ActiveCategoryFilters>(emptyFilters);
  const categories = useSportCategoryStore(selectSportCategories);

  useEffect(() => {
    if (companyId) fetchSportCategoriesAction(fetch, { companyId });
  }, [companyId]);

  const onFilterChange = useCallback((filters: FilterElementState[]) => {
    const newActiveFilters = toCategoryFilters(filters);
    setActiveCategoryFilters(newActiveFilters);
  }, []);

  const categoryFiltersConfig: FilterProps = useMemo(
    () => ({
      fields: {
        category: {
          availableFilters: Object.values(CategoryFilter),
          id: "category",
          label: t("list.enabled.filter.category"),
          multiSelect: false,
          values: categories.map((category) => ({
            id: category.id.toString(),
            label: category.name,
          })),
        },
      },
      singleField: true,
      filters: [
        {
          id: CategoryFilter.IS,
          label: t("list.enabled.filter.is"),
        },
        {
          id: CategoryFilter.IS_NOT,
          label: t("list.enabled.filter.isNot"),
        },
      ],
      onFilterChange,
      selectFieldLabel: t("list.enabled.filter.title"),
    }),
    [categories, t, onFilterChange],
  );

  return {
    activeCategoryFilters,
    resetFilters: filterRef?.current?.resetFilters,
    categoryFiltersConfig,
    categoryFiltersRef: filterRef,
  };
};
