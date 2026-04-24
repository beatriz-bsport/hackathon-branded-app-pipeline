export type MemberNote = {
  id: number;
  member: number;
  date: string;
  text: string;
  highlighted: boolean; // acts as "is_private"
  is_medical: boolean;
  editable: boolean;
};

export type Member = {
  accept_email: boolean;
  archived: boolean;
  birthday?: string;
  consumer: number;
  credit_account_balance: number;
  date_joined: string;
  email: string;
  first_name: string;
  has_bought_pack: boolean;
  id: number;
  is_pos: boolean;
  last_name: string;
  name: string;
  phone?: string;
  photo?: string;
  tags: Array<number>;
  total_unpaid_amount: string;
  user_id: number;
  default_establishment_billing_group?: number | null;
};

export type MemberDetail = Member & {
  notes: MemberNote[];
};

export type GetMemberParams = {
  memberId: number;
};

export type SearchMembersParams = {
  params?: {
    hide_archived?: boolean;
    only_archived?: boolean;
  };
  text: string;
  count?: number;
};

export type PaginatedParams = {
  page?: number;
  page_size?: number;
};

export type MemberListParams = {
  company__in?: number[];
  id__in?: number[];
  consumer_id__in?: number[];
  company?: number;
  me?: boolean;
  offer?: number;
  offer_with_selected_categories?: string;
  tags_included?: number[];
  tags_excluded?: number[];
  tag_templates_included?: number[];
  tag_templates_excluded?: number[];
  date_joined__gte?: string;
  date_joined__lte?: string;
  smartlist?: number;
  exclude_archived?: boolean;
  archived?: boolean;
  email_confirmed?: boolean;
  email?: string;
  barcode?: string;
  withNotes?: 1;
};

export type MemberPayload = {
  first_name: string;
  last_name: string;
  email?: string;
  gender: string;
  birthday?: string;
  emergency_contact: string;
  photo: File;
  official_document_type: string;
  official_document_id: string;
  nationality?: string;
  phone?: {
    phone_number?: string;
  };
  address?: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
};

export type PaginatedMemberListParams = MemberListParams & PaginatedParams;
