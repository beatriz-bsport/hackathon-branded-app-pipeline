import type { ConsumerPaymentPack } from '../payment-packs/types';

export type BookingBroadCastRoom = {
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

export type Booking = {
  name: string;
  nb_bookings: number;
  offer: number;
  id: number;
  member: number;
  booking_status_code: number;
  date: string;
  date_canceled: string;
  status: boolean;
  invoice?: string;
  attendance: boolean;
  date_start: string;
  offer_date_start: string;
  payment_pack: number;
  consumer_payment_pack: ConsumerPaymentPack;
  was_refunded: false;
  first_in_company: false;
};

export type BookingOption = {
  id: number;
  cancelled: boolean;
  date_start: string;
  is_convertible: boolean;
};

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
    byId: { [key: string]: BookingBroadCastRoom };
  };
  byMember: ErrorAndLoading & WithPagination & { allIds: number[] };
  asConsumer: ErrorAndLoading & WithPagination & { allIds: number[] };
  consumerDashboard: ErrorAndLoading &
    WithPagination & { allIds: number[]; next_page: number };
  byConsumerPack: ErrorAndLoading & WithPagination & { allIds: number[] };
  byOffer: ErrorAndLoading & { allIds: [] };
  createOrUpdate: ErrorAndLoading;
  bulkRetrieve: ErrorAndLoading;
  notification: ErrorAndLoading & {
    itemsById: { [key: string]: BookingCreationNotification };
    allIds: number[];
    create: ErrorAndLoading;
    delete: ErrorAndLoading;
    update: {
      id?: number | null;
      error?: Error;
    };
  };
  recurrenceRule: ErrorAndLoading &
    WithPagination & {
      byId: { [key: string]: RecurrenceRuleBooking };
      allIds: number[];
      allIds2: number[];
      next_page: null | number;
      delete: ErrorAndLoading;
      edit: ErrorAndLoading;
    };
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
