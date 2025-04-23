export type Giftcard = {
  amount_gifted: string;
  available_payment_method_identifiers: Array<number>;
  bookkeeping_account: number | null;
  company: number;
  cover: string;
  description: string;
  disabled: boolean;
  expiration_days: number | null;
  id: number;
  is_shared_giftcard: boolean;
  manager_only: boolean;
  name: string;
  price: string;
  tags_on_consumer_item_creation: Array<string>;
};

export type GiftcardImage = {
  id: number;
  image: string; // src url
};
