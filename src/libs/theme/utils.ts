import { TFunction } from 'i18next';
import isNil from 'lodash/isNil';
import { getCreditFactor } from '#src/libs/theme/selectors';

export const provincialTaxHelperText = (
  tax: number,
  provincialTax: number,
  t: TFunction,
) => {
  if (isNil(tax) || isNil(provincialTax)) {
    return '';
  }

  // @ts-expect-error
  if (parseFloat(tax) <= parseFloat(provincialTax)) {
    return t('theme:provincialTax.helperText');
  }
  return '';
};
/**
 * Convert the including tax price to excluding tax price if needed.
 * @param  {string} price
 * @param  {boolean} isExcludingTax
 * @param  {string} tax
 */
export const getPrice = (price: any, isExcludingTax?: boolean, tax?: any) => {
  if (isNil(price)) {
    return '0';
  }
  let res = parseFloat(price);
  if (isExcludingTax && tax) {
    res = parseFloat(price) / (parseFloat(tax) / 100 + 1);
  }
  return res?.toFixed(2);
};

export const getTaxPrice = (price: any, tax: any) => {
  if (isNil(price)) {
    return 0;
  }
  if (isNil(tax)) {
    return 0;
  }

  const price_without_tax = getPrice(price, true, tax);
  const res = parseFloat(price) - parseFloat(price_without_tax);

  return res?.toFixed(2);
};

export const getCustomCurrencyDisplayWithPrice = (
  price: any,
  currencyDisplay: string,
  isExcludingTax?: boolean,
  tax?: any,
) => {
  if (isNil(price)) {
    return '';
  }
  const priceTakingAccountOfTax = getPrice(price, isExcludingTax, tax);

  switch (currencyDisplay) {
    case '€':
    case 'kr.':
    case 'chf':
    case 'sek':
    case 'nok':
    case 'dkk':
      return `${priceTakingAccountOfTax}${'\u00A0'}${currencyDisplay}`;
    default:
      return `${currencyDisplay}${priceTakingAccountOfTax}`;
  }
};

export const MAX_COLOR_BRIGHTNESS = 210;

export const minsToHrMins = (minutesToConvert: number) => {
  const hours = Math.floor(minutesToConvert / 60);
  const minutes = minutesToConvert % 60;
  return { hours, minutes };
};

/**
 * Calculates the value of credits divided by the credit factor.
 * @param credits The number of credits to be divided.
 * @returns The result of dividing the credits by the credit factor.
 */
export const getCreditsDividedValue = (credits: number) => {
  return (credits || 0) / getCreditFactor();
};

/**
 * Divides the given credits by the credit factor and formats the result based on the decimal precision.
 * @param credits The number of credits to be divided.
 * @returns A string representing the divided value, formatted based on its decimal precision:
 *          - If the divided value is an integer, the value itself is returned.
 *          - If the divided value has only one decimal, it is returned with one decimal place.
 *          - If the divided value has two or more decimals, it is returned with two decimal places.
 */
export const getCreditsDividedDisplay = (credits: number) => {
  const valueDivided = getCreditsDividedValue(credits);

  // If the value is an integer, return the value itself.
  if (valueDivided % 1 === 0) {
    return valueDivided.toString();
  }

  // If the value has only one decimal, return it with one decimal place.
  if ((valueDivided * 10) % 1 === 0) {
    return valueDivided.toFixed(1);
  }

  // If the value has two or more decimals, return it with two decimal places.
  return valueDivided.toFixed(2);
};
