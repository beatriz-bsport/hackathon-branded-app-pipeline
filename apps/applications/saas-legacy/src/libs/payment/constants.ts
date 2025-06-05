import { getCompanyCountry } from '#src/libs/theme/selectors';

import VisaPng from '#src/libs/payment/icons/visa.png';
import MastercardPng from '#src/libs/payment/icons/mastercard.png';
import AmericanExpressPng from '#src/libs/payment/icons/american-express.png';
import DiscoverPng from '#src/libs/payment/icons/discover.png';
import JcbPng from '#src/libs/payment/icons/jcb.png';
import CarteBancairePng from '#src/libs/payment/icons/cartes-bancaires.png';

export enum PaymentMethodBrands {
  AMERICAN_EXPRESS = 'american_express',
  CARTES_BANCAIRES = 'cartes_bancaires',
  DINERS_CLUB = 'diners_club',
  DISCOVER = 'discover',
  EFTPOS_AUSTRALIA = 'eftpos_australia',
  INTERAC = 'interac',
  JCB = 'jcb',
  MASTERCARD = 'mastercard',
  UNIONPAY = 'union_pay',
  VISA = 'visa',
}

export enum StripePaymentMethodNames {
  CARD = 'card',
  SEPA_DEBIT = 'sepa_debit',
  BANCONTACT = 'bancontact',
  IDEAL = 'ideal',
  TWINT = 'twint',
}

export const STRIPE_CARD_ERROR_CODES = [
  'generic_decline',
  'insufficient_funds',
  'incomplete_cvc',
  'incomplete_expiry',
  'incomplete_number',
  'incorrect_number',
  'incorrect_zip',
  'incorrect_cvc',
  'invalid_cvc',
  'invalid_expiry_month',
  'invalid_expiry_year',
  'invalid_expiry_year_past',
  'invalid_number',
  'expired_card',
  'fraudulent',
  'lost_card',
  'stolen_card',
  'card_velocity_exceeded',
];

export const STRIPE_SEPA_ERROR_CODES = [
  'charge_exceeds_source_limit',
  'charge_exceeds_transaction_limit',
  'charge_exceeds_weekly_limit',
];

export const PAYMENT_METHOD_PNG_MAP: {
  [key in PaymentMethodBrands]?: string;
} = {
  [PaymentMethodBrands.AMERICAN_EXPRESS]: AmericanExpressPng,
  [PaymentMethodBrands.CARTES_BANCAIRES]: CarteBancairePng,
  [PaymentMethodBrands.DISCOVER]: DiscoverPng,
  [PaymentMethodBrands.JCB]: JcbPng,
  [PaymentMethodBrands.MASTERCARD]: MastercardPng,
  [PaymentMethodBrands.VISA]: VisaPng,

  // Add more mappings as needed
  [PaymentMethodBrands.DINERS_CLUB]: '',
  [PaymentMethodBrands.EFTPOS_AUSTRALIA]: '',
  [PaymentMethodBrands.INTERAC]: '',
  [PaymentMethodBrands.UNIONPAY]: '',
};

export const PAYMENT_METHOD_BRAND_NAME_MAP: {
  [key in PaymentMethodBrands]?: string;
} = {
  [PaymentMethodBrands.AMERICAN_EXPRESS]: 'American Express',
  [PaymentMethodBrands.CARTES_BANCAIRES]: 'Cartes Bancaires',
  [PaymentMethodBrands.DINERS_CLUB]: 'Diners Club',
  [PaymentMethodBrands.DISCOVER]: 'Discover',
  [PaymentMethodBrands.EFTPOS_AUSTRALIA]: 'eftpos Australia',
  [PaymentMethodBrands.INTERAC]: 'Interac',
  [PaymentMethodBrands.JCB]: 'JCB',
  [PaymentMethodBrands.MASTERCARD]: 'Mastercard',
  [PaymentMethodBrands.UNIONPAY]: 'UnionPay',
  [PaymentMethodBrands.VISA]: 'Visa',
};

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
