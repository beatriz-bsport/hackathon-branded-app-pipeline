import isNil from 'lodash/isNil';
import { RootState } from '../../reducers';
import Config from '../../config';
import { getPrice } from './utils';

const storage = window.localStorage;

export const getTheme = (state: RootState) => state.theme.theme;

export const getStripePkKey = () => {
  const key = storage.getItem('bsport:stripe:pk_key');
  if (!key || key === 'null' || key === 'undefined') {
    return Config.REACT_APP_STRIPE_PK_KEY;
  }
  return key;
};

export const getCurrencyCode = () => {
  const key = storage.getItem('bsport:payment:currency_code');
  if (!key || key === 'null' || key === 'undefined') {
    return 'eur';
  }
  return key;
};

export const getCurrencyDisplay = () => {
  const key = storage.getItem('bsport:payment:currency_display');
  if (!key || key === 'null' || key === 'undefined') {
    return '€';
  }
  return key;
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
      return `${priceTakingAccountOfTax}${'\u00A0'}${symbol}`;
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
