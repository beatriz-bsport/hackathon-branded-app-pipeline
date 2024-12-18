import { ErrorAndLoading } from '../../state/types';

export type QuickbooksApp = {
  id: number;
  company_id: number;
  is_configured: boolean;
  realm_id: string;
  quickbooks_user_id: string;
  is_disabled: boolean;
  metadata: {
    tax_code?: { name: string; value: string };
  };
  multi_currency_support: boolean;
};

export type QuickBooksTaxAgency = {
  DisplayName: string;
  Id: string;
};
export type QuickBooksTaxCode = {
  Description: string;
  Name: string;
  Id: string;
};
export type QuickbooksState = {
  detail: QuickbooksApp;
  update: ErrorAndLoading;
  requestTooken: ErrorAndLoading;
  taxAgencies: {
    byId: { [key: string]: QuickBooksTaxAgency };
  } & ErrorAndLoading;
  taxCodes: {
    byId: { [key: string]: QuickBooksTaxCode };
    upsert: ErrorAndLoading;
  } & ErrorAndLoading;
} & ErrorAndLoading;
