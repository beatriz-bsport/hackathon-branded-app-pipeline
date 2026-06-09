import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Smartlist terms and conditions filter (filter identifier 107).
 * Endpoint family: `/customer-data-platform/v1/smartlist/terms_and_conditions/`
 */
export type TermsAndConditionsFilter = SmartlistFilterPayload & {
  company: number;
  value: boolean;
};

export type CreateTermsAndConditionsFilterPayload = Pick<
  TermsAndConditionsFilter,
  "smartlist" | "value"
>;

export type UpdateTermsAndConditionsFilterPayload = Partial<
  Pick<TermsAndConditionsFilter, "value">
>;

export type UpsertTermsAndConditionsFilterVariables = {
  filterId?: number;
  createPayload?: CreateTermsAndConditionsFilterPayload;
  updatePayload?: UpdateTermsAndConditionsFilterPayload;
};
