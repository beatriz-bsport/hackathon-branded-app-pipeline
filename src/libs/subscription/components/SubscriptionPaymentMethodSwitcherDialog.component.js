// @flow
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import SubscriptionPayment from './SubscriptionPayment.component';

type Props = {
  open: boolean,
  onSubmit: (token: string) => void,
  onCancel: () => void,
  enabledPaymentMethods: Array<number>,
  processing: boolean,
  loading: boolean,
  member: Member,

  requestSetupIntentSecret: () => void,
  refreshSavedPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
};

export class SubscriptionPaymentMethodSwitcherDialog extends React.Component<Props> {
  componentDidMount() {
    this.props.refreshSavedPaymentMethodList();
  }

  render() {
    if (this.props.loading) {
      return (
        <Dialog open={this.props.open}>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <Dialog open={this.props.open}>
        <DialogContent>
          <SubscriptionPayment
            onSubmit={this.props.onSubmit}
            onCancel={this.props.onCancel}
            enabledPaymentMethods={this.props.enabledPaymentMethods}
            refreshSavedPaymentMethodList={
              this.props.refreshSavedPaymentMethodList
            }
            member={this.props.member}
            processing={this.props.processing}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default compose(
  withState('processing', 'setProcessing', false),
  withHandlers({
    onSubmit: ({ onSubmit, setProcessing }) => (
      source: string,
      payment_method_id,
    ) => {
      setProcessing(true);
      onSubmit(
        source,
        {
          onSuccess: () => setProcessing(false),
          onError: () => setProcessing(false),
        },
        payment_method_id,
      );
    },
  }),
)(SubscriptionPaymentMethodSwitcherDialog);
