import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AlertIcon from '@material-ui/icons/Warning';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  stripeOnboardingPending: boolean;
};

const BillingBanner = (props: Props) => {
  const { t } = useTranslation(['navigation']);
  const classes = useStyles();

  if (!props.stripeOnboardingPending) return null;

  return (
    <div className={classes.paymentMissingContainer}>
      <ButtonBase
        onClick={() => {
          document.location.pathname = '/settings/company_onboarding';
        }}
        className={classes.errorBanner}
      >
        <div className={classes.text}>
          <AlertIcon fontSize="small" />
          <Typography align="left" variant="caption">
            {t('stripeOnboardingPending.banner')}
          </Typography>
        </div>
      </ButtonBase>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paymentMissingContainer: {
    left: 0,
    right: 0,
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    marginTop: theme.spacing(-2),
    paddingBottom: theme.spacing(2),
    zIndex: 999,
  },
  errorBanner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.dark,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  text: {
    color: '#FEFEFE',
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1) / 4,
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
}));

export default BillingBanner;
