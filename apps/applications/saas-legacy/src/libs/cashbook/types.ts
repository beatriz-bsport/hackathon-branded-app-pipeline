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
 * A Transaction is an atomic record of a movement of money
 */
export type Transaction = {
  amount: number;
  todayEndAmount: number;
  todayStartAmount: number;
};

/**
 * A CashBookUpdate records a transaction happening at a given time
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
