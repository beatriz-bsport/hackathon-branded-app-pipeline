import type { Establishment } from '#libs/establishment/types';
import { AccessStatus, EntryStatus } from './constants';

import type { Member, MemberMinimal } from '#libs/member/types';
import type { ErrorAndLoading, WithPagination } from '#libs/types';

/** API TYPES */

export type CheckOnBookings = {
  is_valid: boolean;
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
};

export type AccessStatusData = {
  access_status: AccessStatus;
  check_on_bookings: CheckOnBookings;
  check_on_passes: CheckOnPasses;
  check_on_member_account: CheckOnMemberAccount;
};

export type MemberVisitREST = {
  access_status_data: AccessStatusData;
  access_status: AccessStatus;
  datetime_created: string;
  establishments?: number;
  entry_status: EntryStatus;
  id: number;
  initial_access_status: AccessStatus;
  last_update: string;
  member: MemberMinimal;
  staff_user?: number;
};

/** COMMON TYPES */

// TODO: Update
export type MemberVisit = Omit<MemberVisitREST, 'member' | 'establishment'> & {
  establishment?: Establishment;
  member: Member;
};

/** REDUX STATE TYPE */

type StoreSection<ObjectType> = {
  allIds: number[];
  byId: {
    [id: number]: ObjectType;
  };
} & WithPagination &
  ErrorAndLoading;

export type AccessControlState = {
  memberVisit: StoreSection<MemberVisitREST>;
};

/** OTHER TYPES */

export type MemberVisitQueryParams = {
  page_size: number;
  page: number;
  member?: number;
  access_status?: AccessStatus;
  entry_status?: EntryStatus;
  staff_user?: number;
};
