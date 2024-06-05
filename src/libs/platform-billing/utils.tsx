import type { TFunction } from 'i18next';
import type { FeatureList, UpsellPackage } from '#src/libs/company/types';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { UPSELL_IDENTIFIER_SMS } from './upsell-identifiers';

export const hasUpsell = (
  featureList: FeatureList,
  upsellIdentifier: number,
) => {
  return !!featureList?.upsell?.find(
    (f) => f.upsell_identifier === upsellIdentifier,
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
