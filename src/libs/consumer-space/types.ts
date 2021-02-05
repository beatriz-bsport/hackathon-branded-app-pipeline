import { PrivateBooking } from '../private-service/types';
import { Booking } from '../booking/types';
import { ErrorAndLoading } from '../types';

export type Profile = {
  name: string;
  first_name: string;
  last_name: string;
  photo: string;
  email: string;
  phonenumber: { phone_number: string };
};

export type BookingOrPrivateBooking = {
  type: 'booking' | 'privateBooking';
  booking?: Booking;
  privateBooking?: PrivateBooking;
};

export type BookingAndPrivateBookingId = {
  type: 'booking' | 'privateBooking';
  booking?: number;
  privateBooking?: number;
};

export type ConsumerState = {
  error: boolean;
  errorMsg: null | any;
  optionsLoading: boolean;
  optionCurrentlyCancelling: null | any;
  bookingsLoading: boolean;
  paymentPacksLoading: boolean;
  futureBookings: any[];
  pastBookings: any[];
  bookingOptions: any[];
  consumerPaymentPacks: any[];
  profile: Profile;
  bookingAndPrivateBooking: ErrorAndLoading & {
    booking: {
      byId: { [key: string]: Booking };
      next_page: number;
      rest: Booking[];
    };
    privateBooking: {
      byId: { [key: string]: PrivateBooking };
      next_page: number;
      rest: PrivateBooking[];
    };
    allObj: Array<BookingAndPrivateBookingId>;
    hasMore: boolean;
  };
};
