// @flow
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import { withTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import PAYMENT_METHODS from '@bsport/common/lib/master-data/payment-methods';
import { getCurrencyDisplay } from '../../libs/theme/selectors';

const styles = (theme) => ({
  container: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(1),
  },
  field: {},
});

type Props = {
  t: (x: string) => string,
  classes: Object,
  payment: PaymentFormData,
  onDelete: () => void,
};

export function PaymentSummary(props: Props) {
  const { payment, t, classes, onDelete } = props;
  const { price, status, paymentMethod, paymentInfoExtra } = payment;
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={classes.container}
    >
      <Grid item xs={1}>
        {status ? (
          <CheckIcon color="secondary" />
        ) : (
          <CancelIcon color="secondary" />
        )}
      </Grid>
      <Grid item xs={4} md={2}>
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          className={classes.field}
        >
          <Typography>{`${price} ${getCurrencyDisplay()}`}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={6} md={3}>
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          className={classes.field}
        >
          <Typography>
            {t(
              `paymentMethods.${
                PAYMENT_METHODS.filter((pm) => pm.id === paymentMethod)[0].text
              }`,
            )}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={10} md={5}>
        <Grid
          container
          item
          alignItems="center"
          justify="flex-start"
          className={classes.field}
        >
          <Typography>
            {paymentInfoExtra || t('form.payment.noPaymentExtraInfo')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={1} md={1}>
        <IconButton onClick={onDelete} color="secondary">
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(withTranslation()(PaymentSummary));
