import type { Offer, OfferBookingOption, OfferREST } from '../offer/types';
import type { PaymentPack } from '../payment-packs/types';
import type {
  StaffModificationHistory,
  BookingModificationActionIdentifier,
} from '#libs/role/types';
import type {
  RoomBlueprint,
  SpotInformation,
} from '#libs/spot-scheduling/types';
import type { Establishment } from '#libs/establishment/types';
import type { Coach } from '#libs/associated-coach/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Level } from '#libs/level/types';
import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import type {
  PrivateBooking,
  PrivateConsumerPass,
  PrivateService,
  PrivateSlot,
} from '#libs/private-service/types';
import type { WaitingListBookingOption } from '#libs/waiting-list/types';

export type BroadcastInfo = {
  id: number;
  room: string;
  domain: string;
  provider: string;
};

export type BookingCreationNotification = {
  id: number;
  kind: number;
  establishment: number;
  meta_activity: number;
  active: boolean;
  hours: number;
  email_design: number;
  notify_booking_nb: number;
};

export type RecurrenceRuleBooking = {
  id: number;
  member: number;
  delay_week: number;
  day_of_week: number;
  hour: number;
  minute: number;
  meta_activity: number;
  establishment: number;
  notify_if_booked: boolean;
};

export type Booking<BookingOffer = number, Member = number, PP = number> = {
  name: string;
  nb_bookings: number;
  offer: BookingOffer;
  id: number;
  member: Member;
  booking_status_code: number;
  date: string;
  date_canceled: string;
  status: boolean;
  invoice?: string;
  attendance: boolean;
  date_start: string;
  offer_date_start: string;
  payment_pack: PP;
  consumer_payment_pack: ConsumerPaymentPack;
  was_refunded: false;
  first_in_company: false;
  spot_id: number | null;
  staff_history: Array<
    StaffModificationHistory<BookingModificationActionIdentifier>
  >;
  attendance_date_updated: string;
  is_no_show: boolean;
  date_no_show_registered: string;
  roll_call_attendance: boolean;
  date_roll_call_last_modified: string;
};

/**
 * @description Represents a Booking following the REST API payload structure, excluding deprecated redux-selector pattern.
 */
export type BookingREST = {
  attendance: boolean;
  attendance_date_updated: string | null;
  booking_status_code: number;
  coach: number;
  coach_name: string;
  coach_override: number | null;
  consumer: number;
  consumer_payment_pack: number;
  credit_consumed: number;
  custom_level: number;
  date: string;
  date_canceled: string;
  date_no_show_registered: string | null;
  date_roll_call_last_modified: string | null;
  establishment: number;
  establishment_name: string;
  first_in_company: boolean;
  has_spivi_error: boolean | null;
  id: number;
  is_deleted: boolean;
  is_discardable: boolean;
  is_no_show: boolean;
  level: number;
  member: number;
  meta_activity: number;
  name: string;
  no_show_penalty_applied: boolean;
  offer: number;
  offer_date_start: string;
  offer_duration_minute: number;
  recurrence_rule_booking: number | null;
  roll_call_attendance: boolean | null;
  roll_call_attendance_date_updated: string | null;
  roll_call_needs_validation: boolean;
  source: number;
  source_member: number | null;
  spot_id: number | null;
  spot_information: SpotInformation | {};
  staff_history: StaffModificationHistory<BookingModificationActionIdentifier>[];
  was_refunded: boolean;
};

export type BookingOption<O = Offer> = {
  id: number;
  cancelled: boolean;
  date: string;
  is_convertible: boolean;
  waiting_list_class: number;
  consumer: number;
  member: number;
  offer: O;
  booking: number | null;
  object_type: string;
  level: number;
  establishment: number;
  coach: number;
  meta_activity: number;
  source: number;
};

export type BookingOptionWithActivity = BookingOption<OfferBookingOption>;

type ErrorAndLoading = {
  error?: Error;
  loading: boolean;
};

type WithPagination = {
  count: number;
  page: number;
};

export type BookingsState = {
  byId: { [key: string]: Booking };
  broadcast: ErrorAndLoading & {
    byId: { [key: string]: BroadcastInfo };
  };
  byMember: ErrorAndLoading & WithPagination & { allIds: number[] };
  asConsumer: ErrorAndLoading & WithPagination & { allIds: number[] };
  consumerDashboard: ErrorAndLoading &
    WithPagination & { allIds: number[]; next_page: number };
  byConsumerPack: ErrorAndLoading & WithPagination & { allIds: number[] };
  byOffer: ErrorAndLoading & { allIds: [] };
  createOrUpdate: ErrorAndLoading;
  bulkRetrieve: ErrorAndLoading;
  recurrenceRule: ErrorAndLoading &
    WithPagination & {
      byId: { [key: string]: RecurrenceRuleBooking };
      allIds: number[];
      allIds2: number[];
      next_page: null | number;
      delete: ErrorAndLoading;
      edit: ErrorAndLoading;
    };
  similar: ErrorAndLoading & {
    allIds: number[];
  };
  futureBookingsByMember: ErrorAndLoading & { allIds: number[] };
};

export type BookingsAction =
  | { type: null }
  | {
      type: 'BOOKING_OPTION_UPDATED';
      bookingOptionId: number;
      bookingOption: BookingOption;
    }
  | { type: 'START_UPDATING_BOOKING_OPTION'; bookingOptionId: number }
  | { type: 'ERROR_UPDATING_BOOKING_OPTION'; bookingOptionId: number }
  | { type: 'ERROR_UPDATING_BOOKING_STATUS'; bookingId: number }
  | { type: 'START_UPDATING_BOOKING_STATUS'; bookingId: number }
  | {
      type: 'BOOKING_STATUS_UPDATED';
      booking: Booking;
      bookingId: number;
    }
  | {
      type: 'HAS_FETCHED_BOOKINGS';
      bookings: Booking[];
      booking_options: Object;
    }
  | {
      type: 'START_FETCH_BOOKINGS';
    }
  | {
      type: 'ERROR_FETCHING_BOOKINGS';
    }
  | {
      type: 'BOOKING_ADD_SUCCESS';
      booking: Booking;
    }
  | {
      type: 'BOOKING_DELETE_SUCCESS';
      bookingId: number;
    }
  | {
      type: 'BOOKING_DELETE_ERROR';
    }
  | {
      type: 'BOOKING_DELETE_START';
    };

export type Notification = {
  kind: number;
  company: number;
  establishment?: number;
  meta_activity?: number;
  notify_booking_nb: number;
  active: boolean;
  email_design: number;
  hours: number;
};

export type BookingFilterParams = {
  mine?: boolean;
  /**
   * Use a similar filtering as `mine` without filtering the cancelled booking.\
   * This param exists to avoid breaking current mobile app behavior and old member profile interface
   */
  mine_as_consumer?: boolean;
  member?: number;
  offer_id?: number;
  id__in?: number[];
  ids_in?: number[];
  future_booking?: boolean;
  strictly_future_booking?: boolean;
  past_booking?: boolean;
  strictly_past_booking?: boolean;
  offer_is_workshop?: boolean;
  page: number;
  page_size: number;
};

export type CancelBookingParams = {
  bookingId: number;
  force_notify?: boolean;
  force_refund?: boolean;
  activity_group?: number;
  bookings_in_same_group?: number[];
};

export type CancelPrivateBookingFilterParams = {
  force_refund?: boolean;
  send_mail?: boolean;
};

/** Transformed Booking for the consumer page by including full objects */
export type ConsumerBooking = Omit<
  BookingREST,
  | 'establishment'
  | 'coach'
  | 'coach_override'
  | 'meta_activity'
  | 'level'
  | 'offer'
  | 'consumer_payment_pack'
> & {
  establishment: Establishment;
  coach: Coach;
  coach_override: Coach;
  meta_activity: MetaActivity;
  level: Level;
  offer: OfferREST;
  consumer_payment_pack: ConsumerPaymentPack<PaymentPack>;
  room_blueprint?: RoomBlueprint;
};

/** Transformed PrivateBooking for the consumer page by including full objects */
export type ConsumerPrivateBooking = Omit<
  PrivateBooking,
  | 'private_consumer_pass'
  | 'private_service'
  | 'private_slot'
  | 'establishment'
  | 'coach'
> & {
  private_consumer_pass: PrivateConsumerPass;
  private_service: PrivateService;
  private_slot: PrivateSlot;
  establishment: Establishment;
  coach: Coach;
};

/** Transformed WaitingListBookingOption for the consumer page by including full objects */
export type ConsumerBookingOption = Omit<
  WaitingListBookingOption,
  'establishment' | 'level' | 'booking' | 'coach' | 'meta_activity' | 'offer'
> & {
  offer: OfferBookingOption;
  establishment: Establishment;
  level: Level;
  booking: BookingREST;
  coach: Coach;
  meta_activity: MetaActivity;
};

/** Exclusively for consumer space, used in consumer bookings data manager hook */
export type ConsumerSpaceCancelBookingParams = {
  isRefundingCredit: boolean;
  bookingId?: number;
  privateBookingId?: number;
  bookingOptionId?: number;
};
