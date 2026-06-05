import type {
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";
import type { SmartlistPaymentComparator } from "../first-purchase/types";

/**
 * Smartlist abandoned basket filter data contract.
 * Endpoint family: `/customer-data-platform/v1/smartlist/basket_abandonment/`.
 */
export type BasketAbandonmentFilter = SmartlistFilterPayload & {
  company_id: number;
  comparator: SmartlistPaymentComparator;
  basket_value: number;
  basket_value_second: number;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string | null;
  date_second: string | null;
  duration: number | null;
  duration_second: number | null;
};

export type CreateBasketAbandonmentFilterPayload = Omit<
  BasketAbandonmentFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateBasketAbandonmentFilterPayload = Partial<
  Omit<
    BasketAbandonmentFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
