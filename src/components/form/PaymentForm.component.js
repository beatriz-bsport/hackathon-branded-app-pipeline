// @flow
import React, { Component } from 'react';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Button,
  TextField,
  Tab,
  Tabs,
  withStyles,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NoteIcon from '@material-ui/icons/Note';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { withNamespaces } from 'react-i18next';

import {
  CB as PAYMENT_METHOD_CB,
  CASH as PAYMENT_METHOD_CASH,
  CHECK as PAYMENT_METHOD_CHECK,
  CHECK_FR as PAYMENT_METHOD_CHECK_FR,
} from '@bsport/common/lib/master-data/payment-methods';

import { Elements, StripeProvider } from 'react-stripe-elements';

import Config from '../../config';

import PriceInput from '../input/PriceInput.component';
import StripeForm from './StripeForm.component';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  t: (x: string) => string,
  classes: Object,
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
  state = {
    ...initialState,
  };

  onChangePaymentMethod = (event, payment_method) => {
    this.setState({ payment_method });
  };

  onSubmit = (event: Object) => {
    event.preventDefault();
    this.addPayment();
  };

  addPayment = (tokenId: ?string) => {
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
        payment_note,
        payment_method,
        id,
      });
      this.setState((prevState) => ({
        ...initialState,
        payment_method: prevState.payment_method,
      }));
    }
  };

  receiveStripeToken = (token) => {
    if ((token || {}).id) {
      this.addPayment(token.id);
    }
  };

  storePrice = (event: Object) => {
    const price = parseInt(event.target.value, 10);
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
    const { t, classes } = this.props;
    const { payment_method, payment_note, price } = this.state;
    if (payment_method === PAYMENT_METHOD_CB.id) {
      return (
        <div className={classes.stripeFormContainer}>
          <StripeProvider apiKey={STRIPE_KEY}>
            <Grid container spacing={16} direction="column">
              <Grid item>
                <Elements>
                  <StripeForm
                    price={price}
                    onComplete={this.receiveStripeToken}
                  />
                </Elements>
              </Grid>
            </Grid>
          </StripeProvider>
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

  render() {
    const { t, classes } = this.props;
    const { payment_method, payment_received, price } = this.state;
    return (
      <Grid container direction="column" spacing={24}>
        <Grid item>
          <Paper>
            <Tabs
              value={payment_method}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.onChangePaymentMethod}
              scrollable
              scrollButtons="auto"
            >
              <Tab
                icon={<CreditCardIcon />}
                label={t(`payment.paymentMethod.${PAYMENT_METHOD_CB.text}`)}
                value={PAYMENT_METHOD_CB.id}
              />
              <Tab
                icon={<NoteIcon />}
                label={t(`payment.paymentMethod.${PAYMENT_METHOD_CHECK.text}`)}
                value={PAYMENT_METHOD_CHECK.id}
              />
              <Tab
                icon={<AttachMoneyIcon />}
                label={t(`payment.paymentMethod.${PAYMENT_METHOD_CASH.text}`)}
                value={PAYMENT_METHOD_CASH.id}
              />
              <Tab
                icon={<NoteIcon />}
                label={t(
                  `payment.paymentMethod.${PAYMENT_METHOD_CHECK_FR.text}`,
                )}
                value={PAYMENT_METHOD_CHECK_FR.id}
              />
            </Tabs>
          </Paper>
        </Grid>
        <Grid item className={classes.innerForm}>
          <form>
            <div>
              <Grid container direction="row" alignItems="center" spacing={24}>
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
                        />
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <FormGroup>
                      <FormControlLabel
                        label={t('payment.status')}
                        control={
                          <Checkbox
                            disabled={payment_method === PAYMENT_METHOD_CB.id}
                            checked={payment_received}
                            onChange={this.storeStatus}
                            color="primary"
                          />
                        }
                      />
                    </FormGroup>
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
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  innerForm: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  priceInputContainer: {
    marginLeft: theme.spacing.unit * 2,
  },
  stripeFormContainer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(PaymentForm));
