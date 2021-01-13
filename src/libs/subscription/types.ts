import { ErrorAndLoading } from '../../state/types';

export type PlannedInvoice = {
  date: number;
  status: number;
  price: number;
  voucher: number;
  uuid: string;
  id: number;
  billing_plan: number;
  name: string;
  contract: number;
  payment_method: number;
  member: number;
  amount_due_cts: number;
  is_last_invoice_before_scheduled_stop: boolean;
};

export type Subscription = {
  id: number;
  name: string;
  member: number;
  legal_contract: string;
  contract: number;
  description: string;
  memberName: string;
  nb_interval: number;
  recurrent_price: number;
  trial_nb: number;
  recurrent_voucher: number;
  canceled_at: string;
  has_ended: boolean;
  interval: 'month' | 'week';
  date_created: string;
  private_pass: number;
  payment_pack: number;
  payment_combo: number;
  is_v2: boolean;
  planned_invoices: Array<PlannedInvoice>;
  payment_engine: number;
  payment_method: number;
  payment_method_identifier: number;
  pauses: Array<SubscriptionPause>;
};

export type SubscriptionData = {
  name: string;
  member: number;
  nb_interval: number;
  recurrent_price: number;
  trial_nb: number;
  interval: 'month' | 'week';
  recurrent_voucher: number;
  payment_pack: number;
  first_billing_timestamp: number;
};

export type SubscriptionPause = {
  days: number;
  date_created: string;
  billing_plan: number;
  name: string;
  first_paused_planned_invoice: string;
};

export type Contract = {
  company: number;
  payment_pack?: number;
  private_pass?: number;
  payment_combo?: number;
  name: string;
  description: string;
  contract: string;
  manage_only: boolean;
  auto_renewal: boolean;
  flat_fee: number;
};

export type SubscriptionState = {
  byId: { [id: number]: Subscription };
  createOrUpdate: ErrorAndLoading;
  stop: ErrorAndLoading;
  detail: ErrorAndLoading;
  list: ErrorAndLoading & {
    allIds: Array<number>;
  };
  byMember: ErrorAndLoading & {
    allIds: Array<number>;
  };
  contract: ErrorAndLoading & {
    byId: { [id: number]: Contract };
    allIds: Array<number>;
    createOrUpdate: ErrorAndLoading;
    forBooking: ErrorAndLoading & {
      allIds: Array<number>;
    };
    byMarketplace: ErrorAndLoading & {
      allIds: Array<number>;
    };
  };
};
