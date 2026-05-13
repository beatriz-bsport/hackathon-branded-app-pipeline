import { type RefObject, useMemo, useRef, useState } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const FIELD_TYPE = "type";
const FILTER_IS = "is";

const TYPE_ALL = "all";
const TYPE_DEFAULT = "default";
const TYPE_CUSTOM = "custom";

export type RoleTypeFilter =
  | typeof TYPE_ALL
  | typeof TYPE_DEFAULT
  | typeof TYPE_CUSTOM;

const getFieldValue = (
  filters: FilterElementState[],
  field: string,
): string | undefined =>
  filters.find((filter) => filter.field === field)?.valueIds?.[0];

const toRoleTypeFilter = (filters: FilterElementState[]): RoleTypeFilter => {
  const typeFilter = getFieldValue(filters, FIELD_TYPE);

  if (typeFilter === TYPE_DEFAULT || typeFilter === TYPE_CUSTOM) {
    return typeFilter;
  }

  return TYPE_ALL;
};

export const useRoleFilters = (): {
  searchQuery: string;
  typeFilter: RoleTypeFilter;
  filterConfig: FilterProps;
  filterRef: RefObject<{ resetFilters: () => void } | null>;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  isFiltered: boolean;
  resetFilters: () => void;
} => {
  const { t, i18n } = useTranslation("role-list");
  const filterRef = useRef<{ resetFilters: () => void } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<FilterElementState[]>([]);
  const typeFilter = useMemo(
    () => toRoleTypeFilter(filterState),
    [filterState],
  );

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const onSearchClear = () => onSearchChange("");

  const filterConfig: FilterProps = useMemo(
    () => ({
      fields: {
        [FIELD_TYPE]: {
          id: FIELD_TYPE,
          label: t("filters.type.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: [
            { id: TYPE_ALL, label: t("filters.type.all") },
            { id: TYPE_DEFAULT, label: t("filters.type.default") },
            { id: TYPE_CUSTOM, label: t("filters.type.custom") },
          ],
        },
      },
      filters: [{ id: FILTER_IS, label: t("filters.is") }],
      onFilterChange: setFilterState,
      selectFieldLabel: t("filters.label"),
      singleField: true,
    }),
    [i18n.language],
  );

  const isFiltered = searchQuery.trim().length > 0 || typeFilter !== TYPE_ALL;

  const resetFilters = () => {
    filterRef.current?.resetFilters();
    setSearchQuery("");
    setFilterState([]);
  };

  return {
    searchQuery,
    typeFilter,
    filterConfig,
    filterRef,
    onSearchChange,
    onSearchClear,
    isFiltered,
    resetFilters,
  };
};
