import { TFunction } from 'i18next';
import isNil from 'lodash/isNil';
import { getCreditFactor, getCurrencyDisplay } from '#src/libs/theme/selectors';

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
export const getCreditsDividedValue = (credits?: number | null) => {
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
export const getCreditsDividedDisplay = (credits?: number | null) => {
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

/**
 * Formats the given credits based on wether it is unlimited and its decimal precision.
 * @param t The translation function must contain the `paymentPack` namespace.
 * @param credits The number of credits to be formatted.
 * @param isUnlimited Whether the credits are unlimited.
 * @returns A string representing the formatted credits:
 */
export const getFormatedCredits = (
  t: TFunction,
  credits: number,
  isUnlimited: boolean,
) => {
  if (isUnlimited) {
    return t('paymentPack:specifications.unlimitedCredits');
  }

  return t('paymentPack:specifications.nbCredits', {
    credits: getCreditsDividedDisplay(credits),
    count: credits,
  });
};

/*
 * Returns the helper text when the credit value is decimal.
 * @param credits The number of credits to be divided.
 * @param translationTextKey The translation key for the helper text.
 * @param t The translation function.
 * @param initialHelperText The initial helper text, if the credit factor is 1.
 * @returns The helper text based on the credit value and the credit factor
 */
export const getDecimalCreditHelperText = (
  credits: number,
  translationTextKey: string,
  t: TFunction,
  initialHelperText: string,
) => {
  const dividedDisplayCreditPrice = getCreditsDividedDisplay(credits);

  if (getCreditFactor() === 1) {
    return initialHelperText;
  }

  return t(translationTextKey, {
    count: Number(dividedDisplayCreditPrice),
  });
};

/**
 * Formats a price with its corresponding currency symbol, properly handling negative values.
 *
 * @param {number} price - The price to format.
 * @param {string} symbol - The currency symbol.
 * @param {boolean} [isNegative=false] - Indicates if the price is negative. Negative prices will be prefixed with a minus sign.
 * @returns {string} The formatted price with currency.
 * @example
 * formatPriceWithCurrency(10, '€')
 * // => "10.00 €"
 *
 * formatPriceWithCurrency(10, '$', true)
 * // => "-$10.00"
 */
export const formatPriceWithCurrency = (
  price: number,
  symbol: string,
  isNegative: boolean = false,
): string => {
  const absolutePrice = Math.abs(price).toFixed(2);

  const negativeSign = price < 0 || isNegative ? '-' : '';

  switch (symbol) {
    case '€':
    case 'kr.':
    case 'sek':
    case 'nok':
    case 'dkk':
    case 'лв.':
    case 'RON':
      return `${negativeSign}${absolutePrice}${'\u00A0'}${symbol}`;
    case 'CHF':
      return `${negativeSign}${symbol}${'\u00A0'}${absolutePrice}`;
    default:
      return `${negativeSign}${symbol}${absolutePrice}`;
  }
};

/**
 * Extracts formatted price details, including currency symbol, main and fractional amounts.
 *
 * @param {number} price - The price to process.
 * @param {boolean} [isExcludingTax] - Whether to exclude tax.
 * @param {number} [tax] - The tax percentage.
 * @returns {object} An object containing `integerAmount`, `fractionalAmount`, `symbol`, `amount` and `amountWithSymbol`.
 */
export const getPriceDetails = (
  price: number,
  tax?: number,
  isExcludingTax?: boolean,
) => {
  let priceLabel = getPrice(price, isExcludingTax, tax);
  if (priceLabel === '0') priceLabel = '0.00';

  const symbol = getCurrencyDisplay();
  const [integerAmount, fractionalAmount] = priceLabel.split('.');
  const amountWithSymbol = symbol + priceLabel;

  return {
    integerAmount,
    fractionalAmount: `.${fractionalAmount}`,
    symbol,
    amount: priceLabel,
    amountWithSymbol,
  };
};
