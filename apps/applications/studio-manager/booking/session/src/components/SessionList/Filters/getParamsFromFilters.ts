import { FetchSessionsParams } from "@bsport/api-book";
import { FilterElementState } from "@bsport/kaizen-primitive-core";

import {
  ActivityTypeFilterValues,
  SessionFilterTypes,
  SessionFilters,
  TeacherSubstitutionFilterValues,
  VisibilityFilterValues,
} from "./types";

const getActivityTypeParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const filterValue = filter.valueIds[0];
  if (filterValue === ActivityTypeFilterValues.GROUP_ACTIVITY) {
    return { is_workshop: false };
  }
  if (filterValue === ActivityTypeFilterValues.WORKSHOP) {
    return { is_workshop: true };
  }
  return null;
};

const getEstablishmentParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const establishmentIds = filter.valueIds.map((id) => Number(id));
  return {
    establishments: establishmentIds,
  };
};

const getTeacherParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const teacherIds = filter.valueIds.map((id) => Number(id));
  return {
    coaches: teacherIds,
  };
};

const getTeacherSubstitutionParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const filterValue = filter.valueIds[0];
  if (filterValue === TeacherSubstitutionFilterValues.CONFIRMED) {
    return {
      coach_override__isnull: false,
    };
  }
  if (filterValue === TeacherSubstitutionFilterValues.PENDING) {
    return {
      has_active_sub_teacher_request: true,
    };
  }
  return null;
};

const getVisibilityParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const filterValue = filter.valueIds[0];
  if (filterValue === VisibilityFilterValues.AGGREGATORS) {
    return {
      available_on_partnership: filter.filter === SessionFilters.FILTER_IS,
    };
  }
  if (filterValue === VisibilityFilterValues.MEMBERS) {
    return {
      manager_only: filter.filter !== SessionFilters.FILTER_IS,
    };
  }
  return null;
};

export const getParamsFromFilters = (
  filters: FilterElementState[],
): FetchSessionsParams => {
  return filters.reduce<FetchSessionsParams>((params, filter) => {
    if (filter.field === SessionFilterTypes.ACTIVITY_TYPE) {
      Object.assign(params, getActivityTypeParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.ESTABLISHMENT) {
      Object.assign(params, getEstablishmentParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.TEACHER_SUBSTITUTION) {
      Object.assign(params, getTeacherSubstitutionParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.TEACHER) {
      Object.assign(params, getTeacherParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.VISIBILITY) {
      Object.assign(params, getVisibilityParamFromFilter(filter));
    }
    return params;
  }, {});
};
