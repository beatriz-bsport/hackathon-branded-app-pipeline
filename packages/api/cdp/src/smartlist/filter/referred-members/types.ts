import type { SmartlistFilterPayload } from "../../shared/types";
import type { SmartlistReferralMoneyComparator } from "./constants";

/**
 * Smartlist referred member filter data contract.
 * Endpoint family: `/customer-data-platform/v1/smartlist/referred_members/`.
 */
export type ReferredMemberFilter = SmartlistFilterPayload & {
  company_id: number;
  is_referred: boolean;
  money_obtained_active: boolean;
  money_obtained_comparator: SmartlistReferralMoneyComparator;
  money_obtained: number;
  money_obtained_second: number;
};

export type CreateReferredMemberFilterPayload = Omit<
  ReferredMemberFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateReferredMemberFilterPayload = Partial<
  Omit<
    ReferredMemberFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
