import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Typography } from '@material-ui/core';
import AccountConfigurationStepper from './AccountConfigurationStepper.component';
import { buildSteps } from './utils';

type OwnProps = {
  goNext: () => void;
  has_no_need_for_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
};
type Props = OwnProps;
export const AccountConfigurationWelcomeStep: React.FC<Props> = ({
  goNext,
  has_no_need_for_stripe_configuration,
  has_no_need_for_bank_account_configuration,
  has_no_need_for_payment_method_configuration,
}) => {
  const { t } = useTranslation(['login', 'common']);
  const classes = useStyles();

  const steps = React.useMemo(() => {
    return buildSteps({
      has_no_need_for_stripe_configuration,
      has_visited_stripe_configuration: false,
      has_no_need_for_bank_account_configuration,
      has_visited_bank_account_configuration: false,
      has_no_need_for_payment_method_configuration,
      has_visited_payment_method_configuration: false,
      has_visited_invoice_numbering_step: false,
      no_last_step: true,
      has_visited_last_step: false,
    });
  }, [
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
  ]);
  if (!goNext) {
    return null;
  }
  return (
    <div className={classes.welcomeContent}>
      <Typography variant="h2">
        {t('accountConfiguration.welcomeTitle')}
      </Typography>
      <Typography className={classes.description} variant="h5">
        {t('accountConfiguration.welcomeDescription')}
      </Typography>
      <Typography variant="h6">
        {t('accountConfiguration.welcomeConfigure', {
          numberOfSteps: steps.length,
          count: steps.length,
        })}
      </Typography>
      <AccountConfigurationStepper
        noTitleGrey
        className={classes.stepper}
        steps={steps}
        variant="verticalOnMobile"
      />

      <div className={classes.action}>
        <Button color="primary" onClick={goNext} variant="contained">
          {t('common:start')}
        </Button>
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  subtitle: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    gap: theme.spacing(1),
    marginTop: theme.spacing(4),
  },

  stepper: {
    justifyContent: 'flex-start',
    maxWidth: theme.spacing(80),
    marginTop: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  welcomeContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
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
}));
export default AccountConfigurationWelcomeStep;
