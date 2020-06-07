// @flow
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
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
  loading: boolean,
  member: Member,
};

export const SubscriptionPaymentMethodSwitcherDialog = (props: Props) => {
  if (props.loading) {
    return (
      <Dialog open={props.open}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={props.open}>
      <DialogContent>
        <StripeProvider apiKey={STRIPE_KEY}>
          <Elements>
            <SubscriptionPayment
              onSubmit={props.onSubmit}
              onCancel={props.onCancel}
              enabledPaymentMethods={props.enabledPaymentMethods}
              member={props.member}
              processing={props.processing}
            />
          </Elements>
        </StripeProvider>
      </DialogContent>
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
