// @ts-nocheck
// @flow
import React from 'react';

import { AxiosResponse } from 'axios';
import { SetupIntentResult } from '@stripe/stripe-js';
import CollectPaymentMethodBacsDebit from './payment-backend-stripe-deprecated/CollectPaymentMethodBacsDebit.component';
import CollectPaymentMethodCard from './payment-backend-stripe-deprecated/CollectPaymentMethodCard.component';
import CollectPaymentMethodSepa from './payment-backend-stripe-deprecated/CollectPaymentMethodSepa.component';
import type { StripeReader } from '#libs/terminal/types';

type Props = {
  refreshSavedPaymentMethodList?: () => void;
  onSuccess?: (stripeSetupIntentCallResult: SetupIntentResult) => void;
  requestSetupIntentSecret?: () => Promise<AxiosResponse<any>>;
  paymentMethodType?: string;
  variant?: 'div' | 'modal';
  onClose?: () => void;
  defaultName: string;
  defaultEmail: string;
  content?: string;
  stripeReaders?: StripeReader[];
  addViaTerminal?: boolean;
  labelClose?: string;
  fullScreen?: boolean;
};

export const CollectPaymentMethod = (props: Props) => {
  const onSuccessCard = (stripeSetupIntentCallResult: SetupIntentResult) => {
    if (props.refreshSavedPaymentMethodList) {
      props.refreshSavedPaymentMethodList();
    }
    if (props.onSuccess) {
      props.onSuccess(stripeSetupIntentCallResult);
    }
    // If stripe terminal, display success screen for 2 sec
    if (props.addViaTerminal) setTimeout(() => props.onClose(), 2000);
  };

  const onSuccessDebit = (stripeSetupIntentCallResult: SetupIntentResult) => {
    if (props.refreshSavedPaymentMethodList) {
      props.refreshSavedPaymentMethodList();
    }
    if (props.onSuccess) {
      props.onSuccess(stripeSetupIntentCallResult);
    }
  };

  if (props.paymentMethodType === 'card') {
    return (
      <CollectPaymentMethodCard
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={onSuccessCard}
        onClose={props.onClose}
        variant={props.variant}
        content={props.content}
        stripeReaders={props.stripeReaders}
        addViaTerminal={!!props.addViaTerminal}
        labelClose={props.labelClose}
        fullScreen={props.fullScreen}
      />
    );
  }

  if (props.paymentMethodType === 'bacs_debit') {
    return (
      <CollectPaymentMethodBacsDebit
        content={props.content}
        fullScreen={props.fullScreen}
        labelClose={props.labelClose}
        onClose={props.onClose}
        onSuccess={onSuccessDebit}
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        userDefaultEmail={props.defaultEmail}
        userDefaultName={props.defaultName}
        variant={props.variant}
      />
    );
  }

  if (props.paymentMethodType === 'sepa_debit') {
    return (
      <CollectPaymentMethodSepa
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        onSuccess={onSuccessDebit}
        onClose={props.onClose}
        defaultName={props.defaultName}
        defaultEmail={props.defaultEmail}
        variant={props.variant}
        content={props.content}
        labelClose={props.labelClose}
        fullScreen={props.fullScreen}
      />
    );
  }
  return null;
};

export default CollectPaymentMethod;
