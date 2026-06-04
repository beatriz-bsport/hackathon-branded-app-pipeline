import type { SmartlistFilterPayload } from "../../shared/types";

export const GenderFilterValue = {
  MALE: "M",
  FEMALE: "F",
} as const;

export type GenderFilterValue =
  (typeof GenderFilterValue)[keyof typeof GenderFilterValue];

/**
 * Smartlist gender filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/gender_filter/
 */
export type GenderFilter = SmartlistFilterPayload & {
  company_id: number;
  value: GenderFilterValue;
};

export type CreateGenderFilterPayload = Pick<
  GenderFilter,
  "smartlist" | "value"
>;

export type UpdateGenderFilterPayload = Partial<Pick<GenderFilter, "value">>;
