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
