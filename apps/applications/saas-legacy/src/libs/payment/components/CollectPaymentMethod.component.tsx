import React, { memo } from 'react';

import { AxiosResponse } from 'axios';
import { SetupIntentResult } from '@stripe/stripe-js';
import type { StripeReader } from '#src/libs/terminal/types';
import type { StripeInit } from '#src/libs/payment/types';
import CollectPaymentMethodBacsDebit from './payment-backend-stripe-deprecated/CollectPaymentMethodBacsDebit.component';
// @ts-expect-error
import CollectPaymentMethodCard from './payment-backend-stripe-deprecated/CollectPaymentMethodCard.component';
// @ts-expect-error
import CollectPaymentMethodSepa from './payment-backend-stripe-deprecated/CollectPaymentMethodSepa.component';

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
  companyId?: number;
  cardBillingDetailsMandatory: boolean;
  stripePromise?: StripeInit;
  disableLink?: boolean;
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
        addViaTerminal={!!props.addViaTerminal}
        cardBillingDetailsMandatory={props.cardBillingDetailsMandatory}
        companyId={props.companyId}
        content={props.content}
        defaultEmail={props.defaultEmail}
        defaultName={props.defaultName}
        disableLink={props.disableLink}
        fullScreen={props.fullScreen}
        labelClose={props.labelClose}
        onClose={props.onClose}
        onSuccess={onSuccessCard}
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        stripePromise={props.stripePromise}
        stripeReaders={props.stripeReaders}
        variant={props.variant}
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
        stripePromise={props.stripePromise}
        userDefaultEmail={props.defaultEmail}
        userDefaultName={props.defaultName}
        variant={props.variant}
      />
    );
  }

  if (props.paymentMethodType === 'sepa_debit') {
    return (
      <CollectPaymentMethodSepa
        content={props.content}
        defaultEmail={props.defaultEmail}
        defaultName={props.defaultName}
        fullScreen={props.fullScreen}
        labelClose={props.labelClose}
        onClose={props.onClose}
        onSuccess={onSuccessDebit}
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        stripePromise={props.stripePromise}
        variant={props.variant}
      />
    );
  }
  return null;
};

export default memo(CollectPaymentMethod);
