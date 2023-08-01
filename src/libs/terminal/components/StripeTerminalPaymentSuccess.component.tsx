import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ValidationIcon from '#components/icons/ValidationIcon.component';

const useStyles = makeStyles((theme: Theme) => ({
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  loadingTitle: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
  validateIcon: {
    height: '110px',
    width: '110px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  successTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  errorMessage: {
    color: theme.palette.error.dark,
  },
}));

type Props = {
  isSetupIntent: boolean;
  onlySavePaymentMethod: boolean;
};

export const StripeTerminalPaymentSuccess = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);
  let translationKey;

  if (!props.isSetupIntent) {
    translationKey = 'payment';
  } else if (props.onlySavePaymentMethod) {
    translationKey = 'setupOnly';
  } else {
    translationKey = 'setupAndPlan';
  }

  return (
    <div className={classes.centerContainer}>
      <div className={classes.validateIcon}>
        <ValidationIcon color="#4CAF50" />
      </div>
      <Typography className={classes.successTitle} variant="h6">
        {t(
          `configuration.stripeTerminal.paymentDialog.paymentSuccess.title.${translationKey}`,
        )}
      </Typography>
      {!props.isSetupIntent && (
        <Typography>
          {t(
            `configuration.stripeTerminal.paymentDialog.paymentSuccess.content.${translationKey}`,
          )}
        </Typography>
      )}
      <Typography>
        {t(
          'configuration.stripeTerminal.paymentDialog.paymentSuccess.content.wait',
        )}
      </Typography>
    </div>
  );
};

export default StripeTerminalPaymentSuccess;
