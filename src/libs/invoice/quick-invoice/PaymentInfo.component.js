// @flow

import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

import PriceInput from '../../../components/input/PriceInput.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  finalPrice: number,
  totalPayment: number,
  paymentItems: Array<{ id: number, text: string, amount: number }>,
  handlePaymentChange: (number) => (number) => void,
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
    handlePaymentChange,
    onSubmit,
    onClose,
    disabled,
  } = props;
  return (
    <div>
      <div className={classes.paymentContainer}>
        {paymentItems.map((pi) => (
          <Grid
            key={pi.id}
            container
            alignItems="center"
            direction="row"
            justify="space-between"
          >
            <Grid item>
              <Typography>{t(`payment.paymentMethods.${pi.text}`)}</Typography>
            </Grid>
            <Grid item>
              <PriceInput
                onChange={handlePaymentChange(pi.id)}
                value={pi.amount}
              />
            </Grid>
          </Grid>
        ))}
      </div>
      <Divider />
      <Grid
        container
        alignItems="center"
        className={classes.finalPaymentLine}
        direction="row"
        justify="space-between"
      >
        <Grid item>
          <Typography variant="subtitle1">
            {t('form.quickInvoice.totalPurchase')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="button">
            {getCurrencyDisplayWithPrice(finalPrice.toFixed(2))}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        className={classes.finalPaymentLine}
        direction="row"
        justify="space-between"
      >
        <Grid item>
          <Typography variant="subtitle1">
            {t('form.quickInvoice.paymentDue')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            gutterBottom
            style={totalPayment < finalPrice ? { color: '#e57373' } : {}}
            variant="button"
          >
            {getCurrencyDisplayWithPrice(
              (finalPrice - totalPayment).toFixed(2),
            )}
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        alignItems="center"
        className={classes.buttonsWrapper}
        direction="row"
        justify="flex-end"
      >
        <Grid item className={classes.padding}>
          <Button color="secondary" onClick={onClose} variant="outlined">
            <CancelIcon className={classes.iconLeft} />
            {t('common.cancel')}
          </Button>
        </Grid>

        <Grid item className={classes.padding}>
          <Button
            color="primary"
            disabled={disabled}
            onClick={onSubmit}
            variant="outlined"
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

export default withTranslation()(withStyles(styles)(PaymentInfo));
