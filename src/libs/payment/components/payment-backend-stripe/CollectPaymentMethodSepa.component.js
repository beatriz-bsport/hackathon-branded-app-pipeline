// @flow
import React from 'react';

import {
  IbanElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import ErrorIcon from '@material-ui/icons/Error';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Config from '../../../../config';
import StripeErrorCode from './StripeErrorCode.component';

import { AVAILABLE_PAYMENT_METHOD_TYPE } from './helpers';

const PAYMENT_METHOD = AVAILABLE_PAYMENT_METHOD_TYPE.sepa_debit;

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  t: TFunction,
  onClose: () => void,
  onSuccess: () => void,
  requestSetupIntentSecret: () => void,
  stripe: Stripe,
  elements: StripeElement,
  classes: Object,
};

export class CollectPaymentMethod extends React.Component<Props> {
  state = {
    error: false,
    clientSecret: null,
    success: null,
    billing_details: {
      name: '',
      email: '',
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
        sepa_debit: element,
        billing_details: this.state.billing_details,
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
                <div className={classes.nameAndEmailContainer}>
                  <TextField
                    required
                    fullWidth
                    value={this.state.billing_details.name}
                    variant="outlined"
                    placeholder={this.props.t('subscription:mandate.name')}
                    onChange={(ev) => {
                      const { value } = ev.target;
                      this.setState((prevState) => {
                        return {
                          billing_details: {
                            ...prevState.billing_details,
                            name: value,
                          },
                        };
                      });
                    }}
                  />
                  <TextField
                    type="email"
                    required
                    fullWidth
                    variant="outlined"
                    value={this.state.billing_details.email}
                    placeholder={this.props.t('subscription:mandate.email')}
                    onChange={(ev) => {
                      const { value } = ev.target;
                      this.setState((prevState) => ({
                        billing_details: {
                          ...prevState.billing_details,
                          email: value,
                        },
                      }));
                    }}
                  />
                </div>
                <div style={this.state.processing ? { display: 'none' } : {}}>
                  <div className={classes.sensitiveDataContainer}>
                    <div className={classes.sensitiveData}>
                      <SepaDebit />
                    </div>
                  </div>
                </div>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  className={classes.mandate}
                >
                  {this.props.t('subscription:mandate.content')}
                </Typography>
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

const SepaDebit = () => (
  <IbanElement
    supportedCountries={['SEPA']}
    style={{ height: 40, base: { height: 40, fontSize: '18px' } }}
  />
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
  injectStripe,
)(CollectPaymentMethod);

export default (props: Props) => (
  <StripeProvider apiKey={STRIPE_KEY}>
    <Elements>
      <CollectPaymentMethodCompose {...props} />
    </Elements>
  </StripeProvider>
);
