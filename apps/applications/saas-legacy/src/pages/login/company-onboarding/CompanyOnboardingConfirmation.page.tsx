import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';
import CheckIcon from '@material-ui/icons/Check';
// @ts-expect-error
import { disconnect as disconnectAction } from '#src/actions/auth.actions';
import RedButton from '#src/components/button/RedButton.component';
import Config from '#src/config';
import { sleep } from '#src/utils/storybookHelper';
import { Alert } from '@material-ui/lab';

const CompanyOnboardingConfirmationPage: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation('login');
  const dispatch = useDispatch();

  const goToRoot = React.useCallback(() => {
    dispatch(push('/'));
  }, [dispatch]);

  const disconnect = React.useCallback(() => {
    dispatch(disconnectAction(goToRoot));
  }, [dispatch, goToRoot]);

  if (Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
    sleep(3000).then(() => {
      dispatch(goToRoot);
    });
  }

  return (
    <div className={classes.container}>
      <div className={classes.inner}>
        <CheckIcon className={classes.icon} color="primary" fontSize="large" />
        <Alert severity="warning">
          {t('signupCompany.confirmation.content.contactAccountManager')}
        </Alert>
        <Typography>{t('signupCompany.confirmation.content.core')}</Typography>

        <ul className={classes.list}>
          <li>
            <Typography>
              {t('signupCompany.confirmation.content.billing')}
            </Typography>
          </li>
          <li>
            <Typography>
              {t('signupCompany.confirmation.content.upsell')}
            </Typography>
          </li>
          <li>
            <Typography>
              {t('signupCompany.confirmation.content.emailValidation')}
            </Typography>
          </li>
        </ul>

        <Typography>{t('signupCompany.confirmation.content.help')}</Typography>

        <div className={classes.row}>
          <RedButton color="secondary" onClick={disconnect}>
            {t('signupCompany.confirmation.disconnect')}
          </RedButton>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'justify',
    gap: theme.spacing(2),
  },
  icon: {
    height: 160,
    width: 160,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    '& li': {
      listStyleType: 'disc',
    },
    marginInline: theme.spacing(2),
    gap: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    flex: 1,
    '&>*': {
      marginBottom: theme.spacing(5),
    },
  },
}));

export default React.memo(CompanyOnboardingConfirmationPage);
