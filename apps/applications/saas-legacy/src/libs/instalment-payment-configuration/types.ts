import { ShopItem } from '@bsport/common/lib/master-data/available-payment.type';
import { Giftcard } from '#src/libs/giftcard/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { PrivatePass } from '#src/libs/private-service/types';
import {
  CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT,
  CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT,
} from '#src/libs/instalment-payment-configuration/constants';

export enum CustomFirstInstalmentType {
  AMOUNT = CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT,
  PERCENT = CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT,
}

export type InstalmentPayment = {
  id?: number;
  basketId?: string;
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
  custom_first_instalment_enabled: boolean;
  custom_first_instalment_type: CustomFirstInstalmentType;
  custom_first_instalment_percent: number;
  custom_first_instalment_amount: string;
  partial_payment_enabled: boolean;
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
  custom_first_instalment_enabled: boolean;
  custom_first_instalment_type: CustomFirstInstalmentType;
  custom_first_instalment_percent: number;
  custom_first_instalment_amount: number;
  partial_payment_enabled: boolean;
};

export type InstalmentPaymentApiWithBasketId = InstalmentPaymentApi & {
  basketId?: string;
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
