// @flow

import React from 'react';
import { withNamespaces } from 'react-i18next';
import {
  withStyles,
  Grid,
  Divider,
  Button,
  Typography,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import type { TFunction } from 'react-i18next';

import PriceInput from '../../../components/input/PriceInput.component';

type Props = {
  finalPrice: number,
  totalPayment: number,
  voucher: number,
  paymentItems: Array<{ id: number, text: string, amount: number }>,
  handlePaymentChange: (number) => (number) => void,
  handleVoucher: (number) => void,
  onSubmit: () => void,
  disabled: boolean,
  classes: Object,
  t: TFunction,
};

export function PaymentInfo(props: Props) {
  const {
    classes,
    t,
    paymentItems,
    finalPrice,
    totalPayment,
    voucher,
    handlePaymentChange,
    handleVoucher,
    onSubmit,
    disabled,
  } = props;
  return (
    <div>
      <div className={classes.paymentContainer}>
        {paymentItems.map((pi) => (
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography>{t(`payment.paymentMethods.${pi.text}`)}</Typography>
            </Grid>
            <Grid item>
              <PriceInput
                value={pi.amount}
                onChange={handlePaymentChange(pi.id)}
              />
            </Grid>
          </Grid>
        ))}

        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography>{t('payment.voucher')}</Typography>
          </Grid>
          <Grid item>
            <PriceInput value={voucher} onChange={handleVoucher} />
          </Grid>
        </Grid>
      </div>
      <Divider />
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        className={classes.finalPaymentLine}
      >
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            disabled={disabled}
          >
            <SaveIcon className={classes.iconLeft} />
            {t('common.save')}
          </Button>
        </Grid>
        <Grid item className={classes.totalInvoiceItemContainer}>
          <Typography variant="subtitle1">
            {t('form.quickInvoice.totalPurchase')} : {finalPrice}€
          </Typography>
        </Grid>
        <Grid
          item
          className={classes.totalPaymentContainer}
          style={
            totalPayment < finalPrice ? { backgroundColor: '#FFDDDD' } : {}
          }
        >
          <Typography variant="subtitle1">
            {`${t('form.quickInvoice.paymentDue')} : ${Math.max(
              0,
              finalPrice - totalPayment,
            )}€`}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = (theme) => ({
  paymentContainer: {
    padding: theme.spacing.unit * 2,
  },
  totalInvoiceItemContainer: {
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
  },
  finalPaymentLine: {
    padding: theme.spacing.unit,
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
  totalPaymentContainer: {
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
  },
});

export default withNamespaces()(withStyles(styles)(PaymentInfo));
