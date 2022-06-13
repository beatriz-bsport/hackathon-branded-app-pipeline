// @flow
import React from 'react';

import CollectPaymentMethodCard from './payment-backend-stripe-deprecated/CollectPaymentMethodCard.component';
import CollectPaymentMethodSepa from './payment-backend-stripe-deprecated/CollectPaymentMethodSepa.component';
import type { StripeReader } from '#libs/terminal/types';

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
  stripeReaders?: StripeReader[];
  addViaTerminal?: boolean;
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
          // If stripe terminal, display success screen for 2 sec
          if (props.addViaTerminal) setTimeout(() => props.onClose(), 2000);
        }}
        onClose={props.onClose}
        variant={props.variant}
        content={props.content}
        stripeReaders={props.stripeReaders}
        addViaTerminal={!!props.addViaTerminal}
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
