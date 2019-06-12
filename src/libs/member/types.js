// @flow

export type User = {
  id: number,
  name: string,
  photo: string,
};

export type MemberNote = {
  id: number,
  text: string,
  highlighted: boolean,
  date: string,
};

export type Member = {
  id: number,
  name: string,
  first_name: string,
  last_name: string,
  credit_account_balance: number,
  notes: Array<MemberNote>,
  tags: Array<number>,
};

export type MemberState = {
  loading: boolean,
  error: ?Error,
  all: Array<Member>,
  quickFetched: Array<Member>,
  member: ?Member,
  search: {
    items: Array<Member>,
    loading: boolean,
    error: ?Error,
  },
  byOffer: {
    items: Array<Member>,
    loading: boolean,
  },
  upsert: {
    loading: boolean,
    error: ?Error,
  },
};
