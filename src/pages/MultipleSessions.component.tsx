import React from 'react';
import { compose } from 'recompose';

import { makeStyles } from '@material-ui/styles';
import { Button, Card, Theme, Typography } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RoomIcon from '@material-ui/icons/Room';

export type OwnProps = {
  previousName: string;
  currentName: string;
  previousStatus: 'franchisor' | 'manager' | '';
  currentStatus: 'franchisor' | 'manager' | '';
  restoreSession: () => void;
  updateSession?: () => void;
};

type Props = OwnProps & WithTranslation;

export const MultipleSessionDetails = (props: Props) => {
  const {
    previousName,
    currentName,
    restoreSession,
    updateSession,
    previousStatus,
    currentStatus,
    t,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <InfoIcon fontSize="large" className={classes.icon} color="disabled" />
        <Typography variant="h4">{t('multiSession.title')}</Typography>
      </div>
      <div className={classes.innerContainer}>
        <Card className={classes.sessionContainer}>
          <div className={classes.subtitle}>
            <ArrowBackIcon className={classes.icon} color="disabled" />
            <Typography className={classes.bold} variant="h6">
              {t('multiSession.previous')}
            </Typography>
          </div>
          <Typography variant="body1">
            {t('multiSession.previousSession', {
              name: previousName,
            })}
            <span className={classes.bold}>
              {previousStatus === 'franchisor' &&
                `  (${t('multiSession.franchisor')})`}
              {previousStatus === 'manager' &&
                ` (${t('multiSession.manager')})`}
            </span>
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={restoreSession}
            className={classes.button}
          >
            {t('multiSession.restore')}
          </Button>
        </Card>

        {updateSession && (
          <Card className={classes.sessionContainer}>
            <div className={classes.subtitle}>
              <RoomIcon className={classes.icon} color="disabled" />
              <Typography className={classes.bold} variant="h6">
                {t('multiSession.current')}
              </Typography>
            </div>
            <Typography variant="body1">
              {t('multiSession.currentSession', {
                name: currentName,
              })}
              <span className={classes.bold}>
                {currentStatus === 'franchisor' &&
                  `  (${t('multiSession.franchisor')})`}
                {currentStatus === 'manager' &&
                  ` (${t('multiSession.manager')})`}
              </span>
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              onClick={updateSession}
              className={classes.button}
            >
              {t('multiSession.continue')}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  restoreSession: {
    marginRight: theme.spacing(4),
  },
  sessionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: theme.spacing(1),
    width: '100%',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    maxWidth: 500,
  },
  button: {
    marginTop: theme.spacing(2),
    alignSelf: 'flex-end',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

export default compose(withTranslation(['navigation']))(MultipleSessionDetails);
