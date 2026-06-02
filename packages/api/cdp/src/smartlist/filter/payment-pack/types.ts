import type {
  SmartlistCreditComparator,
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

/**
 * Smartlist payment pack filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/payment_pack/
 */
export type PaymentPackFilter = SmartlistFilterPayload & {
  company_id: number;
  payment_packs: number[];
  select_all_payment_packs: boolean;
  has_pack: boolean;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date_bought: string; // ISO 8601 datetime string
  date_bought_second: string; // ISO 8601 datetime string
  duration_bought: number; // number of days, can be negative
  duration_bought_second: number; // number of days, can be negative
  credit_filter_active: boolean;
  credit_comparator: SmartlistCreditComparator;
  credit_value: string | number; // number of credits, only positive
  credit_value_second: string | number; // number of credits, only positive
  expiration_date_filter_active: boolean;
  expiration_date_filter_type: SmartlistDateFilterType;
  expiration_date: string; // ISO 8601 datetime string
  expiration_date_second: string; // ISO 8601 datetime string
  expiration_duration: number; // number of days, can be negative
  expiration_duration_second: number; // number of days, can be negative
};

export type CreatePaymentPackFilterPayload = Omit<
  PaymentPackFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdatePaymentPackFilterPayload = Partial<
  Omit<
    PaymentPackFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
