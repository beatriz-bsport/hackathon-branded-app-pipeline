import { ShopItem } from '@bsport/common/lib/master-data/available-payment.type';
import { Giftcard } from '#libs/giftcard/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';

export type InstalmentPayment = {
  id?: number;
  company?: number;
  name: string;
  recurrency: 1 | 2 | 3 | 4;
  frequency: number;
  number_of_billing: number;
  fee: number;
  minimum_amount: number;
  is_only_available_when_all_items_are_compatible: boolean;
  payment_pack_list: Array<PaymentPack>;
  is_available_on_all_payment_pack: boolean;
  private_pass_list: Array<PrivatePass>;
  is_available_on_all_private_pass: boolean;
  payment_combo_list: Array<PaymentCombo>;
  is_available_on_all_payment_combo: boolean;
  giftcard_list: Array<Giftcard>;
  is_available_on_all_giftcard: boolean;
  shop_item_list: Array<ShopItem>;
  is_available_on_all_shop_item: boolean;
};

export type InstalmentPaymentApi = {
  id: number;
  company: number;
  name: string;
  recurrency: 1 | 2 | 3 | 4;
  frequency: number;
  number_of_billing: number;
  fee: number;
  minimum_amount: number;
  is_only_available_when_all_items_are_compatible: boolean;
  payment_pack_list: Array<number>;
  is_available_on_all_payment_pack: boolean;
  private_pass_list: Array<number>;
  is_available_on_all_private_pass: boolean;
  payment_combo_list: Array<number>;
  is_available_on_all_payment_combo: boolean;
  giftcard_list: Array<number>;
  is_available_on_all_giftcard: boolean;
  shop_item_list: Array<number>;
  is_available_on_all_shop_item: boolean;
  is_disabled: boolean;
};

export type InstalmentPaymentState = {
  allIds: Array<number>;
  byId: {
    [id: number]: InstalmentPaymentApi;
  };
  byBasket: {
    basketId: string;
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
  };
  loading: boolean;
  error: string;
  createOrUpdate: {
    loading: boolean;
    error: string | null;
  };
  disabled: {
    loading: boolean;
    error: string | null;
  };
};
