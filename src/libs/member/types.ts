import { BookingREST } from '#src/libs/booking/types';
import type { ErrorAndLoading, ModelReducerI } from '#src/libs/types';

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
    state: string;
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
    state: string;
    zipcode: string;
  };
  vaccination_status: boolean | null;
  official_document_id: string;
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

// = MemberListMinimalWithAvatarSerializer
export type MemberMinimal<Tag = number, CA = number> = {
  accept_email: boolean;
  archived: boolean;
  birthday: string;
  consumer: number;
  credit_account_balance: CA;
  date_joined: string;
  email: string;
  first_name: string;
  id: number;
  is_pos: boolean;
  last_name: string;
  name: string;
  phone: string;
  photo: string;
  tags: Array<Tag>;
  user_id: number;
  total_unpaid_amount: string;
  vaccination_status?: boolean;
};

export type MemberMinimalNoPhoto = Omit<MemberMinimal, 'photo'>;

export type Member<Tag = number, CA = number> = {
  id: number;
  user_id: number;
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
  address: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    state: string;
    zipcode: string;
  };
  internal_account: number;
  credit_account_balance: CA;
  total_unpaid_amount: string;
  notes: Array<MemberNote>;
  tags: Array<Tag>;
  next_booking: string; // date
  previous_booking: string; // date
  billing_plans: any;
  photo: string;
  phone_number?: string;
  phone?: string;
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
  default_billing_establishment: number | null;
  default_establishment_billing_group: number | null;
  unsubscribe_link: string;
  spivi_privacy_settings_accepted: boolean;
  is_pos: boolean;
  has_bought_pack?: boolean;
  official_document_id: string;
  referral_uuid?: string;
};

export type MemberWithBooking = Member & {
  booking: BookingREST;
};

export type MemberState = ErrorAndLoading &
  ModelReducerI<Member> & {
    cachedIds: { [key: number]: number };
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
      incremental: ErrorAndLoading & {
        allIds: number[];
        nextPage: number;
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
      countTotal: number;
      countWithPhone: number;
      countWithEmail: number;
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
      minimal: ChangeEmailRequestMinimal | null;
    } & ErrorAndLoading;
    spivi_privacy_settings: ErrorAndLoading;
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

export type ChangeEmailRequestMinimal = {
  old_email: string;
  new_email: string;
};

export type FetchRecipientsParams = {
  page?: number;
  page_size?: number;
  ignore_ids?: boolean;
  reset?: boolean;
} & MemberFilter;

export type MemberFilter = {
  smartlist?: number;
  offer?: number;
  offer_with_selected_categories?: string;
  id__in?: number[];
  company?: number;
};

export type MemberFormData = {
  accept_email: boolean;
  accept_sms: boolean;
  address_line_1: string;
  address_line_2: string;
  avatar: File;
  barcode: string;
  birthday: string;
  city: string;
  country: string;
  date_joined: string;
  email: string;
  emergency_contact?: string;
  firstname: string;
  gender: string;
  lastname: string;
  membership_ID: string;
  phone: string;
  state: string;
  vaccination_status: string;
  waiver: boolean;
  zipcode: string;
};

export type MemberSearchFilterParams = {
  hide_archived?: boolean;
  only_archived?: boolean;
};
