import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import chroma from 'chroma-js';
import { TFunction } from 'i18next';

import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { ShopItem } from '#libs/shop/types';
import { Contract } from '#libs/subscription/types';
import { Giftcard } from '#libs/giftcard/types';

import { QuicksaleCardInfo } from './types';
import { QuicksaleItemColor, QuicksaleSectionColor } from './constants';

export const getBorderColorFromBackgroundColor = (backgroundColor: string) => {
  // This function retrieves the border color of an item card of the quicksale
  // configuration based on the background color of the card.
  const colorKey = Object.keys(QuicksaleItemColor).find(
    (key: keyof typeof QuicksaleItemColor) =>
      QuicksaleItemColor[key] === backgroundColor,
  );
  if (colorKey)
    return QuicksaleSectionColor[
      colorKey as keyof typeof QuicksaleSectionColor
    ];
  return QuicksaleSectionColor.Black;
};

const DEFAULT_BRIGHTNESS_THRESHOLD = 0.27;

export function determinePropertyFromBrightness<T>(
  color: string,
  highBrightnessProperty: T,
  lowBrightnessProperty: T,
  threshold: number = DEFAULT_BRIGHTNESS_THRESHOLD,
): T {
  // If the color's brightness is above the threshold, returns the high brightness property
  // Otherwise, returns the low brightness property
  return chroma(color).luminance() > threshold
    ? highBrightnessProperty
    : lowBrightnessProperty;
}

export const getBuyableItemFromIdentifierAndId = (
  buyableItemIdentifier: QuicksaleBasketItem,
  id: number,
  paymentPackById: { [key: number]: PaymentPack },
  privatePassById: { [key: number]: PrivatePass },
  paymentComboById: { [key: number]: PaymentCombo },
  shopItemById: { [key: number]: ShopItem },
  subscriptionById: { [key: number]: Contract },
  giftcardById: { [key: number]: Giftcard },
) => {
  switch (buyableItemIdentifier) {
    case QuicksaleBasketItem.PaymentPackIdentifier:
      return paymentPackById[id]?.is_usable_by_staff
        ? paymentPackById[id]
        : undefined;
    case QuicksaleBasketItem.PrivatePassIdentifier:
      return privatePassById[id]?.is_usable_by_staff
        ? privatePassById[id]
        : undefined;
    case QuicksaleBasketItem.PaymentComboIdentifier:
      return paymentComboById[id]?.is_usable_by_staff
        ? paymentComboById[id]
        : undefined;
    case QuicksaleBasketItem.ShopItemIdentifier:
      return shopItemById[id];
    case QuicksaleBasketItem.SubscriptionIdentifier:
      return subscriptionById[id]?.is_usable_by_staff
        ? subscriptionById[id]
        : undefined;
    default:
      return giftcardById[id];
  }
};

export type BuyableItemAndIdentifier =
  | {
      buyableItemIdentifier: QuicksaleBasketItem.PaymentPackIdentifier;
      buyableItem: PaymentPack;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.PrivatePassIdentifier;
      buyableItem: PrivatePass;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.PaymentComboIdentifier;
      buyableItem: PaymentCombo;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.ShopItemIdentifier;
      buyableItem: ShopItem;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.SubscriptionIdentifier;
      buyableItem: Contract;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.GiftcardIdentifier;
      buyableItem: Giftcard;
    };

export const getCardInfoFromBuyableItem = (
  { buyableItemIdentifier, buyableItem }: BuyableItemAndIdentifier,
  t: TFunction, // defined with the namespace 'quicksale'
  color?: string,
  sectionId?: string,
): QuicksaleCardInfo => {
  const id = `${buyableItemIdentifier} ${buyableItem.id}`;
  const itemColor = (color ?? QuicksaleItemColor.Gray) as QuicksaleItemColor;
  switch (buyableItemIdentifier) {
    case QuicksaleBasketItem.PaymentPackIdentifier:
      return {
        id,
        title: buyableItem.name,
        subtitle: `${t('objectCard.subtitle.paymentPack')} - ${
          (<PaymentPack>buyableItem).credits === null
            ? t('objectCard.subtitle.unlimited')
            : `${(<PaymentPack>buyableItem).credits} ${t(
                'objectCard.subtitle.credit',
                {
                  count: (<PaymentPack>buyableItem).credits,
                },
              )}`
        }`,
        price: Number((<PaymentPack>buyableItem).price),
        color: itemColor,
        sectionId: sectionId ?? '',
      };
    case QuicksaleBasketItem.PrivatePassIdentifier:
      return {
        id,
        title: buyableItem.name,
        subtitle: `${t('objectCard.subtitle.privatePass')} - ${
          (<PrivatePass>buyableItem).credits
        } ${t('objectCard.subtitle.credit', {
          count: (<PrivatePass>buyableItem).credits,
        })}`,
        price: Number((<PrivatePass>buyableItem).price),
        color: itemColor,
        sectionId: sectionId ?? '',
      };
    case QuicksaleBasketItem.PaymentComboIdentifier: {
      const numberOfProducts =
        (<PaymentCombo>buyableItem).payment_packs.length +
        (<PaymentCombo>buyableItem).private_passes.length +
        (<PaymentCombo>buyableItem).shop_items.length;
      return {
        id,
        title: buyableItem.name,
        subtitle: `${t(
          'objectCard.subtitle.paymentCombo',
        )} - ${numberOfProducts} ${t('objectCard.subtitle.product', {
          count: numberOfProducts,
        })}`,
        price: Number((<PaymentCombo>buyableItem).price),
        color: itemColor,
        sectionId: sectionId ?? '',
      };
    }
    case QuicksaleBasketItem.ShopItemIdentifier:
      return {
        id,
        title: buyableItem.name,
        subtitle: t('objectCard.subtitle.shopProduct'),
        price: Number((<ShopItem>buyableItem).price),
        color: itemColor,
        sectionId: sectionId ?? '',
      };
    case QuicksaleBasketItem.SubscriptionIdentifier:
      return {
        id,
        title: buyableItem.name,
        subtitle: t('objectCard.subtitle.subscription'),
        price: Number((<Contract>buyableItem).recurrent_price),
        recurrence: t(
          `objectCard.recurrence.${(<Contract>buyableItem).interval}`,
          {
            count: (<Contract>buyableItem).recurrence_basis,
          },
        ),
        color: itemColor,
        sectionId: sectionId ?? '',
      };
    default:
      return {
        id,
        title: buyableItem.name,
        subtitle: t('objectCard.subtitle.giftcard'),
        price: Number((<Giftcard>buyableItem).price),
        color: itemColor,
        sectionId: sectionId ?? '',
      };
  }
};
