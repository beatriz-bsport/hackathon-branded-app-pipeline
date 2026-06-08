import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Smartlist has phone filter (filter identifier 106).
 * Endpoint family: `/customer-data-platform/v1/smartlist/has_phone/`
 */
export type HasPhoneFilter = SmartlistFilterPayload & {
  company: number;
  value: boolean;
};

export type CreateHasPhoneFilterPayload = Pick<
  HasPhoneFilter,
  "smartlist" | "value"
>;

export type UpdateHasPhoneFilterPayload = Partial<
  Pick<HasPhoneFilter, "value">
>;
