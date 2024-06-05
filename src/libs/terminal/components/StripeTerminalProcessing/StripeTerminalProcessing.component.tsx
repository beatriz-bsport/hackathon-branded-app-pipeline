import React, { useState, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/lab/Alert';
import classNames from 'classnames';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { CancelReaderActionErrorMessage } from '#libs/terminal/types';
import InactivityWarning from './InactivityWarning.component';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 500,
    padding: theme.spacing(1),
  },
  bold: { fontWeight: 500 },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  circularProgress: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  greyColor: {
    color: theme.palette.text.disabled,
  },
  redButton: { color: theme.palette.error.main },
  errorText: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
  },
  bottomContainer: {
    width: '100%',
    textAlign: 'right',
  },
  dialogActions: {
    paddingBottom: 0,
  },
  paddingPlaceholder: {
    paddingTop: theme.spacing(2),
  },
  alertContainer: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export type Props = {
  onlySavePaymentMethod: boolean;
  onCancelReaderAction: () => void;
  cancelReaderActionProcessing: boolean;
  shouldDisplayInactivityWarning: boolean;
  onInactivityWarningFinish: () => void;
  onClickIAmHere: () => void;
  cancelErrorMessage: CancelReaderActionErrorMessage;
};

export const StripeTerminalProcessing: React.FC<Props> = ({
  onlySavePaymentMethod,
  onCancelReaderAction,
  cancelReaderActionProcessing,
  shouldDisplayInactivityWarning,
  onInactivityWarningFinish,
  onClickIAmHere,
  cancelErrorMessage,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('invoice');

  const translationKeyPath = `configuration.stripeTerminal.paymentDialog.${
    onlySavePaymentMethod ? 'processingSavePaymentMethod' : 'processing'
  }`;

  const [shouldDisplayInfoMessage, setShouldDisplayInfoMessage] =
    useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => !cancelErrorMessage && setShouldDisplayInfoMessage(true),
      30000,
    );
    return () => clearTimeout(timeoutId);
  }, [cancelErrorMessage]);

  return (
    <>
      <div className={classes.centerContainer}>
        {shouldDisplayInactivityWarning ? (
          <InactivityWarning onFinish={onInactivityWarningFinish} />
        ) : (
          <>
            <CircularProgress
              className={classNames(
                classes.circularProgress,
                classes.greyColor,
              )}
              size={24}
            />
            <Typography className={classes.title} variant="h4">
              {t(`${translationKeyPath}.title`)}
            </Typography>
            <Typography className={classes.content} variant="body1">
              {t(`${translationKeyPath}.content`)}
            </Typography>
          </>
        )}

        {!!cancelErrorMessage && (
          <div className={classes.alertContainer}>
            <Alert severity="error">
              <Typography className={classes.bold}>
                {t(cancelErrorMessage.title)}
              </Typography>
              <Typography variant="body2">
                {t(cancelErrorMessage.content)}
              </Typography>
            </Alert>
          </div>
        )}

        {shouldDisplayInfoMessage &&
          !cancelErrorMessage &&
          !shouldDisplayInactivityWarning && (
            <div className={classes.alertContainer}>
              <Alert severity="warning">
                <Typography className={classes.bold}>
                  {t(`${translationKeyPath}.help.title`)}
                </Typography>
                <Typography variant="body2">
                  {t(`${translationKeyPath}.help.content`)}
                </Typography>
              </Alert>
            </div>
          )}

        <div className={classes.paddingPlaceholder} />

        <div className={classes.bottomContainer}>
          <Divider />
          <DialogActions className={classes.dialogActions}>
            <Button
              disabled={cancelReaderActionProcessing || !!cancelErrorMessage}
              onClick={onCancelReaderAction}
            >
              {cancelReaderActionProcessing ? (
                <CircularProgress className={classes.greyColor} size={20} />
              ) : (
                t('common:cancel')
              )}
            </Button>

            {shouldDisplayInactivityWarning && (
              <Button
                disabled={cancelReaderActionProcessing}
                onClick={onClickIAmHere}
              >
                {t(
                  'configuration.stripeTerminal.paymentDialog.processing.inactivity.action',
                )}
              </Button>
            )}
          </DialogActions>
        </div>
      </div>
    </>
  );
};

export default React.memo(StripeTerminalProcessing);
