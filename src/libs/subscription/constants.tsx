import { getCompanyCountry } from '../theme/selectors';
import { PassType, SubscriptionInvoicingType } from './enums';
import type { ContractTemplateFormValues } from '#src/libs/subscription/types';

export const PAUSE_RESULT_SUCCESS = 1;
export const CONTRACT_PAUSE_RESULT_SUCCESS = 2;
export const PAUSE_NAME_MAX_LENGTH = 150;
export const CONTRACT_MAX_NB_INTERVAL_ALLOWED = 90;
export const CONTRACT_TEMPLATE_PAGE_SIZE = 10;
export const SUBSCRIBED_MEMBER_LIST_PAGE_SIZE = 10;
export const SHARED_PASSES_SELECTOR_ICON_COLOR = '#0B79D0';
export const SHARED_PASSES_SELECTOR_ICON_TOOLTIP_SHADOW =
  '0px 0px 0px 2px #006EC6, 0px 0px 12px 0px rgba(122, 122, 122, 0.35)';
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
  };
