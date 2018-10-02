// @flow
import React, { Component } from 'react';

import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  TextField,
  withStyles,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import { translate } from 'react-i18next';

import { CASH } from 'bsport-commons/lib/master-data/payment-methods';

import PriceInput from '../input/PriceInput.component';
import PaymentMethodInput from '../input/PaymentMethodInput.component';

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
  onSubmit: (formData: PaymentFormData) => void,
};

type State = {
  status: boolean,
  paymentMethod: ?number,
  price: ?number,
  paymentInfoExtra: string,
};

export class PaymentForm extends Component<Props, State> {
  state = {
    status: true,
    paymentMethod: CASH.id,
    price: null,
    paymentInfoExtra: '',
  };

  onSubmit = (event: Object) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  storePrice = (event: Object) => {
    const price = event.target.value;
    this.setState({ price });
  };

  storePaymentMethod = (paymentMethod: number) => {
    this.setState({ paymentMethod });
  };

  storePaymentInfoExtra = (event: Object) => {
    this.setState({ paymentInfoExtra: event.target.value });
  };

  storeStatus = (event: Object) => {
    this.setState({ status: event.target.value });
  };

  render() {
    const { t, classes } = this.props;
    const { status, price, paymentMethod, paymentInfoExtra } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <Grid container direction="row" alignItems="baseline" spacing={8}>
          <Grid item>
            <FormControl>
              <InputLabel shrink htmlFor="paymentMethod-helper">
                {t('form.payment.status')}
              </InputLabel>
              <Select value={status} onChange={this.storeStatus}>
                <MenuItem value>
                  <Grid container alignItems="center">
                    <Grid item>
                      <CheckIcon color="primary" className={classes.leftIcon} />
                    </Grid>
                    <Grid item>{t('form.payment.paid')}</Grid>
                  </Grid>
                </MenuItem>
                <MenuItem value={false}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <CancelIcon className={classes.leftIcon} />
                    </Grid>
                    <Grid item>{t('form.payment.unpaid')}</Grid>
                  </Grid>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <PriceInput
              label={t('common.amount')}
              value={price}
              onChange={this.storePrice}
              required
            />
          </Grid>
          <Grid item>
            <PaymentMethodInput
              value={paymentMethod}
              onChange={this.storePaymentMethod}
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label={t('form.payment.additionalInformationLabel')}
              helperText={t('form.payment.additionalInformationHelper')}
              value={paymentInfoExtra}
              onChange={this.storePaymentInfoExtra}
              fullWidth
            />
          </Grid>
          <Grid item>
            <IconButton type="submit" color="primary">
              <AddCircleIcon />
            </IconButton>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default withStyles(styles)(translate()(PaymentForm));
