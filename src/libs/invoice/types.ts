import {
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
} from '@bsport/common/lib/master-data/payment-group';
import { PaymentEngine, PaymentItem } from './payment/types';
import { InvoiceItem } from './invoice-item/types';
import { UserRoleData } from '#libs/role/types';
import { ErrorAndLoading } from '../types';
import { Payment } from '#libs/payment/types';

export type InvoiceState = ErrorAndLoading & {
  byId: { [key: string]: Invoice };
  list: ErrorAndLoading & {
    count: number;
    page: number;
    allIds: string[];
  };
  invoice: Invoice | null;
  createOrUpdate: ErrorAndLoading;
  payment: ErrorAndLoading & {
    byId: { [id: string]: PaymentItem };
    allIds: string[];
  };
  invoiceItem: ErrorAndLoading & {
    byId: { [id: string]: InvoiceItem };
  };
  planned_payment_event: ErrorAndLoading & {
    byId: { [id: number]: PlannedPaymentEvent };
    allIds: number[];
  };
  returnPayment: ErrorAndLoading;
  configuration: ErrorAndLoading & {
    result: InvoiceConfigurationSerializer | null;
    updating: boolean;
  };
  finalize: ErrorAndLoading;
  invoiceInfo: ErrorAndLoading & {
    data: InvoiceInfoSerializer | null;
  };
  quickbooks: ErrorAndLoading;
  applyBalance: ErrorAndLoading;
  applyGiftCard: ErrorAndLoading;
  loadingSpecific: false;
  errorSpecific: Error;
  editEstablishmentBillingGroup: ErrorAndLoading;
};

export type Invoice<M = number, PI = number, II = number> = {
  payments: Array<PI>;
  invoice_items: Array<II>;
  voucher: string;
  member: M;
  memberName: string;
  date: string;
  uuid: string;
  is_finalized: boolean;
  stripe_invoice_pdf: string | null;
  fully_payed: string;
  price_due: string;
  price_payed: string;
  reverted: boolean;
  amount_due_cts: number;
  amount_paid_cts: number;
  quickbooks_status: number;
  is_quick_invoice: boolean | null;
  invoice_type: InvoiceType;
  reverse_invoices: Array<string>;
  is_v2: boolean;
  is_draft?: boolean;
  plannedinvoice: number;
  billing_plan: number | null;
  source_invoice: string | null;
  custom_footer: string;
  invoice_legal_identifier: string | null;
  establishment: number | null;
  establishment_billing_group?: number | null;
  author: number;
  source: number;
  is_member_pos: boolean;
};

export enum InvoiceType {
  REGULAR = 0,
  REVERSE = 1,
  EMPTY_PAYMENT_CONTAINER = 2,
  MIGRATION = 3,
}

export type PlannedPaymentEvent = {
  id: number;
  date_created: string;
  future_date: string;
  invoice: string;
  amount_cts: string;
  payment_engine: PaymentEngine;
  payment_method_identifier: PaymentMethodIdentifier;
  _payment_backend_method_id: string;
  status: PlannedPaymentEventStatus;
  error_recoverable_manually: boolean;
  recoverable_error_type: string | null;
  processing: boolean;
};

export enum PaymentMethodIdentifier {
  CASH = 0,
  CB = 1,
  SEPA = 2,
  CHECK = 3,
  HOLIDAY_CHECK = 4,
  AMEX = 5,
  DISPUTE = 6,
  TRANSFER = 7,
  OTHER = 8,
  BANCONTACT = 9,
  IDEAL = 10,
  SOFORT = 11,
  EPS = 12,
  GIROPAY = 13,
  DEBT = 14,
  CB_MANUAL = 15,
}

export enum PlannedPaymentEventStatus {
  PENDING = 0,
  REGISTERED = 1,
  ERROR = 2,
  CANCELED = 3,
}

export type PlannedPaymentEventSerializer = PlannedPaymentEvent & {
  next_retry_date: string | null;
  nb_retries: number;
};

export type PaymentGroup = {
  id: number;
  member: number | null;
  invoice: string | null;
  basket: string | null;
  payment_method_identifier: PaymentMethodIdentifier;
  client_secret: string;
  price_cts: number;
  currency: string;
  status: PaymentGroupStatus;
};

export enum PaymentGroupStatus {
  DRAFT = 0,
  PENDING_ACTION = 100,
  REQUIRES_ACTION = 150,
  SUCCESS = 200,
  CANCELED = 300,
  PROCESSING = 400,
  DISPUTED = 600,
  PLANNED = 500,
}

export type BuyableItem = {
  buyable_item_id: number;
  buyable_item_identifier: number;
  voucher: string;
  price: string;
};

export type WithAuthor<T> = T & {
  author: UserRoleData;
};

export type InvoiceReverseMethod =
  | typeof REVERSE_ON_PAYMENT_METHOD
  | typeof REVERSE_ON_DEBT
  | typeof REVERSE_ON_NEW_PAYMENT_METHOD;

export type InvoiceAllowedReverseMethods = {
  [K in InvoiceReverseMethod]?: {
    allowed: boolean;
    error_code: number | null;
  };
};

export type InvoiceFilter = {
  order?: string;
  reverted?: boolean;
  company?: number;
  member?: string;
  is_fully_paid?: boolean;
  is_v2?: boolean;
  unpaid?: boolean;
  member_in?: number[];
  only_today?: boolean;
  is_draft?: boolean;
};

export type PaymentFilter = {
  date__gte?: string;
  date__lte?: string;
  price__gt?: number;
  price__lt?: number;
  invoice__plannedinvoice__isnull?: boolean;
  payment_method?: number;
  payment_received?: boolean;
  reverted?: boolean;
  invoice__uuid?: string;
};

export type InvoiceItemFilter = {
  invoice__payments__date__gte?: string;
  invoice__payments__date__lte?: string;
  invoice__uuid__in?: string[];
  invoice__member__company?: string;
  invoice__uuid?: string;
  invoice__member?: string;
};

export type PlannedPaymentEventFilter = {
  status__in?: number[];
  invoice?: string;
  status?: number;
};

export type InvoiceConfigurationSerializer = {
  stripe_footer: string;
  nb_retries_subscription_payments: number;
  disable_pass_on_fail_subscription_payment: boolean;
  show_company_email_in_invoice: boolean;
  revert_bookings_on_fail_subscription_payment: boolean;
  advance_sepa_billing: boolean;
};

export type InvoiceConfigurationMemberSerializer = {
  nb_retries_subscription_payments: number;
};

export type InvoiceDetailsSerializer = Invoice & {
  is_fully_paid: boolean;
  quickbooks_metadata: Object;
};

export type InvoiceInfoSerializer<PI = number, II = number> = {
  uuid: string;
  errors: { payments: Payment[] };
  invoice_type: InvoiceType;
  payments: Array<PI>;
  invoice_items: Array<II>;
  price_due: string;
  price_payed: string;
  is_quick_invoice: boolean | null;
};

export type InvoiceV1Serializer = Invoice & {
  payment_methods: PaymentMethodSerializer;
  buyable_items: BuyableItemSerializer;
  source: Source;
  memberArchived: boolean;
  staff_history: [];
};

export enum Source {
  APP = 0,
  WEB = 1,
  SAAS = 2,
  OTHER = 3,
}

export type PaymentMethodSerializer = {
  stripe_charge_id: string;
  payment_note: string;
  payment_received: boolean;
  price: string;
  payment_method: number;
};

export type BuyableItemSerializer = {
  voucher: string;
  price: string;
  buyable_item_id: number;
  buyable_item_identifier: number;
};

export type RequestClientSecretPayload = {
  price_cts: number;
  client_secret: string;
  payment_group: number;
};
