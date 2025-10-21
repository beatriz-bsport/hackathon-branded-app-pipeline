import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_GIFTCARD,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_CREDIT,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items.js';

import type { Basket, CheckoutItem } from '#src/libs/checkout/types';
import { PRODUCT_TYPES } from '#src/events/constants';
import { trackAddToCart } from './trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

export const itemTypeList = {
  [BUYABLE_ITEM_PASS.toString()]: PRODUCT_TYPES.pass,
  [BUYABLE_ITEM_SHOP_ITEM.toString()]: PRODUCT_TYPES.shopItem,
  [BUYABLE_ITEM_PRIVATE_PASS.toString()]: PRODUCT_TYPES.privatePass,
  [BUYABLE_ITEM_COMBO_ITEM.toString()]: PRODUCT_TYPES.pack,
  [BUYABLE_ITEM_GIFTCARD.toString()]: PRODUCT_TYPES.giftCard,
  [BUYABLE_ITEM_COUPON.toString()]: PRODUCT_TYPES.coupon,
  [BUYABLE_ITEM_CREDIT.toString()]: PRODUCT_TYPES.credit,
  [BUYABLE_ITEM_FEE.toString()]: PRODUCT_TYPES.fee,
};

export const getCheckoutItemType = (item: CheckoutItem) => {
  const itemType = itemTypeList[item.buyable_item_identifier];
  if (!itemType) {
    console.warn(
      `[Mixpanel] Unknown buyable_item_identifier: ${item.buyable_item_identifier}`,
    );
  }
  return itemType;
};

export const trackAddToCartEvent = ({
  basket,
  buyableItemId,
}: {
  basket: Basket;
  buyableItemId: number;
}) => {
  if (!basket || buyableItemId === undefined) {
    console.warn(
      '[Mixpanel] (add_to_cart) Missing basket or checkoutItem, skipping tracking',
    );
    return;
  }
  const addedItem = basket.checkout_items.find(
    (item) => item.buyable_item_id === buyableItemId,
  );
  if (!addedItem) {
    console.warn(
      '[Mixpanel] (add_to_cart) Item not found in basket, skipping tracking',
    );
    return;
  }
  const productType = getCheckoutItemType(addedItem);
  if (!productType) {
    console.warn(
      '[Mixpanel] (add_to_cart) Unknown product type, skipping tracking',
    );
    return;
  }

  analyticsClientB2C.track(
    trackAddToCart({
      product_type: productType,
      product_name: addedItem.name,
      cart_value: Number(basket.total_price) || 0,
      product_price: Number(addedItem.unit_price) || 0,
    }),
  );
};
