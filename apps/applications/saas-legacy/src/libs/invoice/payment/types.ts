export type PaymentItemData = {
  price: number;
  payment_method: number;
  payment_note?: string;
  payment_received: boolean;
  stripe_charge_id?: string;
};

export type PaymentItem = {
  uuid: string;
  price: string;
  payment_method: number;
  payment_received: boolean | null;
  payment_note: string;
  invoice: string | null;
  stripe_charge_id: string | null;
  date: string;
  reverted: boolean;
  is_method_editable: boolean;
  payment_engine: PaymentEngine;
  is_v2: boolean;
  is_processing: boolean;
  returned_amount: string;
  is_returnable: boolean;
  transaction_fee: string;
  id: number;
  editable?: boolean;
};

export enum PaymentEngine {
  BSPORT = 0,
  STRIPE = 1,
}
