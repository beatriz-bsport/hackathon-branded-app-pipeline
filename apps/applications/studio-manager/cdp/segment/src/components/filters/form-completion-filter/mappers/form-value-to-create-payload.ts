import type {
  FormCompletionFilterCreatePayload,
  FormCompletionFilterFormValue,
} from "../types";

/**
 * Builds the POST body for a new custom form completion filter row.
 */
export const toCreatePayload = (
  value: FormCompletionFilterFormValue,
): FormCompletionFilterCreatePayload => ({
  smartlist: value.smartlist,
  is_v2: true,
  all_selected_must_fulfill_condition_v2:
    value.all_selected_must_fulfill_condition_v2,
  custom_forms: value.custom_forms,
});
