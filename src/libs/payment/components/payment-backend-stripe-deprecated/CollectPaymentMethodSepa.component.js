// @flow
import React from 'react';

import {
  IbanElement,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import ErrorIcon from '@material-ui/icons/Error';
import Modal from '@material-ui/core/Modal';
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

import { withTranslation, TFunction } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeInit } from '#libs/payment/types';
import StripeErrorCode from './StripeErrorCode.component';

import { AVAILABLE_PAYMENT_METHOD_TYPE } from './helpers';

import { getStripePkKey } from '../../../theme/selectors';

const PAYMENT_METHOD = AVAILABLE_PAYMENT_METHOD_TYPE.sepa_debit;

const fallbackStripePromise = loadStripe(getStripePkKey());

type Props = {
  fullScreen: boolean,
  t: TFunction,
  onClose: () => void,
  onSuccess: (stripeSetupIntentCallResult: any) => void,
  requestSetupIntentSecret: () => void,
  stripe: Stripe,
  elements: StripeElement,
  classes: Object,
  defaultName?: string,
  defaultEmail?: string,
  variant?: 'div' | 'modal',
  content?: string,
  labelClose?: string,
};
const Wrapper: React.FC<{ variant: string }> = ({ children, variant }) => {
  if (variant === 'div') {
    return <div>{children}</div>;
  }
  return <Modal open>{children}</Modal>;
};
export class CollectPaymentMethod extends React.Component<Props> {
  constructor(props: Props) {
    super();

    this.state = {
      error: false,
      clientSecret: null,
      success: null,
      billing_details: {
        name: props.defaultName || '',
        email: props.defaultEmail || '',
        address: {
          line1: '',
          country: '',
        },
      },
      billingAddressNeeded: false,
    };
  }

  updateBillingAddressNeeds = (country) => {
    if (
      [
        'AD',
        'PF',
        'TF',
        'GI',
        'GB',
        'GG',
        'VA',
        'IM',
        'JE',
        'MC',
        'NC',
        'BL',
        'PM',
        'SM',
        'CH',
        'WF',
      ].includes(country)
    ) {
      this.setState((prevState) => ({
        ...prevState,
        billingAddressNeeded: true,
        billing_details: {
          ...prevState.billing_details,
          address: { ...prevState.billing_details.address, country },
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        billingAddressNeeded: false,
      }));
    }
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

    if (this.props.elements) {
      this.props.elements
        .getElement(PAYMENT_METHOD.type)
        .addEventListener('change', (data) =>
          this.updateBillingAddressNeeds(data?.country),
        );
    }
  }

  componentWillUnmount() {
    if (this.props.elements) {
      this.props.elements
        .getElement(PAYMENT_METHOD.type)
        ?.removeEventListener('change');
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.elements && !!this.props.elements) {
      this.props.elements
        .getElement(PAYMENT_METHOD.type)
        .addEventListener('change', (data) =>
          this.updateBillingAddressNeeds(data?.country),
        );
    }
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
        billing_details: this.state.billingAddressNeeded
          ? this.state.billing_details
          : {
              name: this.state.billing_details.name,
              email: this.state.billing_details.email,
            },
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

  render() {
    const { classes, fullScreen } = this.props;
    const dialogOffset = fullScreen ? '0%' : '50%';
    return (
      <Wrapper variant={this.props.variant}>
        <>
          <div
            className={classes.modal}
            style={
              this.props.variant === 'div'
                ? { position: 'unset', backgroundColor: 'transparent' }
                : {
                    transform: `translate(-${dialogOffset}, -${dialogOffset})`,
                    top: dialogOffset,
                    left: dialogOffset,
                  }
            }
          >
            <DialogTitle id="collectPaymentMethodTitle">
              {this.props.t('forms.paymentMethod.collect.title')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.props.content ||
                  this.props.t('forms.paymentMethod.collect.content')}
              </DialogContentText>
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
                    <div className={classes.nameAndEmailContainer}>
                      <TextField
                        fullWidth
                        required
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
                        placeholder={this.props.t('subscription:mandate.name')}
                        value={this.state.billing_details.name}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        required
                        onChange={(ev) => {
                          const { value } = ev.target;
                          this.setState((prevState) => ({
                            billing_details: {
                              ...prevState.billing_details,
                              email: value,
                            },
                          }));
                        }}
                        placeholder={this.props.t('subscription:mandate.email')}
                        type="email"
                        value={this.state.billing_details.email}
                        variant="outlined"
                      />
                    </div>
                    <div
                      style={this.state.processing ? { display: 'none' } : {}}
                    >
                      <div className={classes.sensitiveDataContainer}>
                        <div className={classes.sensitiveData}>
                          <IbanElement
                            ref={this.ibanRef}
                            options={{
                              supportedCountries: ['SEPA'],
                              style: {
                                height: 40,
                                base: { height: 40, fontSize: '18px' },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {this.state.billingAddressNeeded && (
                      <div className={classes.nameAndEmailContainer}>
                        <TextField
                          fullWidth
                          onChange={(ev) => {
                            const { value } = ev.target;
                            this.setState((prevState) => {
                              return {
                                billing_details: {
                                  ...prevState.billing_details,
                                  address: {
                                    ...prevState.billing_details.address,
                                    line1: value,
                                  },
                                },
                              };
                            });
                          }}
                          placeholder={this.props.t(
                            'subscription:mandate.address_line_1',
                          )}
                          required={this.state.billingAddressNeeded}
                          value={this.state.billing_details.address.line1}
                          variant="outlined"
                        />
                      </div>
                    )}
                    <Typography
                      className={classes.mandate}
                      color="textSecondary"
                    >
                      {this.props.t('subscription:mandate.contentIban')}
                    </Typography>
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
          </div>
        </>
      </Wrapper>
    );
  }
}

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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  mandate: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'justify',
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    overflow: 'auto',
    maxHeight: '100vh',
  },
});

const CollectPaymentMethodCompose = compose(
  withTranslation(['payment']),
  withStyles(styles),
)(CollectPaymentMethod);

export default (props: Props & { stripePromise?: StripeInit }) => (
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
