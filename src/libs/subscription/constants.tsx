import { getCompanyCountry } from '../theme/selectors';

export const PAUSE_RESULT_SUCCESS = 1;
export const CONTRACT_PAUSE_RESULT_SUCCESS = 2;
export const PAUSE_NAME_MAX_LENGTH = 150;
export const CONTRACT_MAX_NB_INTERVAL_ALLOWED = 90;
export const CONTRACT_TEMPLATE_PAGE_SIZE = 10;

export const PLANNED_INVOICE_TIME_CONFIGURATION = {
  hour: 12,
  minute: 0,
  second: 0,
  millisecond: 0,
};

export const SHOULD_DISPLAY_AUTO_RENEWAL_WARNING_MESSAGE =
  getCompanyCountry() === 'DE';
