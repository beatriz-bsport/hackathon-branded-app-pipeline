import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(9),
  },
  loadingTitle: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
}));

export const StripeTerminalPaymentDialogConnecting = () => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  return (
    <div className={classes.centerContainer}>
      <Typography align="center" className={classes.loadingTitle} variant="h6">
        {t('configuration.stripeTerminal.connectDialog.title.connect')}
      </Typography>
      <CircularProgress size={30} />
    </div>
  );
};

export default StripeTerminalPaymentDialogConnecting;
