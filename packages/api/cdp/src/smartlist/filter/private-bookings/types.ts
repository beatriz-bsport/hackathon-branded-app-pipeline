import type {
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

/**
 * Comparator values for {@link PrivateBookingsFilter} (total appointments).
 * Values 3 (LT) and 4 (GT) are not implemented in `do_filter` on the backend.
 */
export enum SmartlistPrivateBookingsComparator {
  LTE = 1,
  GTE = 2,
  EQUAL = 5,
  BETWEEN = 6,
}

/**
 * Smartlist private bookings filter data contract (filter identifier 26).
 * Counts OK private appointments per member with optional scope.
 * Endpoint family: `/customer-data-platform/v1/smartlist/private_bookings/`
 */
export type PrivateBookingsFilter = SmartlistFilterPayload & {
  company_id: number;
  comparator: SmartlistPrivateBookingsComparator;
  value: number;
  value_second: number;
  select_all_establishments: boolean;
  establishment_filter_active: boolean;
  establishments: number[];
  at_home: boolean;
  select_all_private_services: boolean;
  private_service_filter_active: boolean;
  private_services: number[];
  select_all_private_passes: boolean;
  private_pass_filter_active: boolean;
  private_passes: number[];
  select_all_coaches: boolean;
  coach_filter_active: boolean;
  coaches: number[];
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string | null;
  date_second: string | null;
  duration: number | null;
  duration_second: number | null;
  hour_filter_active: boolean | null;
  hour: string | null;
  hour_second: string | null;
};

export type CreatePrivateBookingsFilterPayload = Omit<
  PrivateBookingsFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdatePrivateBookingsFilterPayload = Partial<
  Omit<
    PrivateBookingsFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
