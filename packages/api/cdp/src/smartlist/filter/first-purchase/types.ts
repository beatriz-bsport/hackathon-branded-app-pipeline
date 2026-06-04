import type {
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

export enum SmartlistPaymentComparator {
  LTE = 1,
  GTE = 2,
  LT = 3,
  GT = 4,
  EQUAL = 5,
  BETWEEN = 6,
}

/**
 * Smartlist first purchase filter data contract.
 * Endpoint family: `/customer-data-platform/v1/smartlist/first_purchase/`.
 */
export type FirstPurchaseFilter = SmartlistFilterPayload & {
  company_id: number;
  first_payment_is_done: boolean;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string;
  date_second: string;
  duration: number;
  duration_second: number;
  value_payment_active: boolean;
  comparator_payment: SmartlistPaymentComparator;
  value_payment: number;
  value_second_payment: number;
};

export type CreateFirstPurchaseFilterPayload = Omit<
  FirstPurchaseFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateFirstPurchaseFilterPayload = Partial<
  Omit<
    FirstPurchaseFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
