import isNil from 'lodash/isNil';
import { RootState } from '../../reducers';
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
 * @returns the price of the product, possibly excluded from tax, with its currency.
 * @param  {any} price mandatory - the including tax price of the product
 * @param  {boolean} isExcludingTax optional - whether the product price must exclude tax
 * @param  {string} tax optional - the tax of the product
 * @example
 * getCurrencyDisplayWithPrice(10)
 * // => 10$ (or € or ... depending on the currency of the studio)
 *
 * getCurrencyDisplay(10,true,50)
 * // => 6.66$
 *
 * getCurrencyDisplay(10,false,50)
 * // => 10$
 *
 */
export const getCurrencyDisplayWithPrice = (
  price: any,
  isExcludingTax?: boolean,
  tax?: any,
) => {
  if (isNil(price)) {
    return '';
  }
  const priceTakingAccountOfTax = getPrice(price, isExcludingTax, tax);

  const symbol = getCurrencyDisplay();

  switch (symbol) {
    case '€':
    case 'kr.':
    case 'chf':
    case 'sek':
    case 'nok':
    case 'dkk':
    case 'лв.':
    case 'RON':
      return `${priceTakingAccountOfTax}${'\u00A0'}${symbol}`;
    default:
      return `${symbol}${priceTakingAccountOfTax}`;
  }
};

export const getCurrencyDisplayWithPriceAndQuantity = (
  price: number,
  quantity?: number,
  isExcludingTax?: boolean,
  tax?: number,
) => {
  if (isNil(price)) {
    return '';
  }
  const priceTakingAccountOfTax =
    parseFloat(getPrice(price, isExcludingTax, tax)) * quantity;

  const symbol = getCurrencyDisplay();

  switch (symbol) {
    case '€':
    case 'kr.':
    case 'chf':
    case 'sek':
    case 'nok':
    case 'dkk':
    case 'лв.':
    case 'RON':
      return `${priceTakingAccountOfTax.toFixed(2)}${'\u00A0'}${symbol}`;
    default:
      return `${symbol}${priceTakingAccountOfTax}`;
  }
};

export const getThemeLoading = (state: RootState) => {
  if (getTheme(state)) {
    return state.theme.loading;
  }
  return null;
};

export default { getTheme };
