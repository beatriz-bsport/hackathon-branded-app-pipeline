import { useQuery } from "@tanstack/react-query";
import { type RefObject, useCallback, useMemo, useRef, useState } from "react";

import { fetchSportCategoriesQueryOptions } from "@bsport/api-core/categories";
import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { useAllTeachersQuery } from "#src/hooks/api/use-all-teachers-query";
import { useLevelsByIdQuery } from "#src/hooks/api/use-levels-by-id-query";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const FIELD_CATEGORY = "category";
const FIELD_LEVEL = "level";
const FIELD_TEACHER = "teacher";
const FIELD_DURATION = "duration";
const FILTER_IS = "is";

const DURATION_LT15 = "lt15";
const DURATION_15TO30 = "15to30";
const DURATION_30TO60 = "30to60";
const DURATION_GT60 = "gt60";

// duration_second_range values are in minutes, matching the legacy video API
const DURATION_RANGES: Record<string, string> = {
  [DURATION_LT15]: "0,15",
  [DURATION_15TO30]: "15,30",
  [DURATION_30TO60]: "30,60",
  [DURATION_GT60]: "60,180",
};

export type MediaActiveFilters = {
  search?: string;
  SCT?: number;
  level?: number;
  coaches__id__in?: string;
  duration_second_range?: string;
};

// Reserved for when the API exposes a provider_identifier filter param.
// At that point, re-add a format field to MediaActiveFilters and wire it through
// useVideosQuery instead of relying on client-side post-filter logic.
export type MediaClientFilters = {
  format?: "video" | "ebook";
};

const getFieldValue = (
  filters: FilterElementState[],
  field: string,
): string | undefined => filters.find((f) => f.field === field)?.valueIds?.[0];

const toActiveFilters = (
  filters: FilterElementState[],
  search: string,
): MediaActiveFilters => {
  const active: MediaActiveFilters = {};

  if (search) {
    active.search = search;
  }

  const categoryId = getFieldValue(filters, FIELD_CATEGORY);
  if (categoryId) {
    active.SCT = parseInt(categoryId, 10);
  }

  const levelId = getFieldValue(filters, FIELD_LEVEL);
  if (levelId) {
    active.level = parseInt(levelId, 10);
  }

  const coachId = getFieldValue(filters, FIELD_TEACHER);
  if (coachId) {
    active.coaches__id__in = coachId;
  }

  const duration = getFieldValue(filters, FIELD_DURATION);
  if (duration && DURATION_RANGES[duration]) {
    active.duration_second_range = DURATION_RANGES[duration];
  }

  return active;
};

export const useMediaFilters = (): {
  activeFilters: MediaActiveFilters;
  filterConfig: FilterProps;
  filterRef: RefObject<{ resetFilters: () => void } | null>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  isFiltered: boolean;
  resetFilters: () => void;
} => {
  const { t } = useTranslation("media-list");
  const { currentPageSize, setPageSettings } = usePaginationQueryParams();

  const filterRef = useRef<{ resetFilters: () => void } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<FilterElementState[]>([]);
  const [activeFilters, setActiveFilters] = useState<MediaActiveFilters>({});

  // Category data
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const [categorySearch, setCategorySearch] = useState("");
  const { data: allCategories = [] } = useQuery({
    ...fetchSportCategoriesQueryOptions(fetch, { company_id: companyId }),
    enabled: Boolean(companyId),
    select: (categories) =>
      categories.map((c) => ({ id: c.id.toString(), label: c.name })),
  });
  const filteredCategories = useMemo(
    () =>
      allCategories.filter((c) =>
        c.label.toLowerCase().includes(categorySearch.toLowerCase()),
      ),
    [allCategories, categorySearch],
  );

  // Level data
  const levelsMap = useLevelsByIdQuery().data;
  const levelValues = useMemo(
    () =>
      levelsMap
        ? Array.from(levelsMap.entries()).map(([id, label]) => ({
            id: id.toString(),
            label,
          }))
        : [],
    [levelsMap],
  );

  // Teacher data
  const [teacherSearch, setTeacherSearch] = useState("");
  const { data: allTeachers = [] } = useAllTeachersQuery();
  const filteredTeachers = useMemo(
    () =>
      allTeachers
        .filter((teacher) =>
          teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()),
        )
        .map((teacher) => ({ id: teacher.id.toString(), label: teacher.name })),
    [allTeachers, teacherSearch],
  );

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
    setActiveFilters(toActiveFilters(filterState, value));
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  const onSearchClear = () => onSearchChange("");

  const onFilterChange = useCallback(
    (filters: FilterElementState[]) => {
      setFilterState(filters);
      setActiveFilters(toActiveFilters(filters, searchQuery));
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    },
    [currentPageSize, searchQuery, setPageSettings],
  );

  const filterConfig: FilterProps = useMemo(
    () => ({
      fields: {
        [FIELD_CATEGORY]: {
          id: FIELD_CATEGORY,
          label: t("filters.category.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: filteredCategories,
          searchConfig: {
            value: categorySearch,
            onChange: setCategorySearch,
            placeholder: t("filters.category.searchPlaceholder"),
          },
        },
        [FIELD_LEVEL]: {
          id: FIELD_LEVEL,
          label: t("filters.level.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: levelValues,
        },
        [FIELD_TEACHER]: {
          id: FIELD_TEACHER,
          label: t("filters.teacher.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: filteredTeachers,
          searchConfig: {
            value: teacherSearch,
            onChange: setTeacherSearch,
            placeholder: t("filters.teacher.searchPlaceholder"),
          },
        },
        [FIELD_DURATION]: {
          id: FIELD_DURATION,
          label: t("filters.duration.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: [
            { id: DURATION_LT15, label: t("filters.duration.lt15") },
            { id: DURATION_15TO30, label: t("filters.duration.15to30") },
            { id: DURATION_30TO60, label: t("filters.duration.30to60") },
            { id: DURATION_GT60, label: t("filters.duration.gt60") },
          ],
        },
      },
      filters: [{ id: FILTER_IS, label: t("filters.is") }],
      onFilterChange,
      selectFieldLabel: t("filters.label"),
    }),
    [
      t,
      onFilterChange,
      filteredCategories,
      categorySearch,
      levelValues,
      filteredTeachers,
      teacherSearch,
    ],
  );

  const isFiltered =
    Boolean(searchQuery) ||
    filterState.some((f) => f.field !== null && f.valueIds.length > 0);

  const resetFilters = () => {
    filterRef.current?.resetFilters();
    setSearchQuery("");
    setFilterState([]);
    setActiveFilters({});
    setCategorySearch("");
    setTeacherSearch("");
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  return {
    activeFilters,
    filterConfig,
    filterRef,
    searchQuery,
    onSearchChange,
    onSearchClear,
    isFiltered,
    resetFilters,
  };
};
