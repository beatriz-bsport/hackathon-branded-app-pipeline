import React from 'react';

import type { PrivateBooking } from '#libs/private-service/types';
import type { Booking, BookingREST } from '#libs/booking/types';
import type { ErrorAndLoading } from '../types';
import type { ChipColor, ChipVariant } from '#Fabrique/Chip';
import type { WaitingListBookingOption } from '#libs/waiting-list/types';

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
    count: number;
    hasMore: boolean;
  };
};

export type ConsumerPrivateBookingReworked = {
  page: number;
  next_page: number | null;
  previous_page: number | null;
  count: number;
  private_services: {
    allIds: number[];
    byId: { [key: number]: PrivateBooking };
  };
} & ErrorAndLoading;

export type ConsumerBookingReworked = {
  page: number;
  next_page: number | null;
  previous_page: number | null;
  count: number;
  bookings: {
    allIds: number[];
    byId: { [key: number]: BookingREST };
  };
} & ErrorAndLoading;

export type ConsumerBookingOptionReworked = {
  page: number;
  next_page: number | null;
  previous_page: number | null;
  count: number;
  booking_options: {
    allIds: number[];
    byId: { [key: number]: WaitingListBookingOption };
  };
} & ErrorAndLoading;

export type ConsumerStateReworked = {
  myBookings: {
    bookings: {
      future: ConsumerBookingReworked;
      past: ConsumerBookingReworked;
      waitlist: ConsumerBookingOptionReworked;
    };
    privateBookings: {
      future: ConsumerPrivateBookingReworked;
      past: ConsumerPrivateBookingReworked;
    };
    bookingsWorkshop: {
      future: ConsumerBookingReworked;
      past: ConsumerBookingReworked;
      waitlist: ConsumerBookingOptionReworked;
    };
  };
};

export type ChipData = {
  shouldDisplay?: boolean;
  chipColor: ChipColor;
  leftIcon?: React.ReactNode;
  variant?: ChipVariant;
  text: string;
  chipClassName: string;
};

export type ConsumerPaymentPackCompatibility = {
  type: 'activity' | 'category' | 'room';
  label: string;
};

export type PrivateConsumerPassCompatibility = {
  name: string;
  allSessions?: boolean;
  sessions?: string[];
};

const daysOfWeek = [0, 1, 2, 3, 4, 5, 6] as const;
export type DayOfWeekNumber = (typeof daysOfWeek)[number];

export type TimeSlot = {
  dayOfWeek: DayOfWeekNumber;
  from: `${number}:${number}`;
  to: `${number}:${number}`;
};

const frequencyOptions = ['month', 'day', 'week'] as const;
export type FrequencyOption = (typeof frequencyOptions)[number];

export type ConsumerPassRestriction = {
  frequency: FrequencyOption;
  amount: number;
};
