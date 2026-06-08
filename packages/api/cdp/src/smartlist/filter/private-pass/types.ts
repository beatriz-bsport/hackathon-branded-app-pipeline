import type {
  SmartlistCreditComparator,
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

/**
 * Smartlist appointment pass (private pass) filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/private_pass/
 */
export type PrivatePassFilter = SmartlistFilterPayload & {
  company_id: number;
  private_passes: number[];
  select_all_private_passes: boolean;
  has_pack: boolean;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date_bought: string;
  date_bought_second: string;
  duration_bought: number;
  duration_bought_second: number;
  credit_filter_active: boolean;
  credit_comparator: SmartlistCreditComparator;
  credit_value: string | number;
  credit_value_second: string | number;
  expiration_date_filter_active: boolean;
  expiration_date_filter_type: SmartlistDateFilterType;
  expiration_date: string;
  expiration_date_second: string;
  expiration_duration: number;
  expiration_duration_second: number;
};

export type CreatePrivatePassFilterPayload = Omit<
  PrivatePassFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdatePrivatePassFilterPayload = Partial<
  Omit<
    PrivatePassFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
