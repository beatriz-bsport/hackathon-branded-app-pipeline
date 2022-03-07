import { TFunction } from 'i18next';
import isNil from 'lodash/isNil';

export const provincialTaxHelperText = (
  tax: number,
  provincialTax: number,
  t: TFunction,
) => {
  if (isNil(tax) || isNil(provincialTax)) {
    return '';
  }

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
