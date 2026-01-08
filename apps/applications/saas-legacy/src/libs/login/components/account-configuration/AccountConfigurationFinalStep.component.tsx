import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import chroma from 'chroma-js';
import SuccessIcon from '#src/components/icons/SuccessIcon.component';
import { buildSteps } from './utils';
import AccountConfigurationStepper from './AccountConfigurationStepper.component';

type OwnProps = {
  goNext: () => void;
  has_no_need_for_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
};
type Props = OwnProps;
export const AccountConfigurationFinalStep: React.FC<Props> = ({
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
      has_visited_stripe_configuration: true,
      has_no_need_for_bank_account_configuration,
      has_visited_bank_account_configuration: true,
      has_no_need_for_payment_method_configuration,
      has_visited_payment_method_configuration: true,
      has_visited_invoice_numbering_step: true,
      no_last_step: false,
      has_visited_last_step: true,
    });
  }, [
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
  ]);
  return (
    <>
      <div className={classes.welcomeContent}>
        <div className={classes.row}>
          <SuccessIcon className={clsx(classes.iconLeft, classes.largeIcon)} />
          <Typography variant="h3">
            {t('accountConfiguration.congrats')}
          </Typography>
        </div>
        <Typography className={classes.subtitle} variant="h5">
          {t('accountConfiguration.finishExplain')}
        </Typography>
        <AccountConfigurationStepper
          className={classes.stepper}
          steps={steps}
          variant="verticalOnMobile"
        />
        <div className={clsx(classes.blueBox, classes.limitedWidth)}>
          <InfoOutlined className={clsx(classes.iconLeft, classes.blueIcon)} />
          <Typography>{t('accountConfiguration.goToBackoffice')}</Typography>
        </div>
        <div className={classes.action}>
          <Button color="primary" onClick={goNext} variant="contained">
            {t('common:letsGo')}
          </Button>
        </div>
      </div>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  row: { display: 'flex', alignItems: 'center' },
  blueIcon: {
    color: theme.palette.info.main,
  },
  subtitle: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  largeIcon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  blueBox: {
    display: 'flex',
    backgroundColor: '#EAF4FC',
    padding: theme.spacing(2),
    alignItems: 'center',
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

  primary: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
  iconPrimary: {
    fill: theme.palette.primary.main,
  },
  stepper: {
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(7),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  welcomeContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
    marginTop: theme.spacing(20),
    marginLeft: '20%',
    marginRight: '20%',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
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
      marginLeft: '4px',
      marginRight: '4px',
      marginBottom: theme.spacing(10),
    },
  },
}));
export default AccountConfigurationFinalStep;
