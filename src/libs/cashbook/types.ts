export type CashBookState = {
  infos: CashBook;
  createOrUpdate: {
    loading: boolean;
    error?: Error;
  };
  loading: boolean;
  error?: Error;
};

/**
 * A Transaction stores the cash informations of a CashBook
 */
export type Transaction = {
  amount: number;
  todayEndAmount: number;
  todayStartAmount: number;
};

/**
 * A CashBookUpdate is the type used when a cashBook is updated
 */
export type CashBookUpdate = Transaction & {
  dateUpdated: string;
};

/**
 * A CashBook stores the evolution of the cash of a company on a specific day
 */
export type CashBook = {
  amount_received: number;
  company_id: number;
  company_name: string;
  date: string;
  date_last_update: string;
  today_end_amount: number;
  today_start_amount: number;
};
