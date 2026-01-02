import type { Establishment } from '#src/libs/establishment/types';

import type { Member, MemberMinimal } from '#src/libs/member/types';
import type { ErrorAndLoading, WithPagination } from '#src/libs/types';
import type { SpotInformation } from '#src/libs/spot-scheduling/types';
import { AccessStatus, EntryStatus } from './constants';

/** API TYPES */

export type CheckOnBookings = {
  is_valid: boolean;
  most_relevant_booking_data: {
    booking_name: string;
  } | null;
  bookings_in_other_establishments: {
    booking_name: string;
    establishment_name: string;
  }[];
};

interface CommonPassFields {
  is_disabled: boolean;
  is_linked_to_paused_subscription: boolean;
  is_valid: boolean;
  pass_name: string;
  expiration_date: string;
}

interface PaymentPackFields extends CommonPassFields {
  is_incompatible_with_establishments: boolean;
  is_restricted_by_off_peak_schedule: boolean;
  is_restricted_to_vod: boolean;
  pass_type: 'payment_pack';
}

interface PrivatePassFields extends CommonPassFields {
  is_incompatible_with_appointments_in_establishments: boolean;
  pass_type: 'private_pass';
}

export type PassCheckResult = PaymentPackFields | PrivatePassFields;
export type PassCheckResultInclusive = Partial<
  PaymentPackFields & PrivatePassFields
>;

export type CheckOnPasses = {
  is_valid: boolean;
  most_relevant_pass_data: PassCheckResult;
  number_of_checked_passes: number;
};

export type CheckOnMemberAccount = {
  is_valid: boolean;
  has_unpaid_invoices: boolean;
  has_negative_account_balance: boolean;
  has_unpaid_appointments: boolean;
  last_photo_update_is_not_approved: boolean;
};

export type AccessStatusData = {
  access_status: AccessStatus;
  check_on_bookings: CheckOnBookings;
  check_on_passes: CheckOnPasses;
  check_on_member_account: CheckOnMemberAccount;
};

export type DoorAccess = {
  door_id: string;
  distance: number | null;
};

export type MemberVisitREST = {
  access_status_data: AccessStatusData;
  access_status: AccessStatus;
  datetime_created: string;
  door_access?: DoorAccess;
  establishments?: number[];
  entry_status: EntryStatus;
  id: number;
  initial_access_status: AccessStatus;
  last_update: string;
  member: MemberMinimal;
  staff_user?: number;
};

export type AccessControlPolicy = {
  booked_session_time_interval_before_visit: string;
  booked_session_time_interval_after_visit: string;
};

export type AccessControlBookingOrPrivateBooking = {
  booking_type: 'booking' | 'private_booking';
  booking?: {
    id: number;
    name: string;
    offer_date_start: string;
    coach_name: string;
    establishment_name: string;
    spot_id: number;
    spot_information: SpotInformation;
    is_spot_scheduling_enabled: boolean;
  };
  private_booking?: {
    id: number;
    name: string;
    date_start: string;
    coach_name: string;
    establishment_name: string;
    is_at_home: boolean;
  };
};

export type UserPhotoUpdate = {
  uuid: string;
  datetime_created: string;
  approved_by_manager: boolean;
  previous_photo: string;
  new_photo: string;
};

/** COMMON TYPES */

// TODO: Update
export type MemberVisit = Omit<MemberVisitREST, 'member' | 'establishment'> & {
  establishment?: Establishment;
  member: Member;
};

/** REDUX STATE TYPE */

type StoreSection<ObjectType, IdType extends string | number = number> = {
  allIds: IdType[];
  byId: Record<IdType, ObjectType>;
} & WithPagination &
  ErrorAndLoading;

export type AccessControlState = {
  memberVisit: StoreSection<MemberVisitREST> & {
    unreadCount: number;
  };
  policy: { policy: AccessControlPolicy } & ErrorAndLoading;
  nextBookingOrPrivateBooking: {
    bookingOrPrivateBooking?: AccessControlBookingOrPrivateBooking;
  } & ErrorAndLoading;
  userPhotoUpdate: StoreSection<UserPhotoUpdate, string>;
};

/** OTHER TYPES */

export type MemberVisitQueryParams = {
  page_size?: number;
  page?: number;
  member?: number;
  access_status?: AccessStatus;
  entry_status?: EntryStatus;
  staff_user?: number;
  datetime_created_after?: string;
  datetime_created_before?: string;
};
