// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

type Props = { goNext: () => void };

const CompanyOnboardingWelcomePage = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['login']);
  return (
    <div className={classes.container}>
      <Typography variant="h4">{t('signupCompany.welcome.title')}</Typography>
      <Typography align="left">{t('signupCompany.welcome.content')}</Typography>
      <div className={classes.actions}>
        <ButtonGroup color="primary">
          <Button onClick={props.goNext}>
            {t('signupCompany.welcome.next')}
            <ArrowForwardIcon className={classes.iconRight} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    '&>*': {
      marginBottom: theme.spacing(3),
    },
  },
}));

export default connect(
  null,
  { goNext: () => push('/login/company_onboarding/form') },
)(CompanyOnboardingWelcomePage);
