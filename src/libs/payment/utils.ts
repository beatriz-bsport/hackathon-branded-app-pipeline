import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
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

export const MATCHING_PAYMENT_GROUP_METHOD: { [key: string]: number } = {
  '0': 1,
  '1': 0,
  '2': 13,
  '3': 2,
  '4': 5,
  '5': 6,
  // PAYMENT_GROUP_METHOD_IDENTIFIER_DISPUTE: 12,
  '7': 7,
  '8': 11,
  '9': 20,
  '10': 40,
  '11': 30,
  // PAYMENT_GROUP_METHOD_IDENTIFIER_EPS: 50,
  // PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY: 60,
  '14': 9,
  '15': 4,
};

export const getPaymentEngineAvailableList = (
  availablePaymentMethodList: Array<number>,
) => {
  const theoricalEngineAvailable = Object.entries(
    PAYMENT_GROUP_METHOD_BY_ENGINE,
  )
    .map(([engine, all_pm]) =>
      all_pm.filter((pm) =>
        availablePaymentMethodList.includes(
          MATCHING_PAYMENT_GROUP_METHOD[`${pm}`],
        ),
      ).length
        ? engine
        : null,
    )
    .filter((k) => !!k);
  if (!theoricalEngineAvailable.length) {
    return [PAYMENT_ENGINE_STRIPE];
  }
  return theoricalEngineAvailable;
};
