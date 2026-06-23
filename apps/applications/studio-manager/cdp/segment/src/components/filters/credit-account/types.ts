import type {
  CreateCreditAccountFilterPayload,
  CreditAccountFilter,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";
import type { CreditAccountNumberTypeValue } from "./constants";

export type CreditAccountNumberType = CreditAccountNumberTypeValue;

export type CreditAccountFilterFormValue = {
  id?: number;
  smartlist: number;
  type: CreditAccountNumberType;
  value: number;
  secondValue: number | null;
};

export type CreditAccountFilterDirtyPatchPayload = Partial<
  Omit<
    CreditAccountFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;

export type CreditAccountFilterCreatePayload = CreateCreditAccountFilterPayload;

export type CreditAccountFilterCardProps =
  SegmentFilterCardProps<CreditAccountFilterFormValue>;
