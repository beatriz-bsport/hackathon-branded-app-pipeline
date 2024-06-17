import { getCompanyCountry } from '#src/libs/theme/selectors';

/**
 * Determines whether the bookkeeping account feature is enabled based on the company's country.
 * Is true if the company's country is 'DE' (Germany), otherwise is false.
 * This will disable API calls and hide input components.
 *
 * @return {boolean} whether the bookkeeping account feature is enabled
 */
export const IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED =
  getCompanyCountry() === 'DE';

export const USER_REGISTRATION_RESPONSE_QUERY_PARAM =
  'user_registration_response';

export const USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY =
  'latest_user_registration_response';
