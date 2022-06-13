import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) => ({
  successTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(3),
  },
}));

type Props = {
  isSetupIntent: boolean;
  isProcessing: boolean;
};

export const StripeTerminalConnectingSuccess = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  return (
    <div>
      <Typography variant="h6" className={classes.successTitle}>
        {t('configuration.stripeTerminal.connectDialog.title.success')}
      </Typography>
      {props.isProcessing ? (
        <Typography>
          {t(
            'configuration.stripeTerminal.paymentDialog.connectionSuccess.processing',
          )}
        </Typography>
      ) : (
        <Typography>
          {t(
            `configuration.stripeTerminal.paymentDialog.connectionSuccess.${
              props.isSetupIntent ? 'intent' : 'payment'
            }`,
          )}
        </Typography>
      )}
      <DialogActions>
        <CircularProgress />
      </DialogActions>
    </div>
  );
};

export default StripeTerminalConnectingSuccess;
