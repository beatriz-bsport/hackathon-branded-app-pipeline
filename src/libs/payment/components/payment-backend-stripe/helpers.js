import React from 'react';

import {
  CardElement,
  IbanElement,
  IdealBankElement,
} from 'react-stripe-elements';

export const AVAILABLE_PAYMENT_METHOD_TYPE = {
  card: {
    element: <CardElement />,
    type: 'card',
    method: 'confirmCardSetup',
  },
  sepa_debit: {
    element: <IbanElement />,
    type: 'iban',
    method: 'confirmSepaDebitSetup',
  },
  ideal: {
    element: <IdealBankElement />,
    type: 'idealBank',
    method: 'confirmIdealSetup',
  },
};
