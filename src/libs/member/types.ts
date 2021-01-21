import { ErrorAndLoading } from '../types';

export type User = {
  id: number;
  name: string;
  photo: string;
};

export type MemberNote = {
  id: number;
  text: string;
  highlighted: boolean;
  date: string;
  is_medical: boolean;
};

type MemberCountData = {
  nb_reservations: number;
  nb_consumer_payment_pack: number;
  nb_relations: number;
  nb_private_consumer_pass: number;
  nb_private_bookings: number;
  nb_invoices: number;
  nb_subscriptions: number;
};

export type Member = {
  id: number;
  name: string;
  consumer: number;
  firstname: string;
  lastname: string;
  gender: string;
  barcode: string;
  date_joined: string;
  membership_ID: string;
  accept_email: boolean;
  accept_sms: boolean;
  email: string;
  address: string;
  internal_account: number;
  credit_account_balance: number;
  notes: Array<MemberNote>;
  tags: Array<number>;
  next_booking: string; // date
  previous_booking: string; // date
  billing_plans: any;
  photo: string;
  phone_number: string;
  birthday: string;
  files: string;
  general_terms_and_conditions_date_accepted: string | null;
  general_terms_and_conditions_accepted: boolean | null;
};

export type MemberState = ErrorAndLoading & {
  allIds: number[];
  detailData: any;
  listData: { [key: string]: Member };
  quickFetched: Array<Member>;
  barcode: ErrorAndLoading & {
    data: Array<Member>;
  };
  search: ErrorAndLoading & {
    allIds: number[];
  };
  upsert: ErrorAndLoading;
  bulk: ErrorAndLoading;
  count: ErrorAndLoading & {
    data: MemberCountData;
  };
  byOffer: {
    items: Array<Member>;
    loading: boolean;
  };
  historyListIds: number[];
  byId: { [key: string]: Member };
  communication: ErrorAndLoading & {
    allPageIds: number[];
    allIdsWithoutPhone: number[];
    allIdsWithoutEmail: number[];
    allIds: number[];
    page: number;
  };
};
