import { PrivatePass } from '#src/libs/private-service/types';
import { ShopItem } from '#src/libs/shop/types';
import { ErrorAndLoading } from '#src/libs/types';
import { PaymentPack } from '../payment-packs/types';

export type PaymentComboItem = {
  id: number;
  price: number;
  name: string;
  quantity: number;
  tax: string;
  data: PaymentPack | ShopItem | PrivatePass;
};

export type PaymentCombo = {
  id: number;
  name: string;
  description: string;
  price: number;
  use_payment_combo_tax_on_items: boolean;
  tax: number;
  tax_calculation: number;
  company: number;
  available: boolean;
  manager_only: boolean;
  date_created: string;
  payment_packs: PaymentComboItem[];
  shop_items: PaymentComboItem[];
  private_passes: PaymentComboItem[];
  max_purchase_per_member: number | null;
  tags_on_consumer_item_creation?: Array<number>;
  barcode: string;
  available_payment_method_identifier: number[];
  new_member_only: boolean;
  is_usable_by_staff: boolean;
  highlighted_as_recommended: boolean;
  bookkeeping_account?: number;
};

export type PaymentComboPayload = {
  id?: number;
  name: string;
  description: string;
  manager_only: boolean;
  price: number;
  tax: number;
  company: number;
  available: boolean;
  date_created: string;
  payment_pack_ids: number[];
  shop_item_ids: number[];
  private_pass_ids: number[];
  is_usable_by_staff: boolean;
};

export type PaymentComboState = {
  allIds: number[];
  byId: { [id: number]: PaymentCombo };
  createOrUpdate: {
    error?: Error;
    loading: boolean;
  } & ErrorAndLoading;
  purchase: {
    items: PaymentComboPurchase[];
    count: number;
  } & ErrorAndLoading;
  forBooking: {
    allIds: number[];
  } & ErrorAndLoading;
  relatedPrivatePass: {
    allIds: number[];
    byId: { [id: number]: PrivatePass };
  } & ErrorAndLoading;
  forContracts: {
    allIds: number[];
  } & ErrorAndLoading;
} & ErrorAndLoading;

export type PaymentComboPurchase<PC = number> = {
  id: number;
  consumer_payment_packs: number[];
  date: string;
  member: {
    accept_email: boolean;
    archived: boolean;
    consumer: number;
    credit_account_balance: number;
    date_joined: string;
    email: string;
    id: number;
    name: string;
    phone: string;
    photo: string;
    tags: number[];
  };
  payment_combo: PC;
  price: string;
  private_consumer_passes: number[];
  provision_updates: number[];
  tax: string;
};

export type FetchPaymentComboListParams = {
  manager_only?: boolean;
  available?: boolean;
  company?: number;
  offer?: number;
  as_consumer?: boolean;
  video?: number;
  id__in?: number[];
  include_expired?: boolean;
  ignore_new_member_only?: boolean; // When making a request from an authenticated member, bypasses filter on "new_member_only" field
};

export type FetchPaymentComboPurchaseListParams = {
  page: number;
  payment_combo?: number;
};

export type PaymentComboFactoryOptions = {
  isHighlightedAsRecommended?: boolean;
};

export type PaymentComboAPIParams = {
  id__in?: number[];
  id__not_in?: number[];
  offer?: number;
  as_consumer_of_company?: number;
  video?: number;
  include_expired?: boolean;
  available?: boolean;
  company?: number;
  manager_only?: boolean;
};
