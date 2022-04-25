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
