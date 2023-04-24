// @ts-nocheck
import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '@material-ui/core/Button';
import SadSmileyIcon from '#components/icons/SadSmileyIcon.component';

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
  smileyIcon: {
    height: '110px',
    width: '110px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  successTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  blueText: {
    color: theme.palette.info.main,
    marginBottom: theme.spacing(2),
  },
}));

type Props = {
  onCancel?: () => void;
  onRetry: () => void;
};

export const StripeTerminalUnexpectedDisconnect = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  return (
    <div className={classes.centerContainer}>
      <div className={classes.smileyIcon}>
        <SadSmileyIcon />
      </div>
      <Typography variant="h6" className={classes.successTitle}>
        {t('configuration.stripeTerminal.paymentDialog.disconnect.title')}
      </Typography>
      <Typography className={classes.blueText}>
        {t('configuration.stripeTerminal.paymentDialog.disconnect.content')}
      </Typography>
      <DialogActions>
        {props.onCancel && (
          <Button onClick={() => props.onCancel()}>{t('common:cancel')}</Button>
        )}
        <Button
          color="primary"
          variant="contained"
          onClick={() => props.onRetry()}
        >
          {t('configuration.stripeTerminal.connectDialog.form.retry')}
        </Button>
      </DialogActions>
    </div>
  );
};

export default StripeTerminalUnexpectedDisconnect;
