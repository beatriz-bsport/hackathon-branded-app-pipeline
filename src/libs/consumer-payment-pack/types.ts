import type { SCT } from '#libs/category/types';
import type { Establishment } from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type {
  PaymentPack,
  PaymentPackMassExtension,
} from '#libs/payment-packs/types';
import type { PrivateConsumerPass } from '#libs/private-service/types';
import type { ConsumerPaymentPackLinkWithRelatedMemberNames } from '#libs/relationship/types';
import type { Consumer } from '../../api/types';
import type { ErrorAndLoading, WithPagination } from '../types';

export type ConsumerPaymentPackExtension = {
  note: string;
  date_created: string;
  nb_days: number;
  consumer_payment_pack: number;
  id: number;
};

export type ConsumerPaymentPack<PP = number> = {
  available_credits: number;
  bookings: number[];
  bookings_this_week: number;
  consumer: number;
  consumer_payment_pack_source: number | null;
  company_source_name: string;
  company_source_primary_color: string;
  date_bought: string;
  disabled: boolean;
  dst_consumer_payment_pack: number | null;
  ending_date: string;
  id: number;
  invoice: string;
  is_universal_consumer_pass_source: boolean;
  linked_private_consumer_pass: number | null;
  member_id: number;
  payment_pack: PP;
  payment_pack_id: string;
  penalty_disabled_from: string | null;
  penalty_disabled_until: string | null;
  reverted: boolean;
  src_consumer_payment_pack: number[];
  starting_date: string;
  track_modified_credit: number[][];
  used_credits: number;
  created_from_payment_pack_template_instance: number | null;
};

export type ConsumerPaymentPackREST = ConsumerPaymentPack<number>;

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
  days_blocked: number;
  account_value: string;
};

export type ConsumerPaymentPackCreditRefund = {
  id: number;
  note: string;
  date_created: string;
  invoice: string;
  price: string;
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
  incompatibilitiesByOfferByConsumerPack: ErrorAndLoading & {
    byId: { [offerAndCpp: string]: number[] };
  };
  compatible: ErrorAndLoading & { allIds: number[] };
  updatingById: { [key: string]: boolean };
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

export type ConsumerPaymentPackFactoryOptions = {
  bookingId?: number;
  usedCredits?: number;
  availableCredits?: number;
  startingDate?: string;
  endingDate?: string;
  memberId?: number;
  paymentPackId?: number;
  isDisabled?: boolean;
  isReverted?: boolean;
  srcConsumerPaymentPack?: number[];
  dstConsumerPaymentPack?: number;
  penaltyDisabledFrom?: string;
  penaltyDisabledUntil?: string;
  linkedPrivateConsumerPass?: number;
  consumer?: Consumer;
};

/** Transformed Consumer payment pack for the consumer page by including full objects */
export type ConsumerPaymentPackReworked = Omit<
  ConsumerPaymentPackREST,
  | 'linked_private_consumer_pass'
  | 'payment_pack'
  | 'dst_consumer_payment_pack'
  | 'src_consumer_payment_pack'
> & {
  linked_private_consumer_pass?: PrivateConsumerPass;
  payment_pack: Omit<
    PaymentPack,
    'establishments' | 'SCTs' | 'metaActivities'
  > & {
    establishments: Establishment[];
    SCTs: SCT[];
    metaActivities: MetaActivity[];
  };
  dst_consumer_payment_pack?: Required<ConsumerPaymentPackLinkWithRelatedMemberNames>;
  src_consumer_payment_pack?: Required<ConsumerPaymentPackLinkWithRelatedMemberNames>[];
};
