import React, { useEffect, useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogContentText,
  Typography,
  DialogContent,
  DialogActions,
  DialogTitle,
  Dialog,
  CircularProgress,
} from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import AccountConfigurationStepper from './AccountConfigurationStepper.component';
import { buildSteps } from './utils';
import InfoBox from './InfoBox.component';
import SuccessBox from './SuccessBox.component';

type OwnProps = {
  companyName: string;
  companyAdress?: string;
  companyStripeName?: string;
  goNext: () => void;
  redirectToStripe: () => void;
  error: Error;
  success: boolean;
  labelGoNext?: string;
  has_no_need_for_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
};
type Props = OwnProps;
export const AccountConfigurationStripeStep: React.FC<Props> = ({
  companyName,
  companyAdress,
  companyStripeName,
  error,
  success,
  labelGoNext,
  has_no_need_for_stripe_configuration,
  has_no_need_for_bank_account_configuration,
  has_no_need_for_payment_method_configuration,
  goNext,
  redirectToStripe,
}) => {
  const { t } = useTranslation(['login', 'common']);
  const classes = useStyles();
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [waitingForRedirection, setWaitingForRedirection] = useState(false);
  useEffect(() => {
    if (waitingForRedirection) {
      redirectToStripe();
    }
  }, [waitingForRedirection, redirectToStripe]);

  const steps = React.useMemo(() => {
    return buildSteps({
      has_no_need_for_stripe_configuration,
      has_visited_stripe_configuration: true,
      has_no_need_for_bank_account_configuration,
      has_visited_bank_account_configuration: false,
      has_no_need_for_payment_method_configuration,
      has_visited_payment_method_configuration: false,
      has_visited_invoice_numbering_step: false,
      no_last_step: false,
      has_visited_last_step: false,
    });
  }, [
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
  ]);

  if (error) {
    return (
      <div className={classes.container}>
        <Warning fontSize="large" />
        <Typography>{t('login:companyOnboarding.error')}</Typography>
      </div>
    );
  }
  return (
    <>
      <div className={classes.content}>
        <AccountConfigurationStepper
          className={classes.stepper}
          steps={steps}
        />
        <Typography variant="h4">
          {t('login:accountConfiguration.createStripe')}
        </Typography>
        <Typography className={classes.subtitle}>
          {t('login:accountConfiguration.configureStripe')}
        </Typography>
        <Typography variant="subtitle2">
          {t('login:accountConfiguration.companyName')}
        </Typography>
        <Typography className={classes.companyInfo} variant="body2">
          {companyName}
        </Typography>
        {companyAdress && (
          <>
            <Typography variant="subtitle2">
              {t('login:accountConfiguration.companyAdress')}
            </Typography>
            <Typography className={classes.companyInfo}>
              {companyAdress}
            </Typography>
          </>
        )}
        {!!companyStripeName?.length && (
          <>
            <Typography variant="subtitle2">
              {t('login:accountConfiguration.companyStripeName')}
            </Typography>
            <Typography className={classes.companyInfo} variant="body2">
              {companyStripeName}
            </Typography>
          </>
        )}
        {success ? (
          <SuccessBox
            content={t('login:accountConfiguration.accountSuccess')}
          />
        ) : (
          <Button
            className={classes.roundButton}
            color="primary"
            onClick={() => {
              setIsStripeModalOpen(true);
            }}
            variant="outlined"
          >
            {t('login:accountConfiguration.configureStripeAction')}
          </Button>
        )}
        <InfoBox />
        <div className={classes.action}>
          <Button
            color="primary"
            disabled={!success}
            onClick={goNext}
            variant="contained"
          >
            {labelGoNext || t('common:next')}
          </Button>
        </div>
      </div>
      <Dialog maxWidth={false} open={isStripeModalOpen}>
        {waitingForRedirection ? (
          <div className={classes.redirectionContainer}>
            <div>
              <CircularProgress className={classes.progress} size={60} />
            </div>
            <Typography variant="h4">
              {t('login:accountConfiguration.redirecting')}
            </Typography>
          </div>
        ) : (
          <>
            <DialogTitle>
              {t('login:accountConfiguration.stripeConfiguration')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText className={classes.dialogContent}>
                {t('login:accountConfiguration.stripeConfigurationExplain')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => setIsStripeModalOpen(false)}
              >
                {t('common:cancel')}
              </Button>
              <Button
                color="primary"
                onClick={() => setWaitingForRedirection(true)}
                variant="contained"
              >
                {t('common:selector.validate')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  dialogContent: { maxWidth: theme.breakpoints.values.sm },
  redirectionContainer: {
    padding: theme.spacing(8),
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyInfo: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    gap: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  roundButton: {
    borderRadius: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    marginTop: theme.spacing(20),
    marginLeft: '20%',
    marginRight: '20%',
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10%',
      marginRight: '10%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
      backgroundColor: 'unset',
      boxShadow: 'unset',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(10),
      marginLeft: '4px',
      marginRight: '4px',
    },
  },

  stepper: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingBottom: theme.spacing(4),
      marginBottom: 'unset',
    },
  },
}));
export default AccountConfigurationStripeStep;
