// @flow

import React, { Component } from 'react';
import {
  CardElement,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { CB as PAYMENT_METHOD_STRIPE_PAYMENT_INTENT } from '@bsport/common/lib/master-data/payment-methods';
import { loadStripe } from '@stripe/stripe-js';
import Config from '../../../../config';

import StripeErrorCode from './StripeErrorCode.component';
import AcceptTermsAndConditions from '../AcceptTermsAndConditions.component';
import PaymentMethodList from '../PaymentMethodList.component';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

const stripePromise = loadStripe(STRIPE_KEY);

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

  processing: boolean,
  savedPaymentMethodList: Array<PaymentMethod>,
  stripe: Stripe,
};

type State = {
  processing: boolean,
  stripe_error_code: ?string,
  savePaymentMethod: boolean,
  selectedSavedPaymentMethodId: ?string,
};

export class PaymentIntentGathering extends Component<Props, State> {
  state = {
    cardReady: false,
    processing: false,
    savePaymentMethod: false,
    stripe_error_code: null,
    selectedSavedPaymentMethodId: null,
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
                save_payment_method: this.state.savePaymentMethod,
                payment_data: {
                  payment_intent_id: result.paymentIntent.id,
                },
              },
              {
                onSuccess: (res) => this.handleServerResponse(res),
                onError: (err) => {
                  this.setState({
                    processing: false,
                    stripe_error_code:
                      (err.response &&
                        err.response.data &&
                        err.response.data.error_code) ||
                      null,
                    stripe_decline_code:
                      (err.response &&
                        err.response.data &&
                        err.response.data.decline_code) ||
                      null,
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
    const { selectedSavedPaymentMethodId } = this.state;

    if (!selectedSavedPaymentMethodId) {
      this.props.stripe
        .createPaymentMethod('card')
        .then(({ paymentMethod }) => {
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
                save_payment_method: this.state.savePaymentMethod,
                payment_method: PAYMENT_METHOD_STRIPE_PAYMENT_INTENT.id,
                payment_data: {
                  payment_method_id:
                    selectedSavedPaymentMethodId || paymentMethod.id,
                },
              },
              {
                onSuccess: (res) => this.handleServerResponse(res),
                onError: (err) => {
                  this.setState({
                    processing: false,
                    stripe_error_code:
                      (err.response &&
                        err.response.data &&
                        err.response.data.code) ||
                      null,
                    stripe_decline_code:
                      (err.response &&
                        err.response.data &&
                        err.response.data.decline_code) ||
                      null,
                  });
                },
              },
            );
          }
        });
    } else {
      this.props.submitPaymentIntent(
        {
          save_payment_method: this.state.savePaymentMethod,
          payment_method: PAYMENT_METHOD_STRIPE_PAYMENT_INTENT.id,
          payment_data: {
            payment_method_id: selectedSavedPaymentMethodId,
          },
        },
        {
          onSuccess: (res) => this.handleServerResponse(res),
          onError: (err) => {
            this.setState({
              processing: false,
              stripe_error_code:
                (err.response && err.response.data && err.response.data.code) ||
                null,
              stripe_decline_code:
                (err.response &&
                  err.response.data &&
                  err.response.data.decline_code) ||
                null,
            });
          },
        },
      );
    }
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
        {this.state.processing ? this.renderProcessing() : null}
        {!this.state.selectedSavedPaymentMethodId && (
          <React.Fragment>
            <div
              style={this.state.processing ? { display: 'none' } : {}}
              className={this.props.classes.cardElementContainer}
            >
              <CardElement
                onReady={() => this.setState({ cardReady: true })}
                options={{ style: { base: { fontSize: '18px' } } }}
              />
            </div>
            <div className={this.props.classes.savePaymentMethodCheckbox}>
              <Checkbox
                checked={this.state.savePaymentMethod}
                onChange={(ev) =>
                  this.setState({ savePaymentMethod: ev.target.checked })
                }
              />
              <Typography variant="caption">
                {this.props.t('payment:forms.savePaymentMethod.label')}
              </Typography>
            </div>
          </React.Fragment>
        )}
        {this.state.stripe_error_code || this.state.stripe_decline_code ? (
          <StripeErrorCode
            errorCode={this.state.stripe_error_code}
            declineCode={this.state.stripe_decline_code}
          />
        ) : null}
        <PaymentMethodList
          isExpandable
          savedPaymentMethodList={this.props.savedPaymentMethodList}
          paymentMethodType="card"
          selectedSavedPaymentMethodId={this.state.selectedSavedPaymentMethodId}
          onSelect={(selectedSavedPaymentMethodId) =>
            this.setState({
              selectedSavedPaymentMethodId,
            })
          }
          disabled={this.props.loading || this.props.processing}
        />
        {this.props.termsAndConditions ? (
          <AcceptTermsAndConditions
            accepted={this.state.termsAccepted}
            onChecked={(termsAccepted) => this.setState({ termsAccepted })}
            termsAndConditions={this.props.termsAndConditions}
          />
        ) : null}
        <div className={this.props.classes.buttonContainer}>
          {!this.props.hideCancelButton && (
            <Button
              onClick={this.props.onCancel}
              disabled={!!(this.props.loading || this.state.processing)}
            >
              {this.props.t('payment:forms.cancelPayment')}
            </Button>
          )}
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={
              !!(
                (!this.state.cardReady &&
                  !this.state.selectedSavedPaymentMethodId) ||
                this.props.loading ||
                this.state.processing ||
                (this.props.termsAndConditions && !this.state.termsAccepted)
              )
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
    marginTop: theme.spacing(2),
  },
  processingMessage: {
    marginTop: theme.spacing(2),
  },
  cardElementContainer: {
    border: '2px solid #efefef',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  buttonContainer: {
    width: '100%',
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  savePaymentMethodCheckbox: {
    marginLeft: -theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(0),
    },
  },
  payButton: {
    marginTop: theme.spacing(2),
  },
  row: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const PaymentIntentGatheringComposed = compose(
  withStyles(styles),
  withTranslation(['checkout', 'stripe']),
)(PaymentIntentGathering);

export default (props: Props) => (
  <Elements stripe={stripePromise}>
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <PaymentIntentGatheringComposed
          stripe={stripe}
          elements={elements}
          {...props}
        />
      )}
    </ElementsConsumer>
  </Elements>
);
