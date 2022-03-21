import { ErrorAndLoading, WithPagination } from '../types';

export type ConsumerPaymentPackExtension = {
  note: string;
  date_created: string;
  nb_days: number;
  consumer_payment_pack: number;
  id: number;
};

export type ConsumerPaymentPack<PP = number> = {
  id: number;
  used_credits: number;
  available_credits: number;
  payment_pack_id: string;
  bookings: string[];
  starting_date: string;
  ending_date: string;
  member_id: number;
  bookings_this_week: number;
  payment_pack: PP;
  disabled: boolean;
  reverted: boolean;
  invoice: string;
  src_consumer_payment_pack: number[];
  dst_consumer_payment_pack: number | null;
  track_modified_credit: number[][];
  penalty_disabled_from: string | null;
  penalty_disabled_until: string | null;
  consumer_payment_pack_source: number;
};

export type MaxoutBookingData = {
  start_date: string;
  end_date: string;
  booking_available: number;
};

export type MaxoutBooking = {
  days: MaxoutBookingData[];
  weeks: MaxoutBookingData[];
  months: MaxoutBookingData[];
};

export type ConsumerPaymentPackPenalty = {
  id: number;
  date_created: string;
  penalty_kind: number;
};

export type PaymentPackMassExtension = {
  id: number;
  payment_pack: number;
  min_ending_date: string;
  max_ending_date: string;
  note: string;
  nb_days: number;
  date_created: string;
};

export type ConsumerPaymentPackState = ErrorAndLoading & {
  byId: { [key: string]: ConsumerPaymentPack };
  basePaginationState: {
    page: number;
    count: number;
    loading: boolean;
    error: Error | null;
    allIds: Array<number>;
  };
  byOfferByMember: ErrorAndLoading & { items: number[] };
  nonCompatibleByOfferByMember: ErrorAndLoading & { items: number[] };
  compatible: ErrorAndLoading & { allIds: number[] };
  updatingConsumerPacks: [];
  partialRefund: ErrorAndLoading & { items: number[] };
  extension: ErrorAndLoading & {
    items: [];
    create: ErrorAndLoading;
    delete: ErrorAndLoading;
  };
  massExtension: ErrorAndLoading &
    WithPagination & {
      byId: { [key: string]: PaymentPackMassExtension };
      allIds: number[];
      firstLoadDone: boolean;
    };
  byPaymentPack: ErrorAndLoading &
    WithPagination & {
      paymentPackId: null | number;
      allIds: number[];
    };
  byMember: ErrorAndLoading & WithPagination & { allIds: number[] };
  universalbyMember: ErrorAndLoading & WithPagination & { allIds: number[] };
  forBooking: ErrorAndLoading & { allIds: number[] };
  penalty: ErrorAndLoading & WithPagination & { items: number[] };
  maxout_booking: ErrorAndLoading & {
    byId: {
      [key: string]: MaxoutBooking;
    };
  };
};
