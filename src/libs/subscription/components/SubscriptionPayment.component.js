// @flow
import React from 'react';

import { compose, withState } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { CardElement, IbanElement, injectStripe } from 'react-stripe-elements';

import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';

const PaymentMethodSwitcher = (props: {
  classes: Object,
  t: TFunction,
  onChange: (string) => void,
  payment_method: string,
  enabledPaymentMethods: Array<number>,
}) => (
  <RadioGroup
    aria-label="payment-method"
    className={props.classes.paymentMethodSelectorContainer}
    value={props.payment_method}
    onChange={(ev) => props.onChange(ev.target.value)}
  >
    {props.enabledPaymentMethods.includes(
      BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
    ) ? (
      <FormControlLabel
        value="sepa_debit"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.sepa')}
        labelPlacement="bottom"
      />
    ) : null}
    {props.enabledPaymentMethods.includes(
      BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
    ) ? (
      <FormControlLabel
        value="card"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.card')}
        labelPlacement="bottom"
      />
    ) : null}
    {props.enabledPaymentMethods.includes(
      BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
    ) ? (
      <FormControlLabel
        value="bsport:credit"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.bsportCredit')}
        labelPlacement="bottom"
      />
    ) : null}
  </RadioGroup>
);

type Props = {
  member: ?Member,
  onCancel: () => void,
  processing: boolean,
  setPaymentMethod: (string) => void,
  paymentMethod: string,
  enabledPaymentMethods: Array<number>,

  stripe: Stripe,
  onSubmit: (source: string) => void,

  classes: Object,
  t: TFunction,
};

type State = {
  name: string,
  email: string,
  loading: boolean,
};

export class SubscriptionPayment extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      name: (props.member && props.member.name) || '',
      email: (props.member && props.member.email) || '',
    };
  }

  getSourceData = () => {
    if (this.props.paymentMethod === 'sepa_debit') {
      return {
        type: 'sepa_debit',
        currency: 'eur',
        owner: {
          name: this.state.name,
          email: this.state.email,
        },
        mandate: {
          // Automatically send a mandate notification email to your customer
          // once the source is charged.
          notification_method: 'manual',
        },
      };
    }
    return {
      type: 'card',
      currency: 'eur',
    };
  };

  submit = async () => {
    if (this.props.paymentMethod === 'bsport:credit') {
      this.props.onSubmit('bsport:credit');
    } else {
      this.setState({ loading: true });
      try {
        const tokenizer = await this.props.stripe.createSource(
          this.getSourceData(),
        );
        const { source } = tokenizer;
        this.props.onSubmit(source.id);
      } catch (error) {
        console.error(error);
      }
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {
      paymentMethod,
      t,
      enabledPaymentMethods,
      onCancel,
      processing,
      setPaymentMethod,
      classes,
    } = this.props;
    const { name, email } = this.state;
    return (
      <div>
        <PaymentMethodSwitcher
          classes={classes}
          t={t}
          payment_method={paymentMethod}
          onChange={setPaymentMethod}
          enabledPaymentMethods={enabledPaymentMethods}
        />
        <Divider />
        <div className={classes.cardContainer}>
          {paymentMethod === 'bsport:credit' ? (
            <Typography className={classes.explainCredit}>
              {t('subscription:paymentMethod.credit.explain')}
            </Typography>
          ) : null}
          {paymentMethod === 'sepa_debit' ? (
            <div>
              <div className={classes.nameAndEmailContainer}>
                <TextField
                  required
                  fullWidth
                  value={name}
                  variant="outlined"
                  placeholder={t('subscription:mandate.name')}
                  onChange={(ev) => this.setState({ name: ev.target.value })}
                />
                <TextField
                  type="email"
                  required
                  fullWidth
                  variant="outlined"
                  value={email}
                  placeholder={t('subscription:mandate.email')}
                  onChange={(ev) => this.setState({ email: ev.target.value })}
                />
              </div>
              <div className={classes.sensitiveDataContainer}>
                <div className={classes.sensitiveData}>
                  <IbanElement supportedCountries={['SEPA']} />
                </div>
              </div>
              <Typography
                color="textSecondary"
                variant="caption"
                className={classes.mandate}
              >
                {t('subscription:mandate.content')}
              </Typography>
            </div>
          ) : null}
          {paymentMethod === 'card' ? (
            <div className={classes.sensitiveDataContainer}>
              <div className={classes.sensitiveData}>
                <CardElement />
              </div>
            </div>
          ) : null}
        </div>
        <div className={classes.buttonContainer}>
          <Button
            onClick={onCancel}
            color="secondary"
            disabled={processing || this.state.loading}
          >
            {t('subscription:form.cancel')}
          </Button>
          <Button
            onClick={this.submit}
            id="stripe-pay"
            color="primary"
            disabled={(!name || !email) && paymentMethod === 'sepa_debit'}
          >
            {this.state.loading || processing ? (
              <CircularProgress />
            ) : (
              t('subscription:form.submit')
            )}
          </Button>
        </div>
      </div>
    );
  }
}
const styles = (theme) => ({
  title: {
    padding: theme.spacing(2),
  },
  buttonContainer: {
    padding: theme.spacing(2),
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
  explainCredit: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withState('paymentMethod', 'setPaymentMethod', 'sepa_debit'),
  withNamespaces(['subscripton']),
  withStyles(styles),
  injectStripe,
)(SubscriptionPayment);
