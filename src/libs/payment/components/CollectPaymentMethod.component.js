// @flow
import React from 'react';

import CollectPaymentMethodCard from './payment-backend-stripe/CollectPaymentMethodCard.component';
import CollectPaymentMethodSepa from './payment-backend-stripe/CollectPaymentMethodSepa.component';

export const CollectPaymentMethod = (props: Props) => {
  if (props.paymentMethodType === 'card') {
    return (
      <CollectPaymentMethodCard
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={props.refreshSavedPaymentMethodList}
        onClose={props.onClose}
      />
    );
  }

  if (props.paymentMethodType === 'sepa_debit') {
    return (
      <CollectPaymentMethodSepa
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={props.refreshSavedPaymentMethodList}
        onClose={props.onClose}
      />
    );
  }
  return null;
};

export default CollectPaymentMethod;
