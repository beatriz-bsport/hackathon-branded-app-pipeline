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
  labelClose?: string;
  companyId: number;
};

export const CollectPaymentMethod = (props: Props) => {
  if (props.paymentMethodType === 'card') {
    return (
      <CollectPaymentMethodCard
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={(data: any) => {
          if (props.refreshSavedPaymentMethodList) {
            props.refreshSavedPaymentMethodList();
          }
          if (props.onSuccess) {
            props.onSuccess(data);
          }
          // If stripe terminal, display success screen for 2 sec
          if (props.addViaTerminal) setTimeout(() => props.onClose(), 2000);
        }}
        onClose={props.onClose}
        variant={props.variant}
        content={props.content}
        stripeReaders={props.stripeReaders}
        addViaTerminal={!!props.addViaTerminal}
        labelClose={props.labelClose}
        companyId={props.companyId}
      />
    );
  }

  if (props.paymentMethodType === 'sepa_debit') {
    return (
      <CollectPaymentMethodSepa
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={(data: any) => {
          if (props.refreshSavedPaymentMethodList) {
            props.refreshSavedPaymentMethodList();
          }
          if (props.onSuccess) {
            props.onSuccess(data);
          }
        }}
        onClose={props.onClose}
        defaultName={props.defaultName}
        defaultEmail={props.defaultEmail}
        variant={props.variant}
        content={props.content}
        labelClose={props.labelClose}
      />
    );
  }
  return null;
};

export default CollectPaymentMethod;
