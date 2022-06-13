import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
} from '@bsport/common/lib/master-data/payment-group';

export const fromPaymentGroupIdentifierToPaymentMethodIdentifier = (
  paymentGroupIdentifier: number,
) => {
  switch (paymentGroupIdentifier) {
    case PAYMENT_GROUP_METHOD_IDENTIFIER_CB:
      return 'card';
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA:
      return 'sepa_debit';
    case PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY:
      return 'debt';
    default:
      return '';
  }
};

// This const is used to identify stripe terminal as a payment method in different dialogs
// The value 99 isn't sent to the backend, we replace this value with the appropriate one (CB)
// before calling the api
export const PAYMENT_STRIPE_TERMINAL_FAKE = 99;
