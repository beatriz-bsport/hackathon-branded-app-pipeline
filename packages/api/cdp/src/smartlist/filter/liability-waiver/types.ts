import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Smartlist liability waiver filter (filter identifier 410).
 * Endpoint family: `/customer-data-platform/v1/smartlist/waiver/`
 */
export type LiabilityWaiverFilter = SmartlistFilterPayload & {
  company_id: number;
  value: boolean;
};

export type CreateLiabilityWaiverFilterPayload = Pick<
  LiabilityWaiverFilter,
  "smartlist" | "value"
>;

export type UpdateLiabilityWaiverFilterPayload = Partial<
  Pick<LiabilityWaiverFilter, "value">
>;

export type UpsertLiabilityWaiverFilterVariables = {
  filterId?: number;
  createPayload?: CreateLiabilityWaiverFilterPayload;
  updatePayload?: UpdateLiabilityWaiverFilterPayload;
};
