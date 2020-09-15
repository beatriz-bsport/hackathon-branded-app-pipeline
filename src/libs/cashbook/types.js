// @flow

export type CashBook = {
  infos: {
    today_start_amount: number,
    today_end_amount: number,
    date_last_update: number,
  },
  loading: boolean,
  error: ?Error,
};
