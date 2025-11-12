import { useMemo } from "react";

import type { FilterElementState } from "../types";

export function isElementComplete(el: FilterElementState) {
  return el.field !== null && el.filter !== null && el.valueIds.length > 0;
}

export function useFiltersAppliedCount(elements: FilterElementState[]) {
  const filtersAppliedCount = useMemo(() => {
    return elements.filter((el) => isElementComplete(el)).length;
  }, [elements]);

  return filtersAppliedCount;
}
