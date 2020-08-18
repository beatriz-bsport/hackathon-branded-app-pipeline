// @flow
import type { Immutable } from 'seamless-immutable';
import type { ConsumerPaymentPack } from '../payment-packs/types';

export type Booking = {
  name: string,
  nb_bookings: number,
  offer: number,
  id: number,
  member: number,
  booking_status_code: number,
  date: string,
  status: boolean,
  invoice: ?string,
  attendance: boolean,
  date_start: string,
  payment_pack: number,
  consumer_payment_pack: ConsumerPaymentPack,
  was_refunded: false,
  first_in_company: false,
};
export type BookingOption = {
  id: number,
  cancelled: boolean,
  date_start: string,
  is_convertible: boolean,
};

export type BookingsState = Immutable<{
  all: Booking[],
  bookingsUpdating: Booking[],
  options: BookingOption[],
  bookingOptionsUpdating: BookingOption[],
  loading: boolean,
}>;

export type BookingsAction =
  | { type: null }
  | {
      type: 'BOOKING_OPTION_UPDATED',
      bookingOptionId: number,
      bookingOption: BookingOption,
    }
  | { type: 'START_UPDATING_BOOKING_OPTION', bookingOptionId: number }
  | { type: 'ERROR_UPDATING_BOOKING_OPTION', bookingOptionId: number }
  | { type: 'ERROR_UPDATING_BOOKING_STATUS', bookingId: number }
  | { type: 'START_UPDATING_BOOKING_STATUS', bookingId: number }
  | {
      type: 'BOOKING_STATUS_UPDATED',
      booking: Booking,
      bookingId: number,
    }
  | {
      type: 'HAS_FETCHED_BOOKINGS',
      bookings: Booking[],
      booking_options: Object,
    }
  | {
      type: 'START_FETCH_BOOKINGS',
    }
  | {
      type: 'ERROR_FETCHING_BOOKINGS',
    }
  | {
      type: 'BOOKING_ADD_SUCCESS',
      booking: Booking,
    }
  | {
      type: 'BOOKING_DELETE_SUCCESS',
      bookingId: number,
    }
  | {
      type: 'BOOKING_DELETE_ERROR',
    }
  | {
      type: 'BOOKING_DELETE_START',
    };

export type Notification = {
  kind: number,
  company: number,
  establishment?: number,
  meta_activity?: number,
  notifify_booking_nb: number,
  active: boolean,
  email_design: number,
  hours: number,
};
