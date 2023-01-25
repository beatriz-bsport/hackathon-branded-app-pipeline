import React from 'react';

import { Elements, ElementsConsumer, Stripe } from '@stripe/react-stripe-js';
import ErrorIcon from '@material-ui/icons/Error';
import Modal from '@material-ui/core/Modal';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

import { withTranslation, TFunction } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import StripeErrorCode from './StripeErrorCode.component';

import { getStripePkKey } from '../../../theme/selectors';

const stripePromise = loadStripe(getStripePkKey());

type Props = {
  fullScreen: boolean;
  t: TFunction;
  onClose: () => void;
  onSuccess: (stripeSetupIntentCallResult: any) => void;
  requestSetupIntentSecret: () => void;
  stripe: Stripe;
  classes: Object;
  variant?: 'div' | 'modal';
  content?: string;
  labelClose?: string;
};

type State = {
  error: Error | null;
  clientSecret: string | null;
  success: boolean | null;
};

const Wrapper: React.FC<{ variant: string }> = ({ children, variant }) => {
  if (variant === 'div') {
    return <div>{children}</div>;
  }
  return <Modal open>{children}</Modal>;
};

export class RevalidateSEPAMandate extends React.Component<Props, State> {
  state: State = {
    error: false,
    clientSecret: null,
    success: null,
  };

  componentDidMount() {
    this.props
      .requestSetupIntentSecret(this.props.paymentMethodIdToRevalidate)
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

  handleSubmit = (ev: React.SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.setState({
      processing: true,
      stripe_error_code: null,
      stripe_decline_code: null,
    });

    this.props.stripe
      .confirmSepaDebitSetup(this.state.clientSecret, {
        payment_method: this.props.paymentMethodIdToRevalidate,
      })
      .then((result) => {
        if (result.error) {
          this.setState({
            processing: false,
            error: true,
            stripe_error_code: (result.error && result.error.code) || null,
            stripe_decline_code:
              (result.error && result.error.decline_code) || null,
          });
        } else {
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
    if (!this.props.stripe)
      return (
        <Backdrop open>
          <CircularProgress color="primary" />
        </Backdrop>
      );

    const { classes, fullScreen } = this.props;
    const dialogOffset = fullScreen ? '0%' : '50%';

    return (
      <Wrapper variant={this.props.variant}>
        <>
          <div
            style={
              this.props.variant === 'div'
                ? { position: 'unset', backgroundColor: 'transparent' }
                : {
                    transform: `translate(-${dialogOffset}, -${dialogOffset})`,
                    top: dialogOffset,
                    left: dialogOffset,
                  }
            }
            className={classes.modal}
          >
            <DialogContent>
              {!this.state.success && (
                <Typography variant="h5">
                  {this.props.content ||
                    this.props.t(
                      'forms.paymentMethod.mandateRevalidated.content',
                    )}
                </Typography>
              )}
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
                        {this.props.t(
                          'forms.paymentMethod.mandateRevalidated.success',
                        )}
                      </Typography>
                    </div>
                    <div className={classes.actions}>
                      {this.props.onClose && (
                        <Button onClick={this.props.onClose}>
                          {this.props.labelClose ||
                            this.props.t(
                              'forms.paymentMethod.mandateRevalidated.close',
                            )}
                        </Button>
                      )}
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
                        {this.props.t(
                          'forms.paymentMethod.mandateRevalidated.error',
                        )}
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
                      {this.props.onClose && (
                        <Button onClick={this.props.onClose}>
                          {this.props.labelClose ||
                            this.props.t(
                              'forms.paymentMethod.mandateRevalidated.close',
                            )}
                        </Button>
                      )}
                      <Button
                        onClick={() =>
                          this.setState({ error: null, success: null })
                        }
                      >
                        {this.props.t(
                          'forms.paymentMethod.mandateRevalidated.retry',
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                {!this.state.error && !this.state.success && (
                  <form onSubmit={this.handleSubmit}>
                    <Typography
                      color="textSecondary"
                      className={classes.mandate}
                    >
                      {this.props.t('subscription:mandate.content')}
                    </Typography>
                    <div className={classes.actions}>
                      {this.props.onClose && (
                        <Button
                          disabled={this.state.processing}
                          onClick={this.props.onClose}
                        >
                          {this.props.labelClose ||
                            this.props.t(
                              'forms.paymentMethod.mandateRevalidated.close',
                            )}
                        </Button>
                      )}
                      <Button
                        color="primary"
                        disabled={this.state.processing}
                        type="submit"
                      >
                        {this.props.t(
                          'forms.paymentMethod.mandateRevalidated.collect',
                        )}
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

const RevalidateSEPAMandateCompose = compose(
  withTranslation(['payment']),
  withStyles(styles),
  withMobileDialog(),
)(RevalidateSEPAMandate);

export default (props: Props) => (
  <Elements stripe={stripePromise}>
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <RevalidateSEPAMandateCompose
          elements={elements}
          stripe={stripe}
          {...props}
        />
      )}
    </ElementsConsumer>
  </Elements>
);
