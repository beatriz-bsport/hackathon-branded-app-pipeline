export type FetchBookkeepingAccountsParams = {
  is_active?: boolean;
};

export type CreateBookkeepingAccountParams = {
  account_name: string;
  account_number: string;
  vat_rate: string;
};
