import { offPeakGroupDefault } from '#src/libs/payment-packs/utils';
import type { CompatiblePrivateService } from '#src/libs/private-service/types';
import { getCreditFactor } from '#src/libs/theme/selectors';
import {
  CREDIT_NUMBER_OPTION,
  FormValues,
  PaymentPackDetailsForms,
  PrivatePassDetailsForms,
  ObjectType,
  InvoicingType,
} from './types';

export const emptyPaymentPackDetailsForms: PaymentPackDetailsForms = {
  credit_number: CREDIT_NUMBER_OPTION.limited,
  credits: getCreditFactor(),
  expiration_days_before_first_use: 365,
  theorical_margin_value: 0,
  apply_penalties: false,
  penalty_active: false,
  no_show_penalty_active: false,
  penalty_nb_late_cancellations: 3,
  penalty_nb_days: 7,
  penalty_kind: 'block',
  penalty_days_blocked: 7,
  penalty_account_value: 10,
  no_show_penalty_threshold: 3,
  no_show_penalty_time_window_days: 7,
  no_show_penalty_kind: 'block',
  no_show_penalty_days_blocked: 7,
  no_show_penalty_amount: 10,
  max_bookings_per_day: null,
  max_bookings_per_week: null,
  max_bookings_per_month: null,
  max_purchase_per_member: null,
  categories: [],
  establishments: [],
  metaActivities: [],
  full_vod_access: false,
  only_vod_access: false,
  allow_guest_pass: true,
  applies_for_payroll: true,
  off_peak_schedule: [offPeakGroupDefault()],
  off_peak_active: false,
  grants_door_access: false,
  bookkeeping_account: null,
};

export const emptyPrivatePassDetailsForms: PrivatePassDetailsForms = {
  credits: getCreditFactor(),
  expiration_days_before_first_use: 365,
  description: null,
  available: true,
  applies_for_payroll: true,
  on_behalf_of_teacher: false,
  full_vod_access: true,
  grants_door_access: false,
  bookkeeping_account: null,
  private_services: null,
  category: null,
  template_instance: null,
  compatibility: [] as Array<CompatiblePrivateService>,
};

export const emptyContractForms: FormValues = {
  name: '',
  description: '',
  contract: '',
  tax: 0,

  object_type: ObjectType.PAYMENT_PACK,
  unusable_by_staff: false,
  invoicing_type: InvoicingType.SAME_DAY_AS_SUBSCRIPTION,

  manager_only: false,
  auto_renewal: false,

  flat_fee: '0',
  recurrent_price: '0',

  nb_interval: 1,
  interval: 'month',
  recurrence_basis: 1,
  month_billing_day: null,

  highlighted_as_recommended: false,
  tags_on_first_billing: [],
  nb_interval_after_auto_renewal: null,
  contract_template: null,
  editable: true,

  has_mandatory_commitment_period: false,
  commitment_period_value: 1,
  commitment_period_unit: 'month',

  payment_pack_details: emptyPaymentPackDetailsForms,
  private_pass_details: emptyPrivatePassDetailsForms,
};
