export type BuyableModel = {
  id: number;
  modelName: string;
};

export const SHOP_ITEM: BuyableModel = {
  id: 86,
  modelName: 'ShopItem',
};
export const BOOKING: BuyableModel = {
  id: 24,
  modelName: 'Booking',
};
export const CONSUMER_PAYMENT_PACK: BuyableModel = {
  id: 58,
  modelName: 'ConsumerPaymentPack',
};

const CONTENT_TYPES = [SHOP_ITEM, CONSUMER_PAYMENT_PACK, BOOKING];

export default CONTENT_TYPES;
