import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';

export const fromPaymentGroupIdentifierToPaymentMethodIdentifier = (
  paymentGroupIdentifier: number,
) => {
  switch (paymentGroupIdentifier) {
    case PAYMENT_GROUP_METHOD_IDENTIFIER_CB:
      return 'card';
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA:
      return 'sepa_debit';
    default:
      return '';
  }
};
