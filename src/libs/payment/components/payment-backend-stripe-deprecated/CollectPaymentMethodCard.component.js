// @flow
import React from 'react';

import {
  CardElement,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ErrorIcon from '@material-ui/icons/Error';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getStripePkKey } from '../../../theme/selectors';
import StripeErrorCode from './StripeErrorCode.component';

import { AVAILABLE_PAYMENT_METHOD_TYPE } from './helpers';

const stripePromise = loadStripe(getStripePkKey());

type Props = {
  t: TFunction,
  onClose: () => void,
  onSuccess: () => void,
  requestSetupIntentSecret: () => void,
  stripe: Stripe,
  elements: StripeElement,
  classes: Object,
};

const PAYMENT_METHOD = AVAILABLE_PAYMENT_METHOD_TYPE.card;

export class CollectPaymentMethod extends React.Component<Props> {
  state = {
    error: false,
    clientSecret: null,
    success: null,
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
          this.props.onSuccess();
        }
      }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog open>
        <DialogTitle>
          {this.props.t('forms.paymentMethod.collect.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.props.t('forms.paymentMethod.collect.content')}
          </DialogContentText>
          <div style={{ minWidth: 400 }}>
            {this.state.processing && (
              <div className={classes.centered}>
                <CircularProgress />
              </div>
            )}
            {!!this.state.success && (
              <div>
                <div className={classes.centered}>
                  <CheckIcon
                    style={{ height: 100, width: 100 }}
                    color="primary"
                  />
                  <Typography className={classes.message}>
                    {this.props.t('forms.paymentMethod.message.success')}
                  </Typography>
                </div>
                <div className={classes.actions}>
                  <Button onClick={this.props.onClose}>
                    {this.props.t('forms.paymentMethod.actions.close')}
                  </Button>
                </div>
              </div>
            )}
            {!!this.state.error && (
              <div>
                <div className={classes.centered}>
                  <ErrorIcon
                    style={{ height: 100, width: 100 }}
                    color="secondary"
                  />
                  <Typography className={classes.message}>
                    {this.props.t('forms.paymentMethod.message.error')}
                  </Typography>
                  {this.state.stripe_error_code ||
                  this.state.stripe_decline_code ? (
                    <StripeErrorCode
                      errorCode={this.state.stripe_error_code}
                      declineCode={this.state.stripe_decline_code}
                    />
                  ) : null}
                </div>
                <div className={classes.actions}>
                  <Button onClick={this.props.onClose}>
                    {this.props.t('forms.paymentMethod.actions.close')}
                  </Button>
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
                <div style={this.state.processing ? { display: 'none' } : {}}>
                  <div className={classes.sensitiveDataContainer}>
                    <div className={classes.sensitiveData}>
                      <Card />
                    </div>
                  </div>
                </div>
                <div className={classes.actions}>
                  <Button
                    disabled={this.state.processing}
                    onClick={this.props.onClose}
                  >
                    {this.props.t('forms.paymentMethod.actions.close')}
                  </Button>
                  <Button
                    color="primary"
                    disabled={this.state.processing}
                    type="submit"
                  >
                    {this.props.t('forms.paymentMethod.actions.collect')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

const Card = () => (
  <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
);

const styles = (theme) => ({
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
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  nameAndEmailContainer: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  mandate: {
    padding: theme.spacing(2),
  },
});

const CollectPaymentMethodCompose = compose(
  withTranslation(['payment']),
  withStyles(styles),
)(CollectPaymentMethod);

export default (props: Props) => (
  <Elements stripe={stripePromise}>
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CollectPaymentMethodCompose
          stripe={stripe}
          elements={elements}
          {...props}
        />
      )}
    </ElementsConsumer>
  </Elements>
);
