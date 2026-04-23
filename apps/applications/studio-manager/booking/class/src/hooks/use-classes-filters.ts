import { type RefObject, useCallback, useMemo, useRef, useState } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import useSCT from "#src/hooks/use-sct";
import { useTranslation } from "#src/utils/i18n";

const FIELD_TYPE = "activity-type";
const FIELD_CATEGORY = "activity-category";
const FILTER_IS = "is";
const VAL_GROUP = "group-activity";
const VAL_WORKSHOP = "workshop";

const toIsWorkshop = (filters: FilterElementState[]): boolean | undefined => {
  const v = filters.find((f) => f.field === FIELD_TYPE)?.valueIds?.[0];
  if (v === VAL_GROUP) return false;
  if (v === VAL_WORKSHOP) return true;
  return undefined;
};

const toCategoryIds = (filters: FilterElementState[]): string[] | undefined => {
  const ids = filters.find((f) => f.field === FIELD_CATEGORY)?.valueIds;
  return ids?.length ? ids : undefined;
};

export const useClassesFilters = (): {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  activeIsWorkshop: boolean | undefined;
  activeCategoryIds: string[] | undefined;
  filterConfig: FilterProps;
  filterRef: RefObject<{ resetFilters: () => void } | null>;
  resetFilters: () => void;
} => {
  const { t } = useTranslation("list");
  const { currentPageSize, setPageSettings } = usePaginationQueryParams();

  const filterRef = useRef<{ resetFilters: () => void } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIsWorkshop, setActiveIsWorkshop] = useState<boolean | undefined>(
    undefined,
  );
  const [activeCategoryIds, setActiveCategoryIds] = useState<
    string[] | undefined
  >(undefined);

  const { categories } = useSCT();
  const [categoriesSearch, setCategoriesSearch] = useState("");

  const filteredCategories = useMemo(
    () =>
      categories
        .map((c) => ({ id: c.id.toString(), label: c.name }))
        .filter((c) =>
          c.label.toLowerCase().includes(categoriesSearch.toLowerCase()),
        ),
    [categories, categoriesSearch],
  );

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  const onSearchClear = () => onSearchChange("");

  const onFilterChange = useCallback(
    (filters: FilterElementState[]) => {
      setActiveIsWorkshop(toIsWorkshop(filters));
      setActiveCategoryIds(toCategoryIds(filters));
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    },
    [currentPageSize, setPageSettings],
  );

  const filterConfig: FilterProps = useMemo(
    () => ({
      fields: {
        [FIELD_CATEGORY]: {
          id: FIELD_CATEGORY,
          label: t("list.filters.category.label"),
          availableFilters: [FILTER_IS],
          multiSelect: true,
          values: filteredCategories,
          searchConfig: {
            value: categoriesSearch,
            onChange: setCategoriesSearch,
            placeholder: t("list.filters.category.searchPlaceholder"),
          },
        },
        [FIELD_TYPE]: {
          id: FIELD_TYPE,
          label: t("list.filters.type.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: [
            {
              id: VAL_GROUP,
              label: t("list.filters.type.groupActivity"),
            },
            {
              id: VAL_WORKSHOP,
              label: t("list.filters.type.workshop"),
            },
          ],
        },
      },
      filters: [{ id: FILTER_IS, label: t("list.filters.is") }],
      onFilterChange,
      selectFieldLabel: t("list.filters.label"),
    }),
    [t, onFilterChange, filteredCategories, categoriesSearch],
  );

  const resetFilters = () => {
    filterRef.current?.resetFilters();
    setSearchQuery("");
    setCategoriesSearch("");
    setActiveIsWorkshop(undefined);
    setActiveCategoryIds(undefined);
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  return {
    searchQuery,
    onSearchChange,
    onSearchClear,
    activeIsWorkshop,
    activeCategoryIds,
    filterConfig,
    filterRef,
    resetFilters,
  };
};
