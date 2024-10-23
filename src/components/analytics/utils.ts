import { STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE } from '#src/libs/theme/constants';
import { getItemInStorage } from '#src/utils/storage';
import type { CartItem } from './types';

import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_GIFTCARD,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';

export const itemTypeList = {
  [BUYABLE_ITEM_PASS.toString()]: 'pass',
  [BUYABLE_ITEM_SHOP_ITEM.toString()]: 'webshop_item',
  [BUYABLE_ITEM_PRIVATE_PASS.toString()]: 'appointment_pass',
  [BUYABLE_ITEM_FEE.toString()]: 'delivery_fee',
  [BUYABLE_ITEM_COMBO_ITEM.toString()]: 'pack',
  [BUYABLE_ITEM_GIFTCARD.toString()]: 'gift_card',
  [BUYABLE_ITEM_COUPON.toString()]: 'discount',
};

export const getCurrencyCode = () => {
  return (
    getItemInStorage('local', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE) || 'EUR'
  ).toUpperCase();
};

export const getItemPrice = (item: CartItem) => {
  if ('unit_price' in item) return item.unit_price;
  if ('price' in item)
    return typeof item.price === 'number' ? item.price : parseFloat(item.price);
  return 0;
};

export const getItemId = (item: CartItem) => {
  if ('id' in item) return item.id;
  if ('buyable_item_id' in item)
    return item['buyable_item_id'];
  return 0;
};


const isCheckoutItem = (item: CartItem) => {
  return 'buyable_item_identifier' in item;
};

const isPrivatePass = (item: CartItem) => {
  return 'private_services' in item;
};

const isPack = (item: CartItem) => {
  return 'payment_packs' in item && 'shop_items' in item;
};

const isPass = (item: CartItem) => {
  return 'linked_private_pass' in item;
};

const isShopItem = (item: CartItem) => {
  return 'is_standalone_item' in item;
};

export const getItemType = (item: CartItem) => {
  console.log('item to check : ', item);
  if (isCheckoutItem(item)) return itemTypeList[item.buyable_item_identifier];
  if (isPrivatePass(item)) return 'appointment_pass';
  if (isPack(item)) return 'pack';
  if (isPass(item)) return 'pass';
  if (isShopItem(item)) return 'shop_item';
  return 'none';
};
