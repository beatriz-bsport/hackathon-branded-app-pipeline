import type {
  TermsAndConditionsFilterCreatePayload,
  TermsAndConditionsFilterFormValue,
} from "../types";

/**
 * Builds the `POST /terms_and_conditions/` payload from a form value.
 */
export const createTermsAndConditionsFilterPayload = (
  value: TermsAndConditionsFilterFormValue,
): TermsAndConditionsFilterCreatePayload => ({
  smartlist: value.smartlist,
  value: value.value,
});
