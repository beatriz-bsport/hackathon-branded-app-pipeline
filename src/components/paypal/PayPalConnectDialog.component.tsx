import React, { useEffect, useState } from 'react';
import AlertTitle from '@material-ui/lab/AlertTitle';

import { useTranslation } from 'react-i18next';

import {
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

type Props = {
  onCancel: () => void;
  dialogOpen: boolean;
  paypalOnboardingLink: string;
  paypalOnboardingLinkLoading?: boolean;
  fetchPayPalOnboardingLink?: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountInformation: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
    },
    redirectionContainer: {
      padding: theme.spacing(7),
      display: 'flex',
      gap: theme.spacing(3),
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export const PayPalConnectDialog: React.FC<Props> = (props: Props) => {
  const {
    paypalOnboardingLink,
    paypalOnboardingLinkLoading,
    onCancel,
    dialogOpen,
    fetchPayPalOnboardingLink,
  }: Props = props;

  const { t } = useTranslation(['settings']);
  const classes = useStyles();

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (paypalOnboardingLink && !paypalOnboardingLinkLoading) {
      // Redirection to PayPal seems to take almost a second, and without this redirection, the loading spinner is not shown anymore, making the UX a bit weird.
      setRedirecting(true);
      window.location.href = paypalOnboardingLink;
    }
  }, [paypalOnboardingLink, paypalOnboardingLinkLoading]);

  return (
    <Dialog open={dialogOpen} scroll="paper">
      {paypalOnboardingLinkLoading || redirecting ? (
        <div className={classes.redirectionContainer}>
          <CircularProgress size={60} />
          <Typography variant="h4">
            {t('company.paypal.dialog.redirecting')}
          </Typography>
        </div>
      ) : (
        <>
          <DialogTitle>{t('company.paypal.dialog.title')}</DialogTitle>
          <DialogContent>
            <form className={classes.accountInformation}>
              <Alert
                className={classes.alert}
                severity="warning"
                variant="standard"
              >
                <AlertTitle>
                  {t('company.paypal.alert.rightAccount.title')}
                </AlertTitle>
                {t('company.paypal.alert.rightAccount.content')}
              </Alert>
              <Typography variant="body1">
                {t('company.paypal.dialog.helper')}
              </Typography>
              <DialogActions>
                <Button onClick={onCancel}>
                  {t('company.paypal.dialog.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={fetchPayPalOnboardingLink}
                  type="button"
                >
                  {t('company.paypal.dialog.startConnecting')}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default React.memo(PayPalConnectDialog);
