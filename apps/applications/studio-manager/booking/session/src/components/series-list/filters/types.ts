import type {
  GroupSessionStatus,
  PaginatedGroupSessionParams,
} from "@bsport/api-book";

import type { SeriesBookingRule } from "#src/utils/series-booking-rule";

export enum SeriesFilterField {
  SERVICE = "service",
  BOOKING_RULE = "booking-rule",
  STATUS = "status",
}

export enum SeriesFilterOperator {
  FILTER_IS = "is",
}

export type SeriesFilterParams = Pick<
  PaginatedGroupSessionParams,
  | "allow_booking_after_start"
  | "full_booking_only"
  | "meta_activity__in"
  | "status"
>;

export type SeriesFilterStatus = GroupSessionStatus;

export type SeriesFilterBookingRule = SeriesBookingRule;
