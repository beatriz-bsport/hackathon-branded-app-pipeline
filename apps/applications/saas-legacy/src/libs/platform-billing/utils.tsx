import type { TFunction } from 'i18next';
import type { FeatureList, UpsellPackage } from '#src/libs/company/types';

import Config from '#src/config';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { UPSELL_IDENTIFIER_SMS } from './upsell-identifiers';

import { STRIPE_TEST_VAT_IDS } from './constant';

export const hasUpsell = (
  featureList: FeatureList,
  upsellIdentifier: number,
) => {
  return !!featureList?.upsell?.find(
    (f) => f.upsell_identifier === upsellIdentifier,
  );
};

export const hasAnyUpsell = (
  featureList: FeatureList,
  upsellIdentifiers: number[],
) => {
  return featureList?.upsell?.some((f) =>
    upsellIdentifiers.includes(f.upsell_identifier),
  );
};

export const hasFreeTrial = (
  featureList: FeatureList,
  upsellIdentifier: number,
) => {
  return !!featureList?.upsell?.find(
    (f) => f.upsell_identifier === upsellIdentifier && f.is_free_trial,
  );
};

export const getTrialRemainingDays = (
  featureList: FeatureList,
  upsellIdentifier: number,
) => {
  return (
    featureList?.upsell?.find((f) => f.upsell_identifier === upsellIdentifier)
      ?.trial_remaining_days || null
  );
};

/**
 * The prices saved under attribute `price_cts` are in cents, and have the following rules:
 * - SMS upsell: billed per SMS sent.
 * - Others upsells: billed per month.
 */
export function getUpsellPriceString(
  upsellPackage: UpsellPackage,
  t: TFunction,
): string {
  if (upsellPackage.upsell_identifier === UPSELL_IDENTIFIER_SMS) {
    return t('upsellPackage.billSMS', {
      price_cts: getCurrencyDisplayWithPrice(upsellPackage.price_cts / 100),
    });
  }
  return t('upsellPackage.billRecurrent', {
    price_cts: getCurrencyDisplayWithPrice(upsellPackage.price_cts / 100),
  });
}

/**
 * The simplified format of an EU VAt id is two letters followed by 8 to 12 characters.
 * Its exact format will depend on the company country.
 */
export const isValidEuVatId = (vatId: string): boolean => {
  // Stripe test VAT Ids don't respect regex
  if (
    STRIPE_TEST_VAT_IDS.includes(vatId) &&
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production'
  )
    return true;

  const regex = /^[A-Z]{2}.{8,12}$/;
  return regex.test(vatId);
};
