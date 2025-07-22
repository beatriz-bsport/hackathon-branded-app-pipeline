// Based on MemberListMinimalWithAvatarSerializer
export type Member = {
  accept_email: boolean;
  archived: boolean;
  birthday?: string;
  consumer: number;
  credit_account_balance: number;
  date_joined: string;
  email: string;
  first_name: string;
  has_bough_pack: boolean;
  id: number;
  is_pos: boolean;
  last_name: string;
  name: string;
  phone?: string;
  photo?: string;
  tags: Array<number>;
  total_unpaid_amount: string;
  user_id: number;
};

export type MemberDetails = {
  id: number;
  name: string;
  consumer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phonenumber: string | null;
    birthday: string | null;
    gender: string | null;
    is_coach: boolean;
    is_consumer: boolean;
    photo: string;
    address: {
      address_line_1: string;
      address_line_2: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    };
    sports: number[];
    consumer: number;
  };
  firstname: string; // Needed
  lastname: string; // Needed
  gender: string;
  barcode: string;
  date_joined: string; // Format 2025-06-18T18:13:12.771761+02:00
  membership_ID: string;
  accept_email: boolean;
  email: string | null;
  address: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  accept_sms: boolean;
  internal_account: string;
  credit_account_balance: number;
  total_unpaid_amount: string;
  notes: number[];
  tags: number[]; // Needed
  photo: string; // Needed
  emergency_contact: null;
  birthday: string | null;
  files: number[];
  general_terms_and_conditions_date_accepted: boolean | null;
  general_terms_and_conditions_accepted: boolean | null;
  general_terms_of_use_date_accepted: boolean | null;
  general_terms_of_use_accepted: boolean | null;
  waiver_accepted: boolean | null;
  archived: boolean;
  default_billing_establishment: number | null;
  default_establishment_billing_group: number | null;
  unsubscribe_link: string;
  spivi_privacy_settings_accepted: boolean | null;
  referral_uuid: string | null;
  is_pos: boolean;
  official_document_id: string;
};

export type UpdateMemberTagParams = {
  memberId: number;
  tagId: number;
};

export type UpdateAllMembersTagParams = {
  tagId: number;
};
