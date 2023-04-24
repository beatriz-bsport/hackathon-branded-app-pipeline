// @ts-nocheck
import React, { useState } from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import './Login.css';
import { useTranslation, withTranslation } from 'react-i18next';

import { Theme } from '@material-ui/core/styles/createTheme';
import { Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import classNames from 'classnames';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import EmailIcon from '#components/icons/EmailIcon.component';
import ResendEmailForConfirmationDialog from './ResendEmailForConfirmationDialog.component';
import LoginTitle from './LoginTitle.component';

type Props = {
  goBackToLogin: () => void;
  sendEmailForConfirmation: (options: any) => void;
  lastTimeSentEmailConfirmation: string;

  isMobile: boolean;
};

export const EmailConfirmation = (props: Props) => {
  const { t } = useTranslation('login');
  const classes = useStyles();
  const theme = useTheme();

  const [resendEmailForConfirmation, setResendEmailForConfirmation] =
    useState(false);

  return (
    <div className={classes.content}>
      <div className={classes.topContainer}>
        <LoginTitle
          title={t('emailConfirmation.title')}
          isMobile={props.isMobile}
        />
      </div>
      <div className={classes.emailIconContainer}>
        <EmailIcon
          className={classes.emailIcon}
          fill={theme.palette.primary.main}
        />
      </div>
      <Typography
        variant="body1"
        className={classNames(classes.textExplain, {
          [classes.marginTopMobile]: props.isMobile,
        })}
      >
        {t('emailConfirmation.textExplain')}
      </Typography>
      <Button
        color="primary"
        onClick={props.goBackToLogin}
        className={classNames(classes.backButton, {
          [classes.marginTopMobile]: props.isMobile,
        })}
      >
        {t('emailConfirmation.backToLogin')}
      </Button>
      <div
        className={classNames(classes.bottomContainer, {
          [classes.marginTopMobile]: props.isMobile,
        })}
      >
        <Typography variant="caption">
          {t('emailConfirmation.notReceived')}
        </Typography>
        <div className={classes.secondLine}>
          <Button
            className={classes.clickHereButton}
            onClick={() => {
              setResendEmailForConfirmation(true);
            }}
          >
            <Typography variant="caption">
              {t('emailConfirmation.clickHere')}
            </Typography>
          </Button>
          <Typography variant="caption">
            {t('emailConfirmation.helperToSendOnceAgain')}
          </Typography>
        </div>
      </div>
      <ResendEmailForConfirmationDialog
        open={resendEmailForConfirmation}
        onClose={() => {
          setResendEmailForConfirmation(false);
        }}
        lastTimeSentEmailConfirmation={props.lastTimeSentEmailConfirmation}
        resendEmailForConfirmation={props.sendEmailForConfirmation}
      />
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
  topContainer: {
    maxWidth: '90%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailIcon: {
    color: theme.palette.primary.main,
  },
  emailIconContainer: {
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
  backButton: {
    marginTop: theme.spacing(7),
  },
  marginTopMobile: { marginTop: theme.spacing(2) },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10vh',
  },
  secondLine: {
    display: 'flex',
  },
  clickHereButton: {
    textTransform: 'none',
    padding: 0,
    alignItems: 'flex-start',
    color: theme.palette.primary.main,
    '&:hover': { backgroundColor: 'inherit' },
  },
}));

export default compose<any, Props>(withTranslation(['login']))(
  EmailConfirmation,
);
