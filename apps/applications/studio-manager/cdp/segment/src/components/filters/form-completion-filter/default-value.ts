import { CUSTOM_FORM_COMPLETION_CONDITION } from "@bsport/api-cdp/smartlist";

import type { FormCompletionFilterFormValue } from "./types";

/**
 * Default form values for a new custom form completion filter row.
 */
export const createDefaultFormCompletionFilter = (
  smartlistId: number,
): FormCompletionFilterFormValue => ({
  smartlist: smartlistId,
  all_selected_must_fulfill_condition_v2:
    CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM,
  custom_forms: [],
});
