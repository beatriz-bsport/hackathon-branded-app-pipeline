import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Smartlist has password filter (filter identifier 400).
 * Endpoint family: `/customer-data-platform/v1/smartlist/has_password/`
 */
export type HasPasswordFilter = SmartlistFilterPayload & {
  company_id: number;
  value: boolean;
};

export type CreateHasPasswordFilterPayload = Pick<
  HasPasswordFilter,
  "smartlist" | "value"
>;

export type UpdateHasPasswordFilterPayload = Partial<
  Pick<HasPasswordFilter, "value">
>;

export type UpsertHasPasswordFilterVariables = {
  filterId?: number;
  createPayload?: CreateHasPasswordFilterPayload;
  updatePayload?: UpdateHasPasswordFilterPayload;
};
