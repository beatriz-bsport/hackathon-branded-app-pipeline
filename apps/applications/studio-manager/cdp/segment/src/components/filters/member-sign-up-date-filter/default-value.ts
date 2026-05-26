import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import type { MemberSignUpDateFilterFormValue } from "./types";

/**
 * Default form state for a new sign-up date filter row (not persisted until save).
 * Uses `DATE_EXACT` semantics via the "exactly on" absolute operator per contract.
 */
export const createDefaultMemberSignUpDateFilter = (
  smartlistId: number,
): MemberSignUpDateFilterFormValue => ({
  smartlist: smartlistId,
  signUpDate: {
    ...defaultDateFilterValue,
    dateType: DATE_FILTER_TYPES.absolute,
    absolute: {
      ...defaultDateFilterValue.absolute,
      operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
      fromDate: null,
      toDate: null,
    },
  },
});
