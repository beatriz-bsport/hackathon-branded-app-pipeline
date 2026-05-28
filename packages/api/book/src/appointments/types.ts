// #region Params

/**
 * Query parameters for fetching appointments
 */
export type FetchAppointmentsParams = {
  /** When true, restrict to appointments belonging to the current user's company. */
  mine?: boolean;
};

/**
 * Query parameters for fetching appointment slots
 */
export type FetchAppointmentSlotsParams = {
  /** Single appointment id whose slots should be listed. */
  private_service?: number;
  /** Batched form — fetch slots for every appointment id in the list. */
  private_service__in?: number[];
};

// #endregion

// ----------------------------------------------------------------------------

// #region Models

/**
 * Model: PrivateService (renamed to Appointment in the new product naming).
 * Router: `book/v1/private_service/private_service/`.
 */
export type Appointment = {
  id: number;
  name: string;
  description: string;
  private_service_group: number | null;
  available: boolean;
  establishments: number[];
  coach_capacity_used: number;
  use_full_establishment_capacity: boolean;
  coaches: number[];
  color: string;
  company: number;
  slots: number[];
  establishment_attribution: number;
  is_home_service: boolean;
  coach_attribution: number;
  manager_only: boolean;
  has_own_availability_slots: boolean;
  last_discard_minutes: number;
  last_booking_minutes: number;
  cover_main: string;
  slots_duration_minute: number[];
  availability_padding_start_minutes: number;
  availability_padding_end_minutes: number;
  allow_unpaid_booking: boolean;
  unpaid_whitelist_tags: number[];
  unpaid_blacklist_tags: number[];
  member_whitelist_tags: number[];
  member_blacklist_tags: number[];
  pad_before_booking: boolean;
  available_on_partnership: boolean;
};

/**
 * Model: PrivateSlot (renamed to AppointmentSlot in the new product naming).
 * Router: `book/v1/private_service/private_slot/`.
 */
export type AppointmentSlot = {
  id: number;
  name: string;
  private_service: number;
  credit: number;
  duration_minutes: number;
  available: boolean;
  people_capacity_used: number;
  booking_interval_minutes: number;
};

// #endregion
