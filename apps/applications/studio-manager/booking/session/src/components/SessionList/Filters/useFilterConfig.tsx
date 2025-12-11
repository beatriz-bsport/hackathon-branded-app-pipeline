import type { FilterProps } from "@bsport/kaizen-primitive-core";

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

  return {
    fields: {
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
