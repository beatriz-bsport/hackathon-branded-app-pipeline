export type SubmitInternalPaymentRequest = {
  secret: string;
  payment_method_identifier: number;
  payment_note?: string;
  date: string;
  price_cts?: number;
};
