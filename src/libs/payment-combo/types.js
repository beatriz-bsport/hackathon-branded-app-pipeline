// @flow

export type PaymentComboItem = {
  id: number,
  price: number,
  name: string,
};

export type PaymentCombo = {
  id: number,
  name: string,
  description: string,
  price: number,
  tax: number,
  company: number,
  available: boolean,
  manager_only: boolean,
  date_created: string,
  payment_packs: Array<PaymentComboItem>,
  shop_items: Array<PaymentComboItem>,
  private_passes: Array<PaymentComboItem>,
};

export type PaymentComboPayload = {
  id?: number,
  name: string,
  description: string,
  manager_only: boolean,
  price: number,
  tax: number,
  company: number,
  available: boolean,
  date_created: string,
  payment_pack_ids: Array<number>,
  shop_item_ids: Array<number>,
  private_pass_ids: Array<number>,
};

export type PaymentComboState = {
  loading: boolean,
  error: ?Error,
  allIds: Array<number>,
  byId: { [id: number]: PaymentCombo },
  createOrUpdate: {
    error: ?Error,
    loading: boolean,
  },
};
