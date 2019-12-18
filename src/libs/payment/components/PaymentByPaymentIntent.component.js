// @flow

import React, { Component } from 'react';
import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { CB as PAYMENT_METHOD_STRIPE_PAYMENT_INTENT } from '@bsport/common/lib/master-data/payment-methods';
import Config from '../../../config';

import StripeErrorCode from './StripeErrorCode.component';
import AcceptTermsAndConditions from './AcceptTermsAndConditions.component';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  submitPaymentIntent: (*) => Promise<any>,
  stripe: Object,
  t: TFunction,
  classes: Object,
  loading: boolean,
  termsAndConditions: string,
  onCancel: () => void,
  customPayStyle: any,
  customContainerStyle: any,
  hideCancelButton?: boolean,
};

type State = {
  processing: boolean,
  stripe_error_code: ?string,
};

export class PaymentIntentGathering extends Component<Props, State> {
  state = {
    cardReady: false,
    processing: false,
    stripe_error_code: null,
  };

  handleServerResponse = (response) => {
    const { data } = response;
    if (data && !data.requires_action) {
      // no further action is needed
      this.setState({ processing: false });
    } else {
      // need to validate the card authentication
      this.props.stripe
        .handleCardAction(data.payment_intent_client_secret)
        .then((result) => {
          if (result.error) {
            // Show authentication error in payment form
            if (result.error.code === 'payment_intent_authentication_failure') {
              this.setState({ stripe_error_code: result.error.code });
            }
            console.error(result.error);
            this.setState({ processing: false });
          } else {
            // Resubmit the PaymentIntent to the server
            this.props.submitPaymentIntent(
              {
                payment_method: PAYMENT_METHOD_STRIPE_PAYMENT_INTENT.id,
                payment_data: {
                  payment_intent_id: result.paymentIntent.id,
                },
              },
              {
                onSuccess: (res) => this.handleServerResponse(res),
                onError: (err) => {
                  this.setState({
                    processing: false,
                    stripe_error_code: err.response.data.error_code,
                  });
                },
              },
            );
          }
        })
        .catch((err) => {
          console.error(err);
          this.setState({ processing: false, stripe_error_code: 'unknown' });
        });
    }
  };

  handleSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.setState({
      processing: true,
      stripe_error_code: null,
      stripe_decline_code: null,
    });

    this.props.stripe.createPaymentMethod('card').then(({ paymentMethod }) => {
      // create a paymentMethod and submit it to the server, it will return a PaymentIntent
      // if the paymentMethod needs an authentication
      if (!paymentMethod) {
        this.setState({
          stripe_error_code: 'invalid_number',
          processing: false,
        });
      } else {
        this.props.submitPaymentIntent(
          {
            payment_method: PAYMENT_METHOD_STRIPE_PAYMENT_INTENT.id,
            payment_data: {
              payment_method_id: paymentMethod.id,
            },
          },
          {
            onSuccess: (res) => this.handleServerResponse(res),
            onError: (err) => {
              this.setState({
                processing: false,
                stripe_error_code: err.response.data.code,
                stripe_decline_code: err.response.data.decline_code,
              });
            },
          },
        );
      }
    });
  };

  renderProcessing = () => {
    return (
      <div
        style={this.state.processing ? {} : { display: 'none' }}
        className={this.props.classes.processingContainer}
      >
        <CircularProgress />
        <Typography
          variant="caption"
          className={this.props.classes.processingMessage}
        >
          {this.props.t('checkout:paymentIntent.isProcessing')}
        </Typography>
      </div>
    );
  };

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        style={this.props.customContainerStyle}
        className={
          this.props.customContainerStyle ? null : this.props.classes.container
        }
      >
        {this.props.loading || this.state.processing
          ? this.renderProcessing()
          : null}
        <div
          style={
            this.state.processing || this.props.loading
              ? { display: 'none' }
              : {}
          }
          className={this.props.classes.cardElementContainer}
        >
          <CardElement
            onReady={() => this.setState({ cardReady: true })}
            hidePostalCode
            style={{ base: { fontSize: '18px' } }}
          />
        </div>
        {this.state.stripe_error_code || this.state.stripe_decline_code ? (
          <StripeErrorCode
            errorCode={this.state.stripe_error_code}
            declineCode={this.state.stripe_decline_code}
          />
        ) : null}
        {this.props.termsAndConditions ? (
          <AcceptTermsAndConditions
            accepted={this.state.termsAccepted}
            onChecked={(termsAccepted) => this.setState({ termsAccepted })}
            termsAndConditions={this.props.termsAndConditions}
          />
        ) : null}
        <div className={this.props.classes.buttonContainer}>
          {!this.props.hideCancelButton && (
            <Button onClick={this.props.onCancel}>
              {this.props.t('payment:forms.cancelPayment')}
            </Button>
          )}
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={
              !this.state.cardReady ||
              this.props.loading ||
              this.state.processing ||
              (this.props.termsAndConditions && !this.state.termsAccepted)
            }
            style={this.props.customPayStyle || {}}
            className={
              this.props.customPayStyle ? null : this.props.classes.payButton
            }
          >
            {this.props.t('payment:forms.paymentIntent.pay')}
          </Button>
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
  },
  processingContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
  },
  processingMessage: {
    marginTop: theme.spacing.unit * 2,
  },
  cardElementContainer: {
    border: '2px solid #efefef',
    borderRadius: theme.spacing.unit,
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  payButton: {
    marginTop: theme.spacing.unit * 2,
  },
});

export const PaymentIntentGatheringComposed = compose(
  injectStripe,
  withStyles(styles),
  withNamespaces(['checkout', 'stripe']),
)(PaymentIntentGathering);

export default (props: Props) => (
  <StripeProvider apiKey={STRIPE_KEY}>
    <Elements>
      <PaymentIntentGatheringComposed {...props} />
    </Elements>
  </StripeProvider>
);
