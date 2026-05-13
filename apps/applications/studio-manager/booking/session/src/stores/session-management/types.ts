export enum BookingStatusFilter {
  BOOKED = "booked",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum BookingAttendanceFilter {
  PRESENT = "present",
  ABSENT = "absent",
}

export enum BookingSourceFilter {
  STUDIO = "studio",
  AGGREGATOR = "aggregator",
}

export enum WaitlistFilter {
  ON_WAITLIST = "on_waitlist",
  IS_CONVERTIBLE = "is_convertible",
  CANCELLED = "cancelled",
}

export enum BookingOrdering {
  NEWEST_FIRST = "-date_created",
  OLDEST_FIRST = "date_created",
  MEMBER_FIRST_NAME_ASC = "member_first_name",
  MEMBER_FIRST_NAME_DESC = "-member_first_name",
  MEMBER_LAST_NAME_ASC = "member_last_name",
  MEMBER_LAST_NAME_DESC = "-member_last_name",
}

export enum BookingListedInformation {
  SPOT = "spot",
  PASS = "pass",
  NEW_MEMBER = "newMember",
  RECURRING_BOOKING = "recurringBooking",
  UNPAID_INVOICES = "unpaidInvoices",
  TAGS = "tags",
}

export interface BookingFilters {
  status: BookingStatusFilter;
  attendance: BookingAttendanceFilter | null;
  source: BookingSourceFilter | null;
  aggregatorIds: number[];
  ordering?: BookingOrdering;
}

export interface SessionManagementState {
  bookingFilters: BookingFilters;
  waitlistFilters: WaitlistFilter;
  selectedBookingId: number | null;
  selectedBookingOptionId: number | null;
  listedInformation: BookingListedInformation[];
}
