// @flow
import React from 'react';

import CollectPaymentMethodCard from './payment-backend-stripe-deprecated/CollectPaymentMethodCard.component';
import CollectPaymentMethodSepa from './payment-backend-stripe-deprecated/CollectPaymentMethodSepa.component';

type Props = {
  refreshSavedPaymentMethodList?: () => void;
  onSuccess?: () => void;
  requestSetupIntentSecret?: () => void;
  paymentMethodType?: string;
  variant?: 'div' | 'modal';
  onClose?: () => void;
  defaultName: string;
  defaultEmail: string;
  content?: string;
};

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
        variant={props.variant}
        content={props.content}
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
        variant={props.variant}
        content={props.content}
      />
    );
  }
  return null;
};

export default CollectPaymentMethod;
