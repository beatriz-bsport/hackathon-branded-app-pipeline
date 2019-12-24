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

const PaymentMethodSwitcher = (props: {
  classes: Object,
  t: TFunction,
  onChange: (string) => void,
  payment_method: string,
}) => (
  <RadioGroup
    aria-label="payment-method"
    className={props.classes.paymentMethodSelectorContainer}
    value={props.payment_method}
    onChange={(ev) => props.onChange(ev.target.value)}
  >
    <FormControlLabel
      value="sepa_debit"
      control={<Radio color="primary" />}
      label={props.t('subscription:paymentMethod.sepa')}
      labelPlacement="bottom"
    />
    <FormControlLabel
      value="card"
      control={<Radio color="primary" />}
      label={props.t('subscription:paymentMethod.card')}
      labelPlacement="bottom"
    />
  </RadioGroup>
);

export class SubscriptionPayment extends React.Component<Props> {
  constructor(props) {
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
  };

  render() {
    const { props } = this;
    const { classes, t } = props;
    const { name, email } = this.state;
    return (
      <div>
        <PaymentMethodSwitcher
          classes={classes}
          t={t}
          payment_method={props.paymentMethod}
          onChange={props.setPaymentMethod}
        />
        <Divider />
        <div className={classes.cardContainer}>
          {props.paymentMethod === 'sepa_debit' ? (
            <div>
              <div className={classes.nameAndEmailContainer}>
                <TextField
                  inline
                  required
                  value={name}
                  variant="outlined"
                  placeholder={t('subscription:mandate.name')}
                  onChange={(ev) => this.setState({ name: ev.target.value })}
                />
                <TextField
                  inline
                  type="email"
                  required
                  variant="outlined"
                  value={email}
                  placeholder={t('subscription:mandate.email')}
                  onChange={(ev) => this.setState({ email: ev.target.value })}
                />
              </div>
              <div className={classes.sensitiveData}>
                <IbanElement supportedCountries={['SEPA']} />
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
          {props.paymentMethod === 'card' ? (
            <div className={classes.sensitiveData}>
              <CardElement />
            </div>
          ) : null}
        </div>
        <div className={classes.buttonContainer}>
          <Button
            onClick={props.onCancel}
            color="secondary"
            disabled={props.processing || this.state.loading}
          >
            {t('subscription:form.cancel')}
          </Button>
          <Button
            onClick={this.submit}
            id="stripe-pay"
            color="primary"
            disabled={(!name || !email) && props.paymentMethod === 'sepa_debit'}
          >
            {this.state.loading || props.processing ? (
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
    padding: theme.spacing.unit * 2,
  },
  buttonContainer: {
    padding: theme.spacing.unit * 2,
  },
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing.unit * 2,
    minWidth: '30vw',
  },
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.unit * 2,
  },
  nameAndEmailContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing.unit * 2,
  },
  mandate: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withState('paymentMethod', 'setPaymentMethod', 'sepa_debit'),
  withNamespaces(['subscripton']),
  withStyles(styles),
  injectStripe,
)(SubscriptionPayment);
