// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import './LoginBackground.css';
import Button from '@material-ui/core/Button';
import './Login.css';
import { useTranslation, withTranslation } from 'react-i18next';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import { Theme } from '@material-ui/core/styles/createTheme';
import { Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import LoginTitle from './LoginTitle.component';
import WelcomeIcon from '#components/icons/WelcomeIcon.component';
import { httpParser } from '#libs/marketplace/utils';

type Props = {
  companyName: string;
  urlRedirection: string;
  isMobile: boolean;
};

export const WelcomeComponent = (props: Props) => {
  const { t } = useTranslation('login');
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.content}>
      <LoginTitle
        title={t('welcome.title', { companyName: props.companyName })}
        isMobile={props.isMobile}
      />
      <div className={classes.welcomeIconContainer}>
        <WelcomeIcon
          className={classes.welcomeIcon}
          fill={theme.palette.primary.main}
        />
      </div>
      <Typography variant="body1" className={classes.textExplain}>
        {t('welcome.textExplain')}
      </Typography>
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          window.location.href = httpParser(props.urlRedirection);
        }}
        className={classes.beginButton}
      >
        {t('welcome.begin')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  welcomeIcon: {
    color: theme.palette.primary.main,
  },
  welcomeIconContainer: {
    display: 'flex',
    marginTop: '10vh',
    width: '110px',
    height: '110px',
    backgroundColor: lighten(theme.palette.primary.light, 0.4),
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textExplain: {
    marginTop: theme.spacing(6),
    maxWidth: '600px',
  },
  beginButton: {
    marginTop: theme.spacing(7),
    borderRadius: theme.spacing(4),
  },
}));

export default compose<any, Props>(withTranslation(['login']))(
  WelcomeComponent,
);
