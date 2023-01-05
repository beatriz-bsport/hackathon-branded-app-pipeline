import { TFunction } from 'i18next';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { Contract } from '#libs/subscription/types';

import { getMarketplaceSearchItemIndicator as getPaymentPackIndicator } from '#libs/payment-packs/utils';
import { getMarketplaceSearchItemIndicator as getPrivatePassIndicator } from '#libs/private-service/utils';
import { getMarketplaceSearchItemIndicator as getPaymentComboIndicator } from '#libs/payment-combo/utils';

export enum ItemType {
  PAYMENT_PACK = 1,
  PRIVATE_PASS = 2,
  PAYMENT_COMBO = 3,
  CONTRACT = 4,
}

type HelperResolverChoices =
  | {
      itemType: ItemType.PAYMENT_PACK;
      item: PaymentPack;
    }
  | {
      itemType: ItemType.PRIVATE_PASS;
      item: PrivatePass;
    }
  | {
      itemType: ItemType.PAYMENT_COMBO;
      item: PaymentCombo;
    }
  | {
      itemType: ItemType.CONTRACT;
      item: Contract;
    };

export const getSearchItemIndicator = (
  kind: HelperResolverChoices,
  t: TFunction,
) => {
  switch (kind.itemType) {
    case ItemType.PAYMENT_PACK:
      return getPaymentPackIndicator(kind?.item, t);
    case ItemType.PRIVATE_PASS:
      return getPrivatePassIndicator(kind?.item, t);
    case ItemType.PAYMENT_COMBO:
      return getPaymentComboIndicator(kind?.item, t);
    default:
      return null;
  }
};

export const getSearchItemPrice = (
  kind: HelperResolverChoices,
  t: TFunction,
) => {
  switch (kind.itemType) {
    case ItemType.PAYMENT_PACK:
      return getCurrencyDisplayWithPrice(kind?.item?.price ?? 0);
    case ItemType.PRIVATE_PASS:
      return getCurrencyDisplayWithPrice(kind?.item?.price ?? 0);
    case ItemType.PAYMENT_COMBO:
      return getCurrencyDisplayWithPrice(kind?.item?.price ?? 0);
    case ItemType.CONTRACT:
      return t('platformBilling:platformBillingStage.monthlyPrice', {
        price: getCurrencyDisplayWithPrice(kind?.item?.recurrent_price ?? 0),
      });
    default:
      return null;
  }
};
