import { ErrorAndLoading, ModelReducerI } from '../types';

export type User = {
  id: number;
  name: string;
  photo: string;
};

export type MemberAddress = {
  address: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    zipcode: string;
  };
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
  files: MemberUploadedFile[];
  general_terms_and_conditions_date_accepted: string | null;
  general_terms_and_conditions_accepted: boolean | null;
  general_terms_of_use_date_accepted: string | null;
  general_terms_of_use_accepted: string | null;
  waiver_accepted: string;
  emergency_contact: string;
  archived: boolean;
  pending_email: string | null;
};

export type MemberState = ErrorAndLoading &
  ModelReducerI<Member> & {
    allIds: Array<number>;
    detailData: { [key: string]: Member };
    listData: { [key: string]: Member };
    listCount: number;
    quickFetched: Array<Member>;
    barcode: ErrorAndLoading & {
      data: Array<Member>;
    };
    search: ErrorAndLoading & {
      allIds: Array<number>;
      archived: ErrorAndLoading & {
        allIds: Array<number>;
        data: { [key: string]: Member };
      };
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
    historyListIds: Array<number>;
    communication: ErrorAndLoading & {
      allPageIds: Array<number>;
      allIdsWithoutPhone: Array<number>;
      allIdsWithoutEmail: Array<number>;
      allIds: Array<number>;
      page: number;
    };
    userProfile: ErrorAndLoading & {
      profile: UserProfile | null;
    };
    generic: {};
    archive: ErrorAndLoading & {
      interrogate: {
        byId: { [key: number]: Array<number> };
      };
    };
    change_email_request: {
      current: ChangeEmailRequest | null;
    } & ErrorAndLoading;
  };

export type MemberUploadedFile = {
  id: number;
  member: number;
  name: string;
  updated_at: string;
  file_path: string;
  coach_has_access: boolean;
};

export type ChangeEmailRequest<M = number> = {
  company?: number;
  requesting_manager?: number;
  old_email_related_user?: number;
  date_created?: number;
  uuid?: string;
  old_email: string;
  new_email: string;
  email_sent?: boolean;
  status?: number;
  src_company_member?: number | null;
  dst_same_company_member?: number | null;
  dst_other_companies_members: Array<M>;
  kind?: number;
  email_already_used: boolean;
};
