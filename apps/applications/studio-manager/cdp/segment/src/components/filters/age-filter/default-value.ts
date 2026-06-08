import { AGE_FILTER_NUMBER_TYPE } from "./constants";
import type { AgeFilterFormValue } from "./types";

export const createDefaultAgeFilter = (
  smartlistId: number,
): AgeFilterFormValue => ({
  smartlist: smartlistId,
  type: AGE_FILTER_NUMBER_TYPE.greaterOrEqual,
  value: 0,
  secondValue: null,
});
