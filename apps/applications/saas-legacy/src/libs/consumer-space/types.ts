import type { ErrorAndLoading, PaginationFilterParams } from 'src/libs/types';
import type {
  PrivateBooking,
  PrivateConsumerPassREST,
} from '#src/libs/private-service/types';
import type { Booking, BookingREST } from '#src/libs/booking/types';
import type { ConsumerPaymentPackREST } from '#src/libs/consumer-payment-pack/types';
import type { WaitingListBookingOption } from '#src/libs/waiting-list/types';
import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type { UniversalPassREST } from '#src/libs/universal-pass/types';
import type {
  ConsumerInvoiceComplementary,
  ConsumerInvoiceREST,
} from '#src/libs/invoice/types';
import { OfferStatusWaitingListPosition } from '#src/libs/offer/types';
import type { MarketingPreferenceData } from '#src/libs/communication/types';
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

export type ConsumerSubscriptionReworked = {
  page: number;
  next_page: number | null;
  previous_page: number | null;
  count: number;
  subscriptions: {
    allIds: number[];
    byId: { [key: number]: SubscriptionREST };
  };
} & ErrorAndLoading;

export type ConsumerPassReworked<PassType> = {
  page: number;
  next_page: number | null;
  previous_page: number | null;
  count: number;
  passes: {
    allIds: number[];
    byId: { [key: number]: PassType };
  };
} & ErrorAndLoading;

export type ConsumerSubscriptionInvoiceDetails = {
  bySubscriptionId: {
    [key: number]: {
      invoices: Omit<SubscriptionsInvoicesDetailsREST, 'billing_plan_id'>[];
      page: number;
      next_page: number | null;
      count: number;
    };
  };
} & ErrorAndLoading;

export type ConsumerSubscriptionStop = ErrorAndLoading;

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
    elligibleGuestNumberByOffer: {
      byOfferId: Record<number, number>;
    } & ErrorAndLoading;
    waitlistPositionByOffer: {
      byOfferId: Record<number, OfferStatusWaitingListPosition>;
    } & ErrorAndLoading;
  };
  mySubscriptions: {
    active: ConsumerSubscriptionReworked;
    future: ConsumerSubscriptionReworked;
    expired: ConsumerSubscriptionReworked;
    invoices: ConsumerSubscriptionInvoiceDetails;
    stop: ConsumerSubscriptionStop;
  };
  myPasses: {
    tabs: {
      error: Error | null;
      loading: boolean;
      data: ConsumerPassesTabDisplay;
    };
    consumerPaymentPack: {
      active: ConsumerPassReworked<ConsumerPaymentPackREST>;
      future: ConsumerPassReworked<ConsumerPaymentPackREST>;
      expired: ConsumerPassReworked<ConsumerPaymentPackREST>;
    };
    privateConsumerPass: {
      active: ConsumerPassReworked<PrivateConsumerPassREST>;
      future: ConsumerPassReworked<PrivateConsumerPassREST>;
      expired: ConsumerPassReworked<PrivateConsumerPassREST>;
    };
    universalPass: {
      active: ConsumerPassReworked<UniversalPassREST>;
      future: ConsumerPassReworked<UniversalPassREST>;
      expired: ConsumerPassReworked<UniversalPassREST>;
    };
  };
  myInvoices: ErrorAndLoading & {
    restByUuid: { [uuid: string]: ConsumerInvoiceREST };
    complementary: ErrorAndLoading & {
      byUuid: { [uuid: string]: ConsumerInvoiceComplementary };
    };
    byUuid: ErrorAndLoading;
    unpaid: ErrorAndLoading & ConsumerInvoiceReworked;
    paid: ErrorAndLoading & ConsumerInvoiceReworked;
    refunded: ErrorAndLoading & ConsumerInvoiceReworked;
  };
  myFranchiseMarketingPreferences: ConsumerFranchiseMarketingPreferences;
};

export type ConsumerFranchiseMarketingPreferences = {
  eligibility: { eligible: boolean } & ErrorAndLoading;
  companyPreferences: {
    preferences: MarketingPreferenceData[];
  } & ErrorAndLoading;
  update: ErrorAndLoading;
};
export type ConsumerInvoiceReworked = {
  count: number;
  page: number;
  nextPage: number | null;
  allUuids: string[];
};

export type ConsumerInvoiceFilter = {
  unpaid?: boolean;
  paid?: boolean;
  refunded?: boolean;
};

export type ConsumerInvoiceParams = PaginationFilterParams & {
  company_id: number;
};

export type ConsumerInvoiceQueryParams = ConsumerInvoiceFilter &
  ConsumerInvoiceParams;

export type ConsumerPaymentPackCompatibility = {
  type: 'activity' | 'category' | 'room';
  label: string;
};

export type PrivateConsumerPassCompatibility = {
  name: string;
  allSessions?: boolean;
  sessions?: string[];
};

/* eslint-disable-next-line */
const daysOfWeek = [0, 1, 2, 3, 4, 5, 6] as const;
export type DayOfWeekNumber = (typeof daysOfWeek)[number];

export type TimeSlot = {
  dayOfWeek: DayOfWeekNumber;
  from: `${number}:${number}`;
  to: `${number}:${number}`;
};

/* eslint-disable-next-line */
const frequencyOptions = ['month', 'day', 'week'] as const;
export type FrequencyOption = (typeof frequencyOptions)[number];

export type ConsumerPassRestriction = {
  frequency: FrequencyOption;
  amount: number;
};

/** This type, returned by the API when fetching available tabs, indicates
 * which tabs should be displayed by 'my passes' page.
 * The values depends on the existing company's or member's passes.
 */
export type ConsumerPassesTabDisplay = {
  consumer_payment_pack: boolean;
  private_consumer_pass: boolean;
  universal_pass: boolean;
};
