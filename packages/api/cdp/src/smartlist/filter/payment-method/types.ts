import type {
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

/**
 * Smartlist saved payment method filter (filter identifier 600).
 * Endpoint family: `/customer-data-platform/v1/smartlist/payment_method/`.
 */
export type PaymentMethodFilter = SmartlistFilterPayload & {
  company: number;
  owns_payment_method: boolean;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string | null;
  date_second: string | null;
  duration: number;
  duration_second: number;
  payment_method_kind_filter_active: boolean;
  kind_value: number | null;
};

export type CreatePaymentMethodFilterPayload = Omit<
  PaymentMethodFilter,
  "id" | "company" | "filter_identifier"
>;

export type UpdatePaymentMethodFilterPayload = Partial<
  Omit<
    PaymentMethodFilter,
    "id" | "company" | "smartlist" | "filter_identifier"
  >
>;

export type UpsertPaymentMethodFilterVariables = {
  filterId?: number;
  createPayload?: CreatePaymentMethodFilterPayload;
  updatePayload?: UpdatePaymentMethodFilterPayload;
};
