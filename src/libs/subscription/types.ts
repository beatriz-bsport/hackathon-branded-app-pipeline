import { ErrorAndLoading } from '../../state/types';
import type { PaymentPack } from '../payment-packs/types';
import type { PrivatePass } from '../private-service/types';
import type { PaymentCombo } from '../payment-combo/types';

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

export type Subscription<
  PrivatePassType = number,
  PaymentPackType = number,
  PaymentComboType = number,
> = {
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
  private_pass: PrivatePassType;
  payment_pack: PaymentPackType;
  payment_combo: PaymentComboType;
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
  id: number;
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
  recurrent_price: number;
  nb_interval: number;
  disabled: boolean;
  interval: 'month' | 'week';
  recurrence_basis: number;
};

export type ContractWithPaymentPack = {
  id: number;
  company: number;
  name: string;
  description: string;
  contract: string;
  manage_only: boolean;
  auto_renewal: boolean;
  flat_fee: number;
  recurrent_price: number;
  nb_interval: number;
  disabled: boolean;
  interval: 'month' | 'week';
  recurrence_basis: number;
  payment_pack?: PaymentPack;
  private_pass?: PrivatePass;
  payment_combo?: PaymentCombo;
};
export type ContractPause = {
  company: number;
  name: string;
  days: number;
  from_date?: string;
  until_date?: string;
  contract?: number;
  id: number;
};

export type SubscriptionState = {
  byId: { [id: number]: Subscription };
  createOrUpdate: ErrorAndLoading;
  bulk: ErrorAndLoading;
  list: ErrorAndLoading & {
    allIds: Array<number>;
  };
  byMember: ErrorAndLoading & {
    allIds: Array<number>;
  };
  detail: ErrorAndLoading;
  stop: ErrorAndLoading;
  freeze: ErrorAndLoading;
  switchSubscriptionItem: ErrorAndLoading;
  switchPaymentMethod: ErrorAndLoading;
  events: {
    items: Array<any>;
    page: number;
  } & ErrorAndLoading;
  plannedInvoice: {
    byId: { [key: number]: PlannedInvoice };
    allIds: Array<number>;
    nextPage: number | null;
    page: number;
  } & ErrorAndLoading;
  contractPause: ErrorAndLoading & {
    allIds: Array<number>;
    byId: { [id: number]: ContractPause };
    page: number;
    nextPage?: number;
  };
  contract: ErrorAndLoading & {
    byId: { [id: number]: Contract };
    allIds: Array<number>;
    createOrUpdate: ErrorAndLoading;
    byMarketplace: ErrorAndLoading & {
      allIds: Array<number>;
    };
    forBooking: ErrorAndLoading & {
      allIds: Array<number>;
    };
  };
};
