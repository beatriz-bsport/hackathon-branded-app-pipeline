export type CashBookState = {
  infos: CashBook;
  createOrUpdate: {
    loading: boolean;
    error?: Error;
  };
  loading: boolean;
  error?: Error;
};

export type Transaction = {
  amount: number;
  todayEndAmount: number;
  todayStartAmount: number;
};
export type CashBookUpdate = Transaction & {
  dateUpdated: string;
};

export type CashBook = {
  amount_received: number;
  company_id: number;
  company_name: string;
  date: string;
  date_last_update: string;
  today_end_amount: number;
  today_start_amount: number;
};
