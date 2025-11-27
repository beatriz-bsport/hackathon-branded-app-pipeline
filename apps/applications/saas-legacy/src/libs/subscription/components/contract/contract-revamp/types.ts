import { PaymentCombo } from '#src/libs/payment-combo/types';
import {
  PaymentPack,
  StartDateMethodType,
} from '#src/libs/payment-packs/types';
import { PrivatePass } from '#src/libs/private-service/types';
import {
  Contract,
  ContractWithPaymentPack,
} from '#src/libs/subscription/types';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { OptionCallback } from '#src/state/types';
import { FormikProps } from 'formik';

export type FormValues = Omit<
  ContractWithPaymentPack,
  | 'payment_pack'
  | 'private_pass'
  | 'payment_combo'
  | 'company'
  | 'tax'
  | 'disabled'
  | 'id'
  | 'is_usable_by_staff'
> & {
  payment_pack_details?: PaymentPackDetails;
  private_pass_details?: PrivatePassDetails;
  object_type: ObjectType;
  unusable_by_staff: boolean;
  invoicing_type: InvoicingType;
  tags_on_first_billing?: Array<number>;
};

export type PaymentPackDetails = {
  credits: number | null;
  theorical_margin_value: number;

  bookkeeping_account_id?: number | null;
  sct_ids?: number[] | null;
  meta_activity_ids?: number[] | null;
  establishment_ids?: number[] | null;

  max_bookings_per_day?: number | null;
  max_bookings_per_week?: number | null;
  max_bookings_per_month?: number | null;
  max_purchase_per_member?: number | null;

  tax?: number;
  start_date_method?: StartDateMethodType;

  full_vod_access?: boolean;
  only_vod_access?: boolean;
  allow_guest_pass?: boolean;
  applies_for_payroll?: boolean;
  grants_door_access?: boolean;

  expiration_days_before_first_use?: number;
  expiration_date?: string | null;
  ordering_in_category?: number;

  penalty_active?: boolean;
  penalty_nb_late_cancellations?: number;
  penalty_nb_days?: number;
  penalty_kind?: number;
  penalty_days_blocked?: number;
  penalty_account_value?: number;
  penalty_mode_franchisor?: number;
  no_show_penalty_active?: boolean;
  no_show_penalty_threshold?: number;
  no_show_penalty_time_window_days?: number;
  no_show_penalty_kind?: number;
  no_show_penalty_days_blocked?: number;
  no_show_penalty_amount?: number;
  no_show_penalty_mode_franchisor?: number;

  off_peak_schedule?: Record<string, string[][]>;
};

export type PrivatePassDetails = {
  start_date_method?: number;

  credits: number;
  expiration_days_before_first_use?: number;
  tax: number;
  expiration_date?: string | null;
  is_unpaid_private_booking_integration?: boolean;

  available?: boolean;

  applies_for_payroll?: boolean;
  on_behalf_of_teacher?: boolean;

  full_vod_access?: boolean;
  grants_door_access?: boolean;

  barcode?: string | null;
  bookkeeping_account_id?: number | null;
  category_id?: number | null;
  ordering_in_category?: number;

  private_service_ids?: number[] | null;
};

export enum ObjectType {
  paymentPack = 'payment_pack',
  privatePass = 'private_pass',
  paymentCombo = 'payment_combo',
}

export enum InvoicingType {
  sameDayAsSubscription = 'same_day_as_subscription',
  fixedDay = 'fixed_day',
}

export type SubscriptionContractFormDrawerPropsWithoutFormik = {
  displayStopSubscriptionFromMemberSide?: boolean;

  onSubmit: (data: any, options: OptionCallback) => void;

  onClose: () => void;

  open: boolean;

  isSubmitting: boolean;
  initial?: ContractWithPaymentPack<PrivatePass, PaymentCombo> | Contract;
  paymentPackList: PaymentPack[];
  privatePassList: PrivatePass[];
  paymentComboList: PaymentCombo[];
  tagList?: Array<Tag<TagGroup>>;
};

export type SubscriptionContractFormDrawerProps =
  SubscriptionContractFormDrawerPropsWithoutFormik & FormikProps<FormValues>;
