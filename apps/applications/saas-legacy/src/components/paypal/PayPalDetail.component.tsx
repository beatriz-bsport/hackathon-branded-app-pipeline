import AlertTitle from '@material-ui/lab/AlertTitle';
import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { PAYPAL_API_EXCEPTION } from '@bsport/common/master-data/error-codes/payment.js';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import PAYPAL_LOGO from '#src/libs/payment/icons/paypal.png';
import {
  PAYPAL_CONNECTED,
  PAYPAL_NOT_CONNECTED,
  PAYPAL_PRIMARY_EMAIL_CONFIRMATION,
  PAYPAL_REQUIRES_MORE_INFORMATION,
  PAYPAL_ISSUE_CHECK_ACCOUNT,
  PAYPAL_ISSUE_REPEAT_ONBOARDING,
  PAYPAL_CONNECTED_WITHOUT_VAULTING,
} from '#src/libs/company/constants';
import PayPalConnectDialog from './PayPalConnectDialog.component';
import type { OptionCallback } from '../../state/types';
import PayPalConnectionIssueAlert from './PayPalConnectionIssueAlert.component';
import PayPalConnectionStatusChip from './PayPalConnectionStatusChip.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      height: 24,
    },
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
    },
    fitContent: {
      width: 'fit-content',
    },
    accountInformation: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
    gridContainer: {
      margin: theme.spacing(2),
    },
    notConnectedSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
    lowGap: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(3),
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
      padding: theme.spacing(2),
      margin: theme.spacing(1.5),
      width: '100%',
    },
  }),
);

type Props = {
  accountEmail?: string;
  accountName?: string;
  fetchPayPalOnboardingLink?: (
    option: OptionCallback<{ onboarding_url: string }>,
  ) => void;
  status?: string;
  error?: Error;
  paypalOnboardingLinkLoading?: boolean;
  paypalOnboardingLinkRedirecting?: boolean;
};

export const PayPalDetail: React.FC<Props> = (props: Props) => {
  const {
    accountEmail,
    accountName,
    fetchPayPalOnboardingLink,
    status,
    error,
    paypalOnboardingLinkRedirecting,
    paypalOnboardingLinkLoading,
  }: Props = props;

  const { t } = useTranslation(['settings']);
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);

  const requiringActionStatuses = [
    PAYPAL_PRIMARY_EMAIL_CONFIRMATION,
    PAYPAL_REQUIRES_MORE_INFORMATION,
    PAYPAL_ISSUE_CHECK_ACCOUNT,
    PAYPAL_ISSUE_REPEAT_ONBOARDING,
  ];

  const isConnectedWithNoIssue = [
    PAYPAL_CONNECTED,
    PAYPAL_CONNECTED_WITHOUT_VAULTING,
  ].includes(status);
  // isStatusUnknown if we cannot reach PayPal for some reason. In that case, we don't want to show wrong information to the manager and we don't show the connection button.
  const isStatusUnknown =
    // @ts-expect-error
    error?.response?.data?.error_code === PAYPAL_API_EXCEPTION;
  const isNotConnected =
    (!status && !isStatusUnknown) || status === PAYPAL_NOT_CONNECTED;
  const isConnectedWithIssue = requiringActionStatuses.includes(status);

  const showConnectPayPalAccount =
    (!status && !isStatusUnknown) ||
    [PAYPAL_ISSUE_REPEAT_ONBOARDING, PAYPAL_NOT_CONNECTED].includes(status);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const openDialog = () => {
    setDialogOpen(true);
  };
  const fetchPayPalOnboardingLinkCallback = useCallback(() => {
    fetchPayPalOnboardingLink({
      onError: closeDialog,
      onSuccess: (response) => {
        window.open(response?.onboarding_url, '_self');
      },
    });
  }, [fetchPayPalOnboardingLink, closeDialog]);

  return (
    <div className={classes.container}>
      <Grid container direction="column" spacing={3}>
        <Grid container>
          <div className={classes.paper}>
            <div className={classes.row}>
              <img alt="paypal" className={classes.icon} src={PAYPAL_LOGO} />
              <PayPalConnectionStatusChip
                isConnectedWithIssue={isConnectedWithIssue}
                isConnectedWithNoIssue={isConnectedWithNoIssue}
                isNotConnected={isNotConnected}
                isStatusUnknown={isStatusUnknown}
              />
            </div>
            {isNotConnected && (
              <Typography color="textSecondary" variant="body1">
                {t('company.paypal.linkHelper')}
              </Typography>
            )}
            {(isConnectedWithIssue || isConnectedWithNoIssue) && (
              <div className={classes.accountInformation}>
                <div>
                  <Typography variant="h6">Account name</Typography>
                  <Typography color="textSecondary" variant="body1">
                    {accountName}
                  </Typography>
                </div>
                <div>
                  <Typography variant="h6">Account email</Typography>
                  <Typography color="textSecondary" variant="body1">
                    {accountEmail}
                  </Typography>
                </div>
              </div>
            )}
            {isNotConnected && (
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
            )}
            {(isConnectedWithIssue || isStatusUnknown) && (
              <PayPalConnectionIssueAlert
                isStatusUnknown={isStatusUnknown}
                status={status}
              />
            )}
            {showConnectPayPalAccount && (
              <Button
                className={classes.fitContent}
                color="primary"
                onClick={openDialog}
                variant="contained"
              >
                {t('company.paypal.connect')}
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
      <PayPalConnectDialog
        dialogOpen={dialogOpen}
        fetchPayPalOnboardingLink={fetchPayPalOnboardingLinkCallback}
        onCancel={closeDialog}
        paypalOnboardingLinkLoading={paypalOnboardingLinkLoading}
        paypalOnboardingLinkRedirecting={paypalOnboardingLinkRedirecting}
      />
    </div>
  );
};

export default PayPalDetail;
