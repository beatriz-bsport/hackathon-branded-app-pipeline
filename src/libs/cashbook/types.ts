export type CashBookState = {
  infos: {
    today_start_amount: number;
    today_end_amount: number;
    date_last_update: number;
    company_name: string;
    company_id: number;
    date: string;
    amount_received: number;
  };
  loading: boolean;
  error?: Error;
};
