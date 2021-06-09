// @flow
import React from 'react';

import CollectPaymentMethodCard from './payment-backend-stripe-deprecated/CollectPaymentMethodCard.component';
import CollectPaymentMethodSepa from './payment-backend-stripe-deprecated/CollectPaymentMethodSepa.component';

export const CollectPaymentMethod = (props: Props) => {
  if (props.paymentMethodType === 'card') {
    return (
      <CollectPaymentMethodCard
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={() => {
          props.refreshSavedPaymentMethodList();
          if (props.onSuccess) {
            props.onSuccess();
          }
        }}
        onClose={props.onClose}
      />
    );
  }

  if (props.paymentMethodType === 'sepa_debit') {
    return (
      <CollectPaymentMethodSepa
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={() => {
          props.refreshSavedPaymentMethodList();
          if (props.onSuccess) {
            props.onSuccess();
          }
        }}
        onClose={props.onClose}
        defaultName={props.defaultName}
        defaultEmail={props.defaultEmail}
      />
    );
  }
  return null;
};

export default CollectPaymentMethod;
