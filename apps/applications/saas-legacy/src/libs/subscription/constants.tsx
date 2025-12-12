import { getCompanyCountry } from '../theme/selectors';
import { PassType, SubscriptionInvoicingType } from './enums';
import type { ContractTemplateFormValues } from '#src/libs/subscription/types';

export const PAUSE_RESULT_SUCCESS = 1;
export const CONTRACT_PAUSE_RESULT_SUCCESS = 2;
export const PAUSE_NAME_MAX_LENGTH = 150;
export const CONTRACT_MAX_NB_INTERVAL_ALLOWED = 110;
export const CONTRACT_TEMPLATE_PAGE_SIZE = 10;
export const SUBSCRIBED_MEMBER_LIST_PAGE_SIZE = 10;
export const PRIMARY_BLUE_CONTRACT_DETAIL = '#0B79D0';
export const SHARED_PASSES_SELECTOR_ICON_TOOLTIP_SHADOW =
  '0px 0px 0px 2px #006EC6, 0px 0px 12px 0px rgba(122, 122, 122, 0.35)';
export const BORDER_RADIUS_CONTRACT_DETAIL = 4;
export const FONT_WEIGHT_CONTRACT_DETAIL = 500;
export const FONT_SIZE_CONTRACT_DETAIL = '0.875rem';
export const CONTRACT_MAX_COMMITMENT_VALUE_ALLOWED = 90;

export const PLANNED_INVOICE_TIME_CONFIGURATION = {
  hour: 12,
  minute: 0,
  second: 0,
  millisecond: 0,
};

export const SHOULD_DISPLAY_AUTO_RENEWAL_WARNING_MESSAGE =
  getCompanyCountry() === 'DE';

export const DEFAULT_CONTRACT_TEMPLATE_FORM_INITIAL_VALUES: ContractTemplateFormValues =
  {
    name: '',
    description: '',
    productType: PassType.PASSES,
    paymentPackTemplate: null,
    privatePassTemplate: null,
    recurrentPrice: 0,
    flatFee: 0,
    invoicingType: SubscriptionInvoicingType.FIXED_DAY,
    interval: 'month',
    recurrenceBasis: 1,
    numberOfIntervals: 12,
    contract: '',
    monthBillingDay: 1,
    managerOnly: false,
    autoRenewal: false,
    unusableByStaff: false,
    editable: true,
    has_mandatory_commitment_period: false,
    commitment_period_value: 1,
    commitment_period_unit: 'month',
  };

export const PAUSE_RESULT_FAIL_INCOMING_BILL = 63101;
export const PAUSE_RESULT_FAIL_OVERLAP_PAUSE = 63102;
export const PAUSE_RESULT_FAIL_CAN_NOT_CANCEL_PAUSE = 63103;
export const PAUSE_RESULT_FAIL_SUBSCRIPTION_WILL_END_BEFORE_PAUSE = 63104;
export const PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_START_WHEN_HAS_STARTED = 63105;
export const PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_END_BEFORE_TODAY = 63106;
export const PAUSE_RESULT_FAIL_CAN_NOT_CREATE_A_PAUSE_IN_THE_PAST = 63108;
export const PAUSE_RESULT_FAIL_SUBSCRIPTION_HAS_NOT_STARTED_YET = 63110;
export const PAUSE_RESULT_FAIL_INVALID_TIMEDELTA = 63111;

export const PAUSE_RESULTS_ERROR_CODES = [
  PAUSE_RESULT_FAIL_INCOMING_BILL,
  PAUSE_RESULT_FAIL_OVERLAP_PAUSE,
  PAUSE_RESULT_FAIL_CAN_NOT_CANCEL_PAUSE,
  PAUSE_RESULT_FAIL_SUBSCRIPTION_WILL_END_BEFORE_PAUSE,
  PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_START_WHEN_HAS_STARTED,
  PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_END_BEFORE_TODAY,
  PAUSE_RESULT_FAIL_CAN_NOT_CREATE_A_PAUSE_IN_THE_PAST,
  PAUSE_RESULT_FAIL_SUBSCRIPTION_HAS_NOT_STARTED_YET,
  PAUSE_RESULT_FAIL_INVALID_TIMEDELTA,
] as const;
