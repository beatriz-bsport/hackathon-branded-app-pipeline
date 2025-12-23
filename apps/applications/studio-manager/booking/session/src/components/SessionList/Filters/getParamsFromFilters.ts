import first from "lodash/first";

import { FetchSessionsParams } from "@bsport/api-book";
import { FilterElementState } from "@bsport/kaizen-primitive-core";

import {
  ActivityTypeFilterValues,
  SessionFilterTypes,
  SessionFilters,
  TeacherSubstitutionFilterValues,
  VisibilityFilterValues,
} from "./types";

const getActivityCategoryParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const categoryIds = filter.valueIds.map((id) => Number(id));
  if (categoryIds.length === 0) {
    return null;
  }
  return {
    category__in: categoryIds,
  };
};
const getActivityTypeParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const filterValue = first(filter.valueIds);
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
  if (establishmentIds.length === 0) {
    return null;
  }
  return {
    establishments: establishmentIds,
  };
};

const getLocationParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const locationIds = filter.valueIds.map((id) => Number(id));
  if (locationIds.length === 0) {
    return null;
  }
  return {
    establishment_group__in: locationIds,
  };
};

const getLevelParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const levelIds = filter.valueIds.map((id) => Number(id));
  if (levelIds.length === 0) {
    return null;
  }
  return {
    levels: levelIds,
  };
};

const getTeacherParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const teacherIds = filter.valueIds.map((id) => Number(id));
  if (teacherIds.length === 0) {
    return null;
  }
  return {
    coaches: teacherIds,
  };
};

const getTeacherSubstitutionParamFromFilter = (
  filter: FilterElementState,
): Partial<FetchSessionsParams> | null => {
  const filterValue = first(filter.valueIds);
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
  const filterValue = first(filter.valueIds);
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
    if (filter.field === SessionFilterTypes.ACTIVITY_CATEGORY) {
      Object.assign(params, getActivityCategoryParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.ACTIVITY_TYPE) {
      Object.assign(params, getActivityTypeParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.ESTABLISHMENT) {
      Object.assign(params, getEstablishmentParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.LOCATION) {
      Object.assign(params, getLocationParamFromFilter(filter));
    } else if (filter.field === SessionFilterTypes.LEVEL) {
      Object.assign(params, getLevelParamFromFilter(filter));
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
