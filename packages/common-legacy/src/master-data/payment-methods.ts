type PaymentMethodType = {
  id: number;
  text: string;
  is_method_editable: boolean;
};
export const CB: PaymentMethodType = {
  id: 0,
  text: 'CB',
  is_method_editable: false,
};

export const CASH: PaymentMethodType = {
  id: 1,
  text: 'CASH',
  is_method_editable: true,
};
export const CHECK: PaymentMethodType = {
  id: 2,
  text: 'CHECK',
  is_method_editable: true,
};
export const PAYMENT_PACK: PaymentMethodType = {
  id: 3,
  text: 'PAYMENT_PACK',
  is_method_editable: false,
};
export const CB_MANUAL: PaymentMethodType = {
  id: 4,
  text: 'CB_MANUAL',
  is_method_editable: true,
};
export const HOLIDAY_CHECK: PaymentMethodType = {
  id: 5,
  text: 'HOLIDAY_CHECK',
  is_method_editable: true,
};
export const AMEX: PaymentMethodType = {
  id: 6,
  text: 'AMEX',
  is_method_editable: true,
};
export const BANK_TRANSFER: PaymentMethodType = {
  id: 7,
  text: 'BANK_TRANSFER',
  is_method_editable: true,
};
export const EVENT_BRITE: PaymentMethodType = {
  id: 8,
  text: 'EVENT_BRITE',
  is_method_editable: true,
};
export const CREDIT_ACCOUNT: PaymentMethodType = {
  id: 9,
  text: 'CREDIT_ACCOUNT',
  is_method_editable: false,
};
export const SUBSCRIPTION_CB: PaymentMethodType = {
  id: 10,
  text: 'SUBSCRIPTION_CB',
  is_method_editable: false,
};
export const SEPA: PaymentMethodType = {
  id: 13,
  text: 'SEPA',
  is_method_editable: false,
};
export const OTHER: PaymentMethodType = {
  id: 11,
  text: 'OTHER',
  is_method_editable: true,
};
export const DISPUTE: PaymentMethodType = {
  id: 12,
  text: 'DISPUTE',
  is_method_editable: false,
};
export const BANCONTACT: PaymentMethodType = {
  id: 20,
  text: 'Bancontact',
  is_method_editable: false,
};
export const SOFORT: PaymentMethodType = {
  id: 30,
  text: 'Sofort',
  is_method_editable: false,
};
export const IDEAL: PaymentMethodType = {
  id: 40,
  text: 'iDEAL',
  is_method_editable: false,
};
export const EPS: PaymentMethodType = {
  id: 50,
  text: 'EPS',
  is_method_editable: false,
};
export const GIROPAY: PaymentMethodType = {
  id: 60,
  text: 'Giropay',
  is_method_editable: false,
};
export const BACS_DEBIT: PaymentMethodType = {
  id: 70,
  text: 'Bacs Direct Debit',
  is_method_editable: false,
};
export const PAYPAL_WALLET: PaymentMethodType = {
  id: 80,
  text: 'Paypal Wallet',
  is_method_editable: false,
};
export const TWINT: PaymentMethodType = {
  id: 90,
  text: 'Twint',
  is_method_editable: false,
};
export const APPLE_PAY: PaymentMethodType = {
  id: 100,
  text: 'Apple Pay',
  is_method_editable: false,
};
export const GOOGLE_PAY: PaymentMethodType = {
  id: 110,
  text: 'Google Pay',
  is_method_editable: false,
};

const PAYMENT_METHODS: Array<PaymentMethodType> = [
  CB,
  CASH,
  CHECK,
  CB_MANUAL,
  HOLIDAY_CHECK,
  AMEX,
  BANK_TRANSFER,
  EVENT_BRITE,
  CREDIT_ACCOUNT,
  SUBSCRIPTION_CB,
  OTHER,
  DISPUTE,
  SEPA,
  BANCONTACT,
  IDEAL,
  SOFORT,
  EPS,
  GIROPAY,
  BACS_DEBIT,
  PAYPAL_WALLET,
  TWINT,
  APPLE_PAY,
  GOOGLE_PAY,
];

export default PAYMENT_METHODS;
