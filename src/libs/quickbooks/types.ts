import { ErrorAndLoading } from '../../state/types';

export type QuickbooksApp = {
  id: number;
  company_id: number;
  is_configured: boolean;
  realm_id: string;
  quickbooks_user_id: string;
  is_disabled: boolean;
};

export type QuickbooksState = {
  detail: QuickbooksApp | {};
  update: ErrorAndLoading;
  requestTooken: ErrorAndLoading;
} & ErrorAndLoading;
