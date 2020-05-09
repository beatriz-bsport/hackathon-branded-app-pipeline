// @flow

import React from 'react';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
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
  onClose: () => void,
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
    onClose,
    disabled,
  } = props;
  return (
    <div>
      <div className={classes.paymentContainer}>
        {paymentItems.map((pi) => (
          <Grid
            container
            key={pi.id}
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
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.finalPaymentLine}
      >
        <Grid item>
          <Typography variant="subtitle1">
            {t('form.quickInvoice.totalPurchase')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" gutterBottom>
            {finalPrice.toFixed(2)} €
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.finalPaymentLine}
      >
        <Grid item>
          <Typography variant="subtitle1">
            {t('form.quickInvoice.paymentDue')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="button"
            gutterBottom
            style={totalPayment < finalPrice ? { color: '#e57373' } : {}}
          >
            {(finalPrice - totalPayment).toFixed(2)} €
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        className={classes.buttonsWrapper}
      >
        <Grid item className={classes.padding}>
          <Button color="secondary" variant="outlined" onClick={onClose}>
            <CancelIcon className={classes.iconLeft} />
            {t('common.cancel')}
          </Button>
        </Grid>

        <Grid item className={classes.padding}>
          <Button
            color="primary"
            variant="outlined"
            onClick={onSubmit}
            disabled={disabled}
          >
            <SaveIcon className={classes.iconLeft} />
            {t('common.save')}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = (theme) => ({
  paymentContainer: {
    padding: theme.spacing(2),
  },
  finalPaymentLine: {
    padding: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  buttonsWrapper: {
    padding: theme.spacing(1),
  },
  padding: {
    padding: theme.spacing(1),
  },
});

export default withNamespaces()(withStyles(styles)(PaymentInfo));
