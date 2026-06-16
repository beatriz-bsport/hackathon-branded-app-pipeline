/**
 * Member returned by the smartlist members list endpoint.
 */
export type SmartlistMember = {
  accept_email: boolean;
  credit_account_balance: number;
  date_joined: string;
  email: string;
  id: number;
  name: string;
};

export type FetchSmartlistMembersParams = {
  smartlistId: string;
  page?: number;
  page_size?: number;
};
