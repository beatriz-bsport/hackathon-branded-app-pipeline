import type {
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

export enum SmartlistTotalBookingComparator {
  LTE = 1,
  GTE = 2,
  EQUAL = 5,
  BETWEEN = 6,
}

/**
 * Smartlist bookings filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/bookings/
 */
export type TotalBookingFilter = SmartlistFilterPayload & {
  company_id: number;
  comparator: SmartlistTotalBookingComparator;
  value: number;
  value_second: number;
  select_all_activities: boolean;
  activity_filter_active: boolean;
  meta_activities: number[];
  select_all_establishments: boolean;
  establishment_filter_active: boolean;
  establishments: number[];
  select_all_payment_packs: boolean;
  payment_pack_filter_active: boolean;
  payment_packs: number[];
  select_all_coaches: boolean;
  coach_filter_active: boolean;
  coaches: number[];
  level_filter_active: boolean;
  level: number[];
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string | null;
  date_second: string | null;
  duration: number | null;
  duration_second: number | null;
  hour_filter_active: boolean | null;
  hour: string | null;
  hour_second: string | null;
  attendance_filter_active: boolean | null;
  attendance: boolean | null;
};

export type CreateTotalBookingFilterPayload = Omit<
  TotalBookingFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateTotalBookingFilterPayload = Partial<
  Omit<
    TotalBookingFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
