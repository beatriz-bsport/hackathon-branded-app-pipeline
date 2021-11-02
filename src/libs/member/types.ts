import { ErrorAndLoading, ModelReducerI } from '../types';

export type User = {
  id: number;
  name: string;
  photo: string;
};

export type UserProfile = {
  first_name: string;
  last_name: string;
  photo: string;
  email: string;
  phone: string;
  birthday: string;
  emergency_contact: string;
  gender: 'F' | 'M' | 'X';
  address: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    zipcode: string;
  };
  vaccination_status: boolean | null;
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

export type MemberMinimal<Tag = number> = {
  id: number;
  name: string;
  credit_account_balance: number;
  email: string;
  consumer: number;
  date_joined: string;
  phone: string;
  tags: Array<Tag>;
};

export type Member<Tag = number> = {
  id: number;
  name: string;
  consumer: number;
  firstname: string;
  lastname: string;
  gender: string;
  barcode: string;
  date_joined: string;
  membership_ID: string;
  vaccination_status?: boolean;
  accept_email: boolean;
  accept_sms: boolean;
  email: string;
  address: string;
  internal_account: number;
  credit_account_balance: number;
  notes: Array<MemberNote>;
  tags: Array<Tag>;
  next_booking: string; // date
  previous_booking: string; // date
  billing_plans: any;
  photo: string;
  phone_number: string;
  birthday: string;
  files: string;
  general_terms_and_conditions_date_accepted: string | null;
  general_terms_and_conditions_accepted: boolean | null;
  waiver_accepted: string;
};

export type MemberState = ErrorAndLoading &
  ModelReducerI<Member> & {
    allIds: number[];
    detailData: { [key: string]: Member };
    listData: { [key: string]: Member };
    listCount: number;
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
    communication: ErrorAndLoading & {
      allPageIds: number[];
      allIdsWithoutPhone: number[];
      allIdsWithoutEmail: number[];
      allIds: number[];
      page: number;
    };
    userProfile: ErrorAndLoading & {
      profile: UserProfile | null;
    };
    generic: {};
  };
