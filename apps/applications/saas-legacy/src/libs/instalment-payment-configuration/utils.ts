import { TFunction } from 'i18next';
import { DAILY, MONTHLY, WEEKLY } from './constants';
import {
  CustomFirstInstalmentType,
  type InstalmentPayment,
  type InstalmentPaymentApiWithBasketId,
} from './types';

export const generateRecurrencyString = (
  t: TFunction,
  recurrency: 1 | 2 | 3 | 4,
  frequency: number,
) => {
  switch (recurrency) {
    case WEEKLY:
      return t('form.recurrency.week', { count: frequency });
    case MONTHLY:
      return t('form.recurrency.month', { count: frequency });
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
  const total = (number_of_billing - 1) * frequency;
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
  })} - ${allThe} ${generateRecurrencyString(t, recurrency, frequency)}`;
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

export const identifyCompability = (instalmentPayment: InstalmentPayment) => {
  if (!instalmentPayment) return false;
  return Boolean(
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
};

// @debt(4, 2, 3): Potential side effects in the installment calculation logic if business rules change
// Calculate the amount for each instalment except the last one, rounded down
/**
 * Computes the first instalment amount for a given instalment payment configuration and basket price.
 * Mirrors the logic in BasketInstalmentPaymentOption.
 */
export function getFirstInstalmentAmount(
  instalmentPayment: InstalmentPaymentApiWithBasketId,
  basketPrice: number,
): string {
  const {
    number_of_billing,
    custom_first_instalment_amount,
    custom_first_instalment_enabled,
    custom_first_instalment_percent,
    custom_first_instalment_type,
    partial_payment_enabled,
  } = instalmentPayment;

  // TODO: FIX TYPING, custom_first_instalment_amount is a string
  const customFirstInstalmentAmountAsNumber = Number.parseFloat(
    // @ts-expect-error
    custom_first_instalment_amount,
  );

  const hasCustomFirstPayment =
    custom_first_instalment_enabled || partial_payment_enabled;

  if (!hasCustomFirstPayment)
    return (Math.trunc((basketPrice / number_of_billing) * 100) / 100).toFixed(
      2,
    );
  if (custom_first_instalment_type === CustomFirstInstalmentType.AMOUNT)
    return (customFirstInstalmentAmountAsNumber || 0).toFixed(2);
  return (((custom_first_instalment_percent || 0) / 100) * basketPrice).toFixed(
    2,
  );
}
