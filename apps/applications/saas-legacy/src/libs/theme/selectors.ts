import isNil from 'lodash/isNil';
import { RootState } from '#src/reducers';
import Config from '../../config';
import { getPrice } from './utils';
import {
  STORAGE_KEY_BSPORT_DISPLAY_PASS_CREDIT_FACTOR,
  STORAGE_KEY_BSPORT_PAYMENT_COMPANY_COUNTRY,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY,
  STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION,
  STORAGE_KEY_BSPORT_STRIPE_PK_KEY,
} from './constants';
import { getItemInStorage } from '#src/utils/storage';
import { formatPriceWithCurrency } from '#src/libs/theme/utils';

export const getTheme = (state: RootState) => state.theme.theme;

export const getStripePkKey = () => {
  const key =
    getItemInStorage('session', STORAGE_KEY_BSPORT_STRIPE_PK_KEY) ||
    getItemInStorage('local', STORAGE_KEY_BSPORT_STRIPE_PK_KEY);
  if (!key || key === 'null' || key === 'undefined') {
    return Config.REACT_APP_STRIPE_PK_KEY;
  }
  return key;
};

export const getCurrencyCode = () => {
  const key =
    getItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE) ||
    getItemInStorage('local', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE);
  if (!key || key === 'null' || key === 'undefined') {
    return 'eur';
  }
  return key;
};

export const getCurrencyDisplay = () => {
  const key =
    getItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY) ||
    getItemInStorage('local', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY);
  if (!key || key === 'null' || key === 'undefined') {
    return '€';
  }
  return key;
};

export const getStripeRegion = () => {
  const key =
    getItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION) ||
    getItemInStorage('local', STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION);
  if (!key || key === 'null' || key === 'undefined') {
    return 'Europe';
  }
  return key;
};

export const getCompanyCountry = () => {
  const key =
    getItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_COMPANY_COUNTRY) ||
    getItemInStorage('local', STORAGE_KEY_BSPORT_PAYMENT_COMPANY_COUNTRY);
  if (!key || key === 'null' || key === 'undefined') {
    return '';
  }
  return key;
};
export const getCreditFactor = () => {
  const key =
    getItemInStorage(
      'session',
      STORAGE_KEY_BSPORT_DISPLAY_PASS_CREDIT_FACTOR,
    ) ||
    getItemInStorage('local', STORAGE_KEY_BSPORT_DISPLAY_PASS_CREDIT_FACTOR);
  if (!key || key === 'null' || key === 'undefined') {
    return 1;
  }
  return parseInt(key, 10);
};

/**
 * Returns the price of the product, possibly excluding tax, with its currency.
 * Negative prices are properly formatted with a minus sign before the currency symbol.
 *
 * @param {number|string} price - The mandatory including-tax price of the product.
 * @param {boolean} [isExcludingTax] - Optional flag to exclude tax from the product price.
 * @param {number} [tax] - Optional tax percentage of the product.
 * @param {string} [currencyDisplay] - Optional currency symbol.
 * @returns {string} The formatted price with its currency.
 * @example
 * getCurrencyDisplayWithPrice(10)
 * // => "10.00 €" (depending on the studio currency)
 *
 * getCurrencyDisplayWithPrice(-10)
 * // => "-10.00 €"
 */
export const getCurrencyDisplayWithPrice = (
  price: any,
  isExcludingTax?: boolean,
  tax?: any,
  currencyDisplay?: string,
): string => {
  if (isNil(price)) {
    return '';
  }

  const priceTakingAccountOfTax = getPrice(price, isExcludingTax, tax);
  const symbol = currencyDisplay || getCurrencyDisplay();
  const isNegative = priceTakingAccountOfTax.startsWith('-');
  const priceNumber = parseFloat(priceTakingAccountOfTax);

  return formatPriceWithCurrency(priceNumber, symbol, isNegative);
};

export const getThemeLoading = (state: RootState) => {
  if (getTheme(state)) {
    return state.theme.loading;
  }
  return null;
};

export default { getTheme };
