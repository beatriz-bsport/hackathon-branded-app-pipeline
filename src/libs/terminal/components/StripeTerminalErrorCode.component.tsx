import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  bold: {
    fontWeight: 'bold',
  },
}));

type Props = {
  error: any;
};

export const StripeTerminalPaymentError = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  if (!props.error.decline_code && !props.error.code) return null;
  return (
    <Typography className={classes.container}>
      <span className={classes.bold}>
        {t(
          'configuration.stripeTerminal.paymentDialog.paymentFailed.explain.label',
        )}
      </span>
      {props.error.decline_code
        ? ` ${t(`stripe:decline_code.${props.error.decline_code}`)}`
        : ` ${t(`stripe:errors.${props.error.code || 'none'}`)}`}
    </Typography>
  );
};

export default StripeTerminalPaymentError;
