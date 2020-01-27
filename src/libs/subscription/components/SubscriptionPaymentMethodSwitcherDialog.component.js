// @flow
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import { Elements, StripeProvider } from 'react-stripe-elements';

import SubscriptionPayment from './SubscriptionPayment.component';
import Config from '../../../config';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  open: boolean,
  onSubmit: (token: string) => void,
  onCancel: () => void,
  enabledPaymentMethods: Array<number>,
  processing: boolean,
};

export const SubscriptionPaymentMethodSwitcherDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <StripeProvider apiKey={STRIPE_KEY}>
        <Elements>
          <SubscriptionPayment
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            enabledPaymentMethods={props.enabledPaymentMethods}
            processing={props.processing}
          />
        </Elements>
      </StripeProvider>
    </Dialog>
  );
};

export default compose(
  withState('processing', 'setProcessing', false),
  withHandlers({
    onSubmit: ({ onSubmit, setProcessing }) => (source: string) => {
      setProcessing(true);
      onSubmit(source, {
        onSuccess: () => setProcessing(false),
        onError: () => setProcessing(false),
      });
    },
  }),
)(SubscriptionPaymentMethodSwitcherDialog);
