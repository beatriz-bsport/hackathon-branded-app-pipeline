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
