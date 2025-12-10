import { FetchSessionsParams } from "@bsport/api-book";
import { FilterElementState } from "@bsport/kaizen-primitive-core";

import {
  ActivityTypeFilterValues,
  SessionFilterTypes,
  SessionFilters,
  VisibilityFilterValues,
} from "./types";

export const getActivityTypeParamFromFilter = (
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

export const getVisibilityParamFromFilter = (
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
    } else if (filter.field === SessionFilterTypes.VISIBILITY) {
      Object.assign(params, getVisibilityParamFromFilter(filter));
    }
    return params;
  }, {});
};
