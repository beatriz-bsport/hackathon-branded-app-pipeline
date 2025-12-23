import { useState } from "react";

import type { FilterProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { useDebounce } from "@bsport/use-debounce";

import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useLevelName } from "#src/hooks/level/useLevelName";
import { useFetchCategories } from "#src/hooks/use-fetch-categories";
import { useSearchEstablishments } from "#src/hooks/use-search-establishments";
import { useSearchTeachers } from "#src/hooks/use-search-teachers";
import { setFilters } from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import {
  ActivityTypeFilterValues,
  SessionFilterTypes,
  SessionFilters,
  TeacherSubstitutionFilterValues,
  VisibilityFilterValues,
} from "./types";

export const useFilterConfig = (): FilterProps => {
  const { t } = useTranslation("sessionList");

  // Load teachers for the teacher filter
  const [teacherInputValue, setTeacherInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(teacherInputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: teachers } = useSearchTeachers(debouncedSearch);

  // Load establishments for the establishment filter
  const [establishmentInputValue, setEstablishmentInputValue] = useState("");
  const [debouncedEstablishmentSearch, setDebouncedEstablishmentSearch] =
    useState(establishmentInputValue);
  const debouncedSetDebouncedEstablishmentSearch = useDebounce(
    setDebouncedEstablishmentSearch,
  );

  const { data: establishments } = useSearchEstablishments(
    debouncedEstablishmentSearch,
  );

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  // Load and filter levels for the level filter
  const { data: levels } = useFetchLevels(companyId);
  const [levelsSearch, setLevelsSearch] = useState("");
  const getLevelName = useLevelName();

  const filteredLevels = levels
    ? Object.values(levels)
        .map((level) => ({
          id: level.id.toString(),
          label: getLevelName({ levelId: level.id, levelName: level.name }),
        }))
        .filter((level) =>
          level.label.toLowerCase().includes(levelsSearch.toLowerCase()),
        )
    : [];

  // Load and filter categories
  const { data: categories } = useFetchCategories(companyId);
  const [categoriesSearch, setCategoriesSearch] = useState("");

  const filteredCategories =
    categories
      ?.map((category) => ({
        id: category.id.toString(),
        label: category.name,
      }))
      .filter((category) =>
        category.label.toLowerCase().includes(categoriesSearch.toLowerCase()),
      ) ?? [];

  return {
    fields: {
      "activity-category": {
        id: SessionFilterTypes.ACTIVITY_CATEGORY,
        label: t("table.filters.activityCategory.label"),
        availableFilters: [SessionFilters.FILTER_IS],
        values: filteredCategories,
        multiSelect: true,
        searchConfig: {
          value: categoriesSearch,
          onChange: (value: string) => {
            setCategoriesSearch(value);
          },
          placeholder: t("table.filters.searchPlaceholder"),
        },
      },
      "activity-type": {
        id: SessionFilterTypes.ACTIVITY_TYPE,
        label: t("table.filters.activityType.label"),
        availableFilters: [SessionFilters.FILTER_IS],
        values: [
          {
            id: ActivityTypeFilterValues.GROUP_ACTIVITY,
            label: t("table.filters.activityType.groupActivity"),
          },
          {
            id: ActivityTypeFilterValues.WORKSHOP,
            label: t("table.filters.activityType.workshop"),
          },
        ],
        multiSelect: false,
      },
      establishment: {
        id: SessionFilterTypes.ESTABLISHMENT,
        label: t("table.filters.establishment.label"),
        availableFilters: [SessionFilters.FILTER_IS],
        values: establishments || [],
        multiSelect: true,
        searchConfig: {
          value: establishmentInputValue,
          onChange: (value: string) => {
            setEstablishmentInputValue(value);
            debouncedSetDebouncedEstablishmentSearch(value);
          },
          placeholder: t("table.filters.searchPlaceholder"),
        },
      },
      level: {
        id: SessionFilterTypes.LEVEL,
        label: t("table.filters.level.label"),
        availableFilters: [SessionFilters.FILTER_IS],
        values: filteredLevels,
        multiSelect: true,
        searchConfig: {
          value: levelsSearch,
          onChange: (value: string) => {
            setLevelsSearch(value);
          },
          placeholder: t("table.filters.searchPlaceholder"),
        },
      },
      teacher: {
        id: SessionFilterTypes.TEACHER,
        label: t("table.filters.teacher.label"),
        availableFilters: [SessionFilters.FILTER_IS],
        values: teachers || [],
        multiSelect: true,
        searchConfig: {
          value: teacherInputValue,
          onChange: (value: string) => {
            setTeacherInputValue(value);
            debouncedSetDebouncedSearch(value);
          },
          placeholder: t("table.filters.searchPlaceholder"),
        },
      },
      "teacher-substitution": {
        id: SessionFilterTypes.TEACHER_SUBSTITUTION,
        label: t("table.filters.teacherSubstitution.label"),
        availableFilters: [SessionFilters.FILTER_IS],
        values: [
          {
            id: TeacherSubstitutionFilterValues.CONFIRMED,
            label: t("table.filters.teacherSubstitution.confirmed"),
          },
          {
            id: TeacherSubstitutionFilterValues.PENDING,
            label: t("table.filters.teacherSubstitution.pending"),
          },
        ],
        multiSelect: false,
      },
      visibility: {
        id: SessionFilterTypes.VISIBILITY,
        label: t("table.filters.visibility.label"),
        availableFilters: [SessionFilters.FILTER_IS, SessionFilters.FILTER_NOT],
        values: [
          {
            id: VisibilityFilterValues.AGGREGATORS,
            label: t("table.filters.visibility.aggregators"),
          },
          {
            id: VisibilityFilterValues.MEMBERS,
            label: t("table.filters.visibility.members"),
          },
        ],
        multiSelect: false,
      },
    },
    filters: [
      {
        id: SessionFilters.FILTER_IS,
        label: t("table.filters.is"),
      },
      {
        id: SessionFilters.FILTER_NOT,
        label: t("table.filters.not"),
      },
    ],
    selectFieldLabel: t("table.filters.label"),
    onFilterChange: setFilters,
  };
};
