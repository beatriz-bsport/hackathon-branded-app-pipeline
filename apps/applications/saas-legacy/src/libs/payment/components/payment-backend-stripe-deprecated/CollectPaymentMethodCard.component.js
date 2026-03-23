// @flow
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';

import {
  CardElement,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ErrorIcon from '@material-ui/icons/Error';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

import { hasUpsell } from '#src/libs/platform-billing/utils';
import { UPSELL_IDENTIFIER_STRIPE_TERMINAL } from '#src/libs/platform-billing/upsell-identifiers';
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import PaymentStripeTerminal from '#src/libs/terminal/components/PaymentStripeTerminal.component';

import type { FeatureList } from '#src/libs/company/types';
import type { StripeReader } from '#src/libs/terminal/types';
import type { StripeInit } from '#src/libs/payment/types';
import type { BillingDetails } from '../../../marketplace/types';
import StripeErrorCode from './StripeErrorCode.component';
import CardBillingDetailsForm from '../payment-backend-stripe/CardBillingDetailsForm';
import { getCompanyCountry, getStripePkKey } from '../../../theme/selectors';
import { AVAILABLE_PAYMENT_METHOD_TYPE } from './helpers';

const fallbackStripePromise = loadStripe(getStripePkKey());

type Props = {
  addViaTerminal?: boolean,
  cardBillingDetailsMandatory: boolean,
  classes: Object,
  content?: string,
  defaultEmail?: string,
  defaultName?: string,
  elements: StripeElement,
  fullScreen: boolean,
  labelClose?: string,
  stripe: Stripe,
  stripeReaders: StripeReader[],
  t: TFunction,
  variant?: 'div' | 'modal',
  onClose?: () => void,
  onSuccess: (stripeSetupIntentCallResult: any) => void,
  requestSetupIntentSecret: () => void,
};

const PAYMENT_METHOD = AVAILABLE_PAYMENT_METHOD_TYPE.card;

const Wrapper: React.FC<{ variant: string }> = ({ children, variant }) => {
  if (variant === 'div') {
    return <div>{children}</div>;
  }
  return <Modal open>{children}</Modal>;
};

export class CollectPaymentMethod extends React.Component<Props> {
  state = {
    error: false,
    clientSecret: null,
    success: null,
    displayStripeTerminal: false,
    billingDetails: {
      name: this.props.defaultName || '',
      email: this.props.defaultEmail || '',
      address: {
        line1: '',
        postal_code: '',
        country: getCompanyCountry() || '',
      },
    },
  };

  componentDidMount() {
    this.props
      .requestSetupIntentSecret()
      .then((r) => {
        this.setState({ clientSecret: r.data.client_secret });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          error: true,

          stripe_error_code:
            (err.response && err.response.data && err.response.data.code) ||
            null,
          stripe_decline_code:
            (err.response &&
              err.response.data &&
              err.response.data.decline_code) ||
            null,
        });
      });
  }

  handleSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.setState({
      processing: true,
      stripe_error_code: null,
      stripe_decline_code: null,
    });
    const element = this.props.elements.getElement(PAYMENT_METHOD.type);

    this.props.stripe[PAYMENT_METHOD.method](this.state.clientSecret, {
      payment_method: {
        card: element,
        ...(this.props.cardBillingDetailsMandatory
          ? { billing_details: this.state.billingDetails }
          : {}),
      },
    }).then((result) => {
      if (result.error) {
        // Display error.message in your UI.
        this.setState({
          processing: false,
          error: true,
          stripe_error_code: (result.error && result.error.code) || null,
          stripe_decline_code:
            (result.error && result.error.decline_code) || null,
        });
      } else {
        // The setup has succeeded. Display a success message.
        this.setState({
          processing: false,
          success: true,
        });
        if (this.props.onSuccess) {
          this.props.onSuccess(result);
        }
      }
    });
  };

  setBillingDetails = (billingDetails: BillingDetails) => {
    this.setState({ billingDetails });
  };

  areBillingDetailsProvided = (billingDetails: BillingDetails) => {
    return (
      !!billingDetails.name &&
      !!billingDetails.address.line1 &&
      !!billingDetails.address.postal_code &&
      !!billingDetails.address.city &&
      !!billingDetails.address.country
    );
  };

  render() {
    const { classes, fullScreen } = this.props;
    const dialogOffset = fullScreen ? '0%' : '50%';

    const areBillingDetailsProvided = this.props.cardBillingDetailsMandatory
      ? this.areBillingDetailsProvided(this.state.billingDetails)
      : true;

    return (
      <Wrapper variant={this.props.variant}>
        <>
          <div
            className={classes.modal}
            style={
              this.props.variant === 'div'
                ? {
                    position: 'unset',
                    backgroundColor: 'transparent',
                  }
                : {
                    transform: `translate(-${dialogOffset}, -${dialogOffset})`,
                    top: dialogOffset,
                    left: dialogOffset,
                  }
            }
          >
            {!this.state.displayStripeTerminal && (
              <DialogTitle id="collectPaymentMethodCardDialogTitle">
                {this.props.t('forms.paymentMethod.collect.title')}
              </DialogTitle>
            )}
            <DialogContent id="collectPaymentMethodCardDialogContent">
              {!this.state.displayStripeTerminal && (
                <DialogContentText id="collectPaymentMethodCardDialogContentText">
                  {this.props.content ||
                    this.props.t('forms.paymentMethod.collect.content')}
                </DialogContentText>
              )}
              {this.state.displayStripeTerminal ? (
                <PaymentStripeTerminal
                  isSetupIntent
                  onlySavePaymentMethod
                  clientSecret={this.state.clientSecret}
                  onCancel={this.props.onClose}
                  onSuccess={this.props.onSuccess}
                  stripeReaders={this.props.stripeReaders}
                />
              ) : (
                <div>
                  {this.state.processing && (
                    <div className={classes.centered}>
                      <CircularProgress />
                    </div>
                  )}
                  {!!this.state.success && (
                    <div>
                      <div className={classes.centered}>
                        <CheckIcon
                          color="primary"
                          style={{ height: 100, width: 100 }}
                        />
                        <Typography className={classes.message}>
                          {this.props.t('forms.paymentMethod.message.success')}
                        </Typography>
                      </div>
                      <div className={classes.actions}>
                        {this.props.onClose && (
                          <Button onClick={this.props.onClose}>
                            {this.props.labelClose ||
                              this.props.t('forms.paymentMethod.actions.close')}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {!!this.state.error && (
                    <div>
                      <div className={classes.centered}>
                        <ErrorIcon
                          color="secondary"
                          style={{ height: 100, width: 100 }}
                        />
                        <Typography className={classes.message}>
                          {this.props.t('forms.paymentMethod.message.error')}
                        </Typography>
                        {this.state.stripe_error_code ||
                        this.state.stripe_decline_code ? (
                          <StripeErrorCode
                            declineCode={this.state.stripe_decline_code}
                            errorCode={this.state.stripe_error_code}
                          />
                        ) : null}
                      </div>
                      <div className={classes.actions}>
                        {this.props.onClose && (
                          <Button onClick={this.props.onClose}>
                            {this.props.labelClose ||
                              this.props.t('forms.paymentMethod.actions.close')}
                          </Button>
                        )}
                        <Button
                          onClick={() =>
                            this.setState({ error: null, success: null })
                          }
                        >
                          {this.props.t('forms.paymentMethod.actions.retry')}
                        </Button>
                      </div>
                    </div>
                  )}
                  {!this.state.error && !this.state.success && (
                    <form onSubmit={this.handleSubmit}>
                      {this.props.cardBillingDetailsMandatory && (
                        <CardBillingDetailsForm
                          billingDetails={this.state.billingDetails}
                          disabled={
                            !this.props.stripe ||
                            !this.state.clientSecret ||
                            this.state.processing
                          }
                          setBillingDetails={this.setBillingDetails}
                        />
                      )}
                      <div
                        style={this.state.processing ? { display: 'none' } : {}}
                      >
                        <div className={classes.sensitiveDataContainer}>
                          <div
                            className={classes.sensitiveData}
                            id="collectPaymentMethodCardSensitiveData"
                          >
                            <Card />
                          </div>
                        </div>
                      </div>
                      {this.props.addViaTerminal && (
                        <FeatureListProvider>
                          {(featureList: FeatureList) => (
                            <Button
                              className={classes.addViaTerminal}
                              color="primary"
                              disabled={
                                !hasUpsell(
                                  featureList,
                                  UPSELL_IDENTIFIER_STRIPE_TERMINAL,
                                )
                              }
                              onClick={() =>
                                this.setState({ displayStripeTerminal: true })
                              }
                              variant="outlined"
                            >
                              <AddIcon />
                              {this.props.t(
                                'invoice:configuration.stripeTerminal.addCard',
                              )}
                            </Button>
                          )}
                        </FeatureListProvider>
                      )}
                      <div className={classes.actions}>
                        {this.props.onClose && (
                          <Button
                            disabled={this.state.processing}
                            onClick={this.props.onClose}
                          >
                            {this.props.labelClose ||
                              this.props.t('forms.paymentMethod.actions.close')}
                          </Button>
                        )}
                        <Button
                          color="primary"
                          disabled={
                            this.state.processing || !areBillingDetailsProvided
                          }
                          type="submit"
                        >
                          {this.props.t('forms.paymentMethod.actions.collect')}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </DialogContent>
          </div>
        </>
      </Wrapper>
    );
  }
}

const Card = () => (
  <CardElement
    options={{
      hidePostalCode: true,
      style: { base: { fontSize: '18px' } },
      disableLink: true,
    }}
  />
);

const styles = (theme: Theme) => ({
  addViaTerminal: {
    marginTop: theme.spacing(2),
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centered: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  sensitiveDataContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    minWidth: '30vw',
    maxWidth: '80vw',
    width: '100%',
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    overflow: 'auto',
    maxHeight: '100vh',
  },
});

const CollectPaymentMethodCompose = compose(
  withTranslation('payment'),
  withStyles(styles),
)(CollectPaymentMethod);

export default (props: Props & { stripePromise?: StripeInit }) => {
  return (
    <Elements stripe={props.stripePromise ?? fallbackStripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CollectPaymentMethodCompose
            elements={elements}
            stripe={stripe}
            {...props}
          />
        )}
      </ElementsConsumer>
    </Elements>
  );
};
