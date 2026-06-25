import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import type { MemberSignUpDateFilterFormValue } from "./types";

/**
 * Default form state for a new sign-up date filter row (not persisted until save).
 * Uses the shared date primitive default: absolute "on or before" with today's date,
 * so the draft is valid and can be saved without an explicit date pick.
 */
export const createDefaultMemberSignUpDateFilter = (
  smartlistId: number,
): MemberSignUpDateFilterFormValue => {
  const defaultDate = createDefaultDateFilterValue();

  return {
    smartlist: smartlistId,
    signUpDate: {
      ...defaultDate,
    },
  };
};
