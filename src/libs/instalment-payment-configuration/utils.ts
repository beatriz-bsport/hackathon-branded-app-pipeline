import { TFunction } from 'i18next';
import { DAILY, MONTHLY, WEEKLY } from './constants';
import { InstalmentPayment } from './types';

export const generateRecurrencyString = (
  t: TFunction,
  recurrency: 1 | 2 | 3 | 4,
  frequency: number,
) => {
  switch (recurrency) {
    case WEEKLY:
      return t('form.recurrency.week', { count: frequency });
    case MONTHLY:
      return t('form.recurrency.month');
    case DAILY:
      return t('form.recurrency.day', { count: frequency });
    default:
      return t('form.recurrency.year', { count: frequency });
  }
};

export const generateInfo = (
  t: TFunction,
  recurrency: 1 | 2 | 3 | 4,
  frequency: number,
  number_of_billing: number,
) => {
  const total = number_of_billing * frequency;
  switch (recurrency) {
    case DAILY:
      return (
        t('form.info.startDay', { frequency }) +
        t('form.info.middle', { total }) +
        generateRecurrencyString(t, recurrency, total) +
        t('form.info.end', { number_of_billing, count: number_of_billing })
      );

    case WEEKLY:
      return (
        t('form.info.startWeek', { frequency }) +
        t('form.info.middle', { total }) +
        generateRecurrencyString(t, recurrency, total) +
        t('form.info.end', { number_of_billing, count: number_of_billing })
      );

    case MONTHLY:
      return (
        t('form.info.startMonth', { frequency }) +
        t('form.info.middle', { total }) +
        generateRecurrencyString(t, recurrency, total) +
        t('form.info.end', { number_of_billing, count: number_of_billing })
      );

    default:
      return (
        t('form.info.startYear', { frequency }) +
        t('form.info.middle', { total }) +
        generateRecurrencyString(t, recurrency, total) +
        t('form.info.end', { number_of_billing, count: number_of_billing })
      );
  }
};

export const generateInstalmentPaymentSecondaryText = (
  t: TFunction,
  recurrency: 1 | 2 | 3 | 4,
  frequency: number,
  number_of_billing: number,
) => {
  let allThe = t('menu.secondary.allMasculine', { frequency });
  if (recurrency === WEEKLY) {
    allThe = t('menu.secondary.allFeminine', { frequency });
  }
  return `${t('menu.secondary.numberOfBilling', {
    number_of_billing,
    count: number_of_billing,
  })} - ${allThe} ${generateRecurrencyString(t, recurrency, 2)}`;
};

export const generateDuration = (
  t: TFunction,
  recurrency: 1 | 2 | 3 | 4,
  frequency: number,
  number_of_billing: number,
) => {
  return t('detail.duration', {
    frequency,
    recurrency: generateRecurrencyString(t, recurrency, frequency),
    number_of_billing,
    recurrency_ponderate_by_number_of_billing: generateRecurrencyString(
      t,
      recurrency,
      number_of_billing,
    ),
  });
};

export const generatePackCompatibilityInfo = (
  t: TFunction,
  length: number,
  isAvailableForAll: boolean,
) => {
  if (isAvailableForAll) {
    return t('detail.packAvailableForAll');
  }
  return t('detail.packAvailable', { length, count: length });
};

export const generatePrivatePassCompatibilityInfo = (
  t: TFunction,
  length: number,
  isAvailableForAll: boolean,
) => {
  if (isAvailableForAll) {
    return t('detail.privatePassAvailableForAll');
  }
  return t('detail.privatePassAvailable', { length, count: length });
};

export const generateComboCompatibilityInfo = (
  t: TFunction,
  length: number,
  isAvailableForAll: boolean,
) => {
  if (isAvailableForAll) {
    return t('detail.comboAvailableForAll');
  }
  return t('detail.comboAvailable', { length, count: length });
};

export const generateGiftcardCompatibilityInfo = (
  t: TFunction,
  length: number,
  isAvailableForAll: boolean,
) => {
  if (isAvailableForAll) {
    return t('detail.giftcardAvailableForALl');
  }
  return t('detail.giftcardAvailable', { length, count: length });
};

export const generateShopItemCompatibilityInfo = (
  t: TFunction,
  length: number,
  isAvailableForAll: boolean,
) => {
  if (isAvailableForAll) {
    return t('detail.shopItemAvailableForALl');
  }
  return t('detail.shopItemAvailable', { length, count: length });
};

export const identifyCompability = (instalmentPayment: InstalmentPayment) =>
  Boolean(
    !instalmentPayment.private_pass_list?.length &&
      !instalmentPayment.payment_pack_list?.length &&
      !instalmentPayment.payment_combo_list?.length &&
      !instalmentPayment.shop_item_list?.length &&
      !instalmentPayment.giftcard_list?.length &&
      !instalmentPayment.is_available_on_all_giftcard &&
      !instalmentPayment.is_available_on_all_private_pass &&
      !instalmentPayment.is_available_on_all_payment_combo &&
      !instalmentPayment.is_available_on_all_payment_pack &&
      !instalmentPayment.is_available_on_all_shop_item,
  );
