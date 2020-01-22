// @flow

export type Membership = {
  id: number,
  consumer: number,
  company: number,
  date_joined: string,
  payment_pack_count: number,
  consumer_payment_pack_count: number,
  contract_count: number,
  company_cover: string,
  company_name: string,
  credit_account_balance: number,
  basket: string,
  invoice_count: number,
};

export type MembershipState = {
  byId: { [id: number]: Membership },
  activeMembership: ?number,
  asConsumer: {
    loading: boolean,
    error: ?Error,
    allIds: Array<number>,
    count: number,
    next_page: number,
  },
};
