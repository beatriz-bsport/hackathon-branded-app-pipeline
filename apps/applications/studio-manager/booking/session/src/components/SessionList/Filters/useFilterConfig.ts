import { useCallback, useRef } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";

import { sessionListFiltersChangedEvent } from "#src/events/session-list/events";
import {
  selectFilters,
  setFilters,
  useSessionListStore,
} from "#src/stores/session-list";
import { analyticsTrackEvent } from "#src/utils/analytics-track-event";
import { useTranslation } from "#src/utils/i18n";

import {
  ActivityTypeFilterValues,
  SessionFilterTypes,
  SessionFilters,
  TeacherSubstitutionFilterValues,
  VisibilityFilterValues,
} from "./types";
import { useActivityNameFilter } from "./use-activity-name-filter";
import { useCategoryFilter } from "./use-category-filter";
import { useEstablishmentFilter } from "./use-establishment-filter";
import { useLevelFilter } from "./use-level-filter";
import { useLocationFilter } from "./use-location-filter";
import { useTeacherFilter } from "./use-teacher-filter";

export const useFilterConfig = () => {
  const { t } = useTranslation("sessionList");
  const filters = useSessionListStore(selectFilters);
  const filterRef = useRef<{ resetFilters: () => void }>(null);

  const teacherFilter = useTeacherFilter();
  const establishmentFilter = useEstablishmentFilter();
  const {
    shouldDisplayFilter: shouldDisplayLocationFilter,
    filterConfig: locationFilter,
  } = useLocationFilter();
  const levelFilter = useLevelFilter();
  const categoryFilter = useCategoryFilter();
  const activityNameFilter = useActivityNameFilter();

  const onFilterChange = useCallback((newFilters: FilterElementState[]) => {
    analyticsTrackEvent(sessionListFiltersChangedEvent, {
      filters: newFilters,
    });
    setFilters(newFilters);
  }, []);

  const filterConfig: FilterProps = {
    fields: {
      "activity-category": categoryFilter,
      "activity-name": activityNameFilter,
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
      establishment: establishmentFilter,
      ...(shouldDisplayLocationFilter
        ? {
            location: locationFilter,
          }
        : {}),
      level: levelFilter,
      teacher: teacherFilter,
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
    onFilterChange,
    defaultFilters: filters,
  };

  return {
    filterConfig,
    resetFilters: filterRef?.current?.resetFilters,
    sessionFiltersRef: filterRef,
  };
};
