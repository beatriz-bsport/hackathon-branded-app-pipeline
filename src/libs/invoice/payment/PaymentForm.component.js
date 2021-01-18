// @flow
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { withTranslation } from 'react-i18next';

import PAYMENT_METHODS, {
  CB as PAYMENT_METHOD_CB,
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
  SUBSCRIPTION_CB as PAYMENT_METHOD_SUBSCRIPTION_CB,
} from '@bsport/common/lib/master-data/payment-methods';

import { Elements } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';

import PriceInput from '../../../components/input/PriceInput.component';
import StripeForm from '../../../components/form/StripeForm.component';

import { getStripePkKey, getCurrencyDisplay } from '../../theme/selectors';

const stripePromise = loadStripe(getStripePkKey());

type Props = {
  t: (x: string) => string,
  classes: Object,
  amountDue: number,
  creditAccountBalance: number,
  onSubmit: (formData: PaymentFormData) => void,
};

type State = {
  payment_received: boolean,
  payment_method: number,
  price: ?number,
  payment_note: string,
};

let SEED_ID = 0;
const initialState = {
  payment_received: true,
  price: 0,
  payment_note: '',
  payment_method: PAYMENT_METHOD_CB.id,
  stripe_charge_id: null,
};

export class PaymentForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initialState,
      price: props.amountDue,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.amountDue !== prevProps.amountDue) {
      this.setState({ price: this.props.amountDue });
    }
  }

  onChangePaymentMethod = (event, payment_method) => {
    this.setState({ payment_method });
  };

  onSubmit = (event: Object) => {
    event.preventDefault();
    this.addPayment();
  };

  addPayment = (
    tokenId: ?string,
    payment_method_override: ?number,
    payment_note_override: ?string,
    extraData: Object,
  ) => {
    const {
      payment_method,
      price,
      payment_received,
      payment_note,
    } = this.state;
    if (price !== 0) {
      SEED_ID += 1;
      const id = SEED_ID;
      this.props.onSubmit({
        payment_received,
        price,
        stripe_charge_id: tokenId,
        payment_note: payment_note_override || payment_note,
        payment_method: payment_method_override || payment_method,
        id,
        ...(extraData || {}),
      });
      this.setState((prevState) => ({
        ...initialState,
        payment_method: prevState.payment_method,
      }));
    }
  };

  receiveStripeToken = (token, recurringData) => {
    if ((token || {}).id) {
      if (recurringData) {
        const payment_note = 'Payment auto';
        this.addPayment(
          token.id,
          PAYMENT_METHOD_SUBSCRIPTION_CB.id,
          payment_note,
          {
            interval: recurringData.interval,
            nb_interval: recurringData.nb_interval,
            billing_anchor: recurringData.billing_anchor,
          },
        );
      } else {
        this.addPayment(token.id);
      }
    }
  };

  storePrice = (event: Object) => {
    const price = parseFloat(event.target.value);
    this.setState({ price });
  };

  storePaymentInfoExtra = (event: Object) => {
    this.setState({ payment_note: event.target.value });
  };

  storeStatus = (event: Object) => {
    this.setState({ payment_received: event.target.checked });
  };

  renderAddPaymentButton = () => {
    const { classes, t } = this.props;
    const { payment_method } = this.state;
    if (payment_method === PAYMENT_METHOD_CB.id) {
      return null;
    }
    return (
      <div className={classes.addButton}>
        <Grid container item justify="flex-end">
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            onClick={this.onSubmit}
          >
            <AddCircleIcon className={classes.leftIcon} />{' '}
            {t('payment.addThisPaymentItem')}
          </Button>
        </Grid>
      </div>
    );
  };

  renderPaymentExtraInfo = () => {
    const { t, classes, creditAccountBalance } = this.props;
    const { payment_method, payment_note, price } = this.state;
    if (payment_method === PAYMENT_METHOD_CREDIT_ACCOUNT.id) {
      return (
        <div className={classes.accountBalanceInfo}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">
                {t('payment.creditAccountBalance')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color={creditAccountBalance <= 0 ? 'error' : 'primary'}
              >
                {`${creditAccountBalance} ${getCurrencyDisplay()}`}
              </Typography>
            </Grid>
          </Grid>
        </div>
      );
    }
    if (payment_method === PAYMENT_METHOD_CB.id) {
      return (
        <div className={classes.stripeFormContainer}>
          <Elements stripe={stripePromise}>
            <StripeForm price={price} onComplete={this.receiveStripeToken} />
          </Elements>
        </div>
      );
    }
    return (
      <TextField
        label={t('form.payment.additionalInformationLabel')}
        helperText={t('form.payment.additionalInformationHelper')}
        value={payment_note}
        onChange={this.storePaymentInfoExtra}
        margin="dense"
        fullWidth
      />
    );
  };

  handlePaymentMethodChange = (payment_method) => {
    this.setState({ payment_method });
  };

  render() {
    const { t, classes } = this.props;
    const { payment_method, price } = this.state;
    return (
      <Grid
        container
        direction="column"
        spacing={3}
        className={classes.innerForm}
      >
        <Grid item xs={12}>
          <FormControl>
            <InputLabel
              shrink
              htmlFor="payment-method-helper"
              className={classes.paymentMethodLabel}
            >
              {t('payment.paymentMethod')}
            </InputLabel>
            <Select
              fullWidth
              value={payment_method}
              className={classes.paymentMethodInput}
              onChange={(event) =>
                this.handlePaymentMethodChange(event.target.value)
              }
              input={
                <Input
                  className={classes.input}
                  name="payment-method"
                  id="payment-method-helper"
                />
              }
            >
              {PAYMENT_METHODS.filter(
                (pm) =>
                  pm.id !== PAYMENT_METHOD_SUBSCRIPTION_CB.id &&
                  pm.id !== PAYMENT_METHOD_CREDIT_ACCOUNT.id,
              ).map((pm) => (
                <MenuItem key={pm.id} value={pm.id}>
                  {t(`payment.paymentMethods.${pm.text}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <form>
            <div>
              <Grid container direction="row" alignItems="center" spacing={3}>
                <Grid item className={classes.priceInputContainer}>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <PriceInput
                          value={price}
                          onChange={this.storePrice}
                          variant="outlined"
                          margin="dense"
                          required
                          fullWidth
                        />
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </div>
            {this.renderPaymentExtraInfo()}
            {this.renderAddPaymentButton()}
          </form>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  addButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  innerForm: {
    padding: theme.spacing(3),
  },
  priceInputContainer: {
    marginLeft: theme.spacing(2),
  },
  accountBalanceInfo: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    border: '1px solid #ced4da',
    backgroundColor: theme.palette.background.paper,
  },
  stripeFormContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paymentMethodInput: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    minWidth: 260,
  },
  input: {
    marginTop: theme.spacing(1),
  },
  paymentMethodLabel: {
    paddingBottom: theme.spacing(2),
  },
});

export default withStyles(styles)(withTranslation()(PaymentForm));
