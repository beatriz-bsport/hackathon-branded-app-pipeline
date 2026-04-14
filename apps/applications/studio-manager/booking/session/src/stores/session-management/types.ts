export enum BookingStatusFilter {
  BOOKED = "booked",
  CANCELLED = "cancelled",
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
  REMOVED = "removed",
}

export interface BookingFilters {
  status: BookingStatusFilter;
  attendance: BookingAttendanceFilter | null;
  source: BookingSourceFilter | null;
  aggregatorIds: number[];
}

export interface SessionManagementState {
  bookingFilters: BookingFilters;
  waitlistFilters: WaitlistFilter;
}
