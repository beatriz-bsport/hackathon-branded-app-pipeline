export type ConsumerPaymentPackExtension = {
  note: string;
  date_created: string;
  nb_days: number;
  consumer_payment_pack: number;
  id: number;
};

export type ConsumerPaymentPack = {
  id: number;
  used_credits: number;
  available_credits: number;
  payment_pack_id: string;
  bookings: string[];
  starting_date: string;
  ending_date: string
  member_id: number;
  bookings_this_week: number;
  payment_pack: number;
  disabled: boolean;
  reverted: boolean;
  invoice: string;
  src_consumer_payment_pack: number[];
  dst_consumer_payment_pack: number | null;
  track_modified_credit: number[][];
  penalty_disabled_from: string | null;
  penalty_disabled_until: string | null;
};

export type ConsumerPaymentPackPenalty = {
  id: number;
  date_created: string;
  penalty_kind: number;
};

type ErrorAndLoading = {
  loading: boolean;
  error?: Error;
};

type WithPagination = {
  count: number;
  page: number;
}

export type ConsumerPaymentPackState = ErrorAndLoading & {
  byId: {[key: string]: ConsumerPaymentPack};
  byOfferByMember: ErrorAndLoading & { items: number[] };
  nonCompatibleByOfferByMember: ErrorAndLoading & { items: number[] };
  compatible: ErrorAndLoading & { allIds: number[] };
  // TODO move every items in this one:
  updatingConsumerPacks: [];
  partialRefund: ErrorAndLoading & { items: number[] };
  extension: ErrorAndLoading & {
    items: [];
    create: ErrorAndLoading;
    delete: ErrorAndLoading;
  };
  byPaymentPack: ErrorAndLoading & WithPagination & {
    paymentPackId: null | number;
    allIds: number[];
  };
  byMember: ErrorAndLoading & WithPagination & { allIds: number[] };
  forBooking: ErrorAndLoading & { allIds: number[] };
  penalty: ErrorAndLoading & WithPagination & { items: number[] };
};
