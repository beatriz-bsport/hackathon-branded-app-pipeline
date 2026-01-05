import type { SCT } from '#src/libs/category/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type {
  OffPeakSchedule,
  PaymentPack,
} from '#src/libs/payment-packs/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import type {
  CompatiblePrivateService,
  PrivatePass,
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import type {
  ContractPayload,
  ContractWithPaymentPack,
} from '#src/libs/subscription/types';
import { Tag } from '#src/libs/tag/types';
import type { OptionCallback } from '#src/state/types';
import type { FormikProps } from 'formik';
import type { ImmutableArray } from 'seamless-immutable';

export type FormValues = Omit<
  ContractWithPaymentPack,
  | 'payment_pack'
  | 'private_pass'
  | 'payment_combo'
  | 'company'
  | 'disabled'
  | 'id'
  | 'is_usable_by_staff'
  | 'start_date_method'
  | 'tax'
> & {
  id?: number;
  tax: number;
  payment_pack_details: PaymentPackDetailsForms;
  private_pass_details: PrivatePassDetailsForms;
  object_type: ObjectType;
  unusable_by_staff: boolean;
  invoicing_type: InvoicingType;
  tags_on_first_billing?: Array<number>;
};

export type PaymentPackDetails = {
  id?: number;

  credits: number | undefined;
  theorical_margin_value: number;

  sct_ids: number[] | null;
  meta_activity_ids: number[] | null;
  establishment_ids: number[] | null;

  max_bookings_per_day: number | null;
  max_bookings_per_week: number | null;
  max_bookings_per_month: number | null;
  max_purchase_per_member: number | null;

  tax: string;

  full_vod_access: boolean;
  only_vod_access: boolean;
  allow_guest_pass: boolean;
  applies_for_payroll: boolean;
  grants_door_access: boolean;

  expiration_days_before_first_use: number;

  bookkeeping_account: number | null;
  penalty_active: boolean;
  penalty_nb_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: number;
  penalty_days_blocked: number;
  penalty_account_value: number;
  no_show_penalty_active: boolean;
  no_show_penalty_threshold: number;
  no_show_penalty_time_window_days: number;
  no_show_penalty_kind: number;
  no_show_penalty_days_blocked: number;
  no_show_penalty_amount: number;

  off_peak_schedule?: Record<string, string[][]>;
};

export const CREDIT_NUMBER_OPTION = {
  limited: 'limited',
  unlimited: 'unlimited',
} as const;

export const PENALTY_TYPE_OPTION = {
  block: 'block',
  account: 'account',
};

type CreditNumberOption = keyof typeof CREDIT_NUMBER_OPTION;

export type PaymentPackDetailsForms = Omit<
  PaymentPackDetails,
  | 'penalty_kind'
  | 'no_show_penalty_kind'
  | 'off_peak_schedule'
  | 'establishment_ids'
  | 'meta_activity_ids'
  | 'sct_ids'
  | 'tax'
> & {
  id?: number;

  credit_number: CreditNumberOption;
  apply_penalties: boolean;
  penalty_kind: string;
  no_show_penalty_kind: string;
  off_peak_active: boolean;

  establishments: number[] | undefined;
  metaActivities: number[] | undefined;
  categories: number[] | undefined;

  off_peak_schedule: OffPeakSchedule[];

  template_instance?: number | null;
};

export type PrivatePassDetails = {
  credits: number;
  tax: string;
  expiration_days_before_first_use: number;
  description: string | null;
  available: boolean;
  applies_for_payroll: boolean;
  on_behalf_of_teacher: boolean;
  full_vod_access: boolean;
  grants_door_access: boolean;
  bookkeeping_account_id: number | null;
  category_id: number | null;
  private_service_ids: number[] | null;
  compatibility: Array<CompatiblePrivateService>;
};

export type PrivatePassDetailsForms = Omit<
  PrivatePassDetails,
  'bookkeeping_account_id' | 'private_service_ids' | 'category_id' | 'tax'
> & {
  id?: number;

  bookkeeping_account: number | null;

  private_services: number[] | null;
  category: number | null;

  template_instance?: number | null;
};

export enum ObjectType {
  PAYMENT_PACK = 'payment_pack',
  PRIVATE_PASS = 'private_pass',
}

export enum InvoicingType {
  SAME_DAY_AS_SUBSCRIPTION = 'same_day_as_subscription',
  FIXED_DAY = 'fixed_day',
}

export type SubscriptionContractFormDrawerPropsWithoutFormik = {
  displayStopSubscriptionFromMemberSide?: boolean;

  onSubmit: (data: ContractPayload, options?: OptionCallback) => void;

  onClose: () => void;

  open: boolean;

  initial: ContractWithPaymentPack | null;
  tagList?: Array<Tag>;

  paymentPackList: ImmutableArray<PaymentPack>;
  privatePassList: PrivatePass[];

  allowGuestMaster: boolean;
  availableEstablishmentList: Establishment[];
  metaActivityList: MetaActivity[];
  categoryList: SCT[];

  privateServices: Array<PrivateServiceWithSlots>;
  compatibleServicePass?: Array<ServiceCompatibilityPass>;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
  provincialTax: number;
};

export type SubscriptionContractFormDrawerProps =
  SubscriptionContractFormDrawerPropsWithoutFormik & FormikProps<FormValues>;
