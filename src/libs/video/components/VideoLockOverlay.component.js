// @flow

import React from 'react';

import LockIcon from '@material-ui/icons/Lock';
import UnlockIcon from '@material-ui/icons/LockOpen';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';

type Props = {
  accessDenied: boolean,
  authenticated: boolean,
  requestVideoAccess: () => void,
  isEbook: boolean,
};

export const VideoLockOverlay = (props: Props) => {
  const { authenticated, accessDenied, requestVideoAccess } = props;
  const { t } = useTranslation(['video']);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <LockIcon className={classes.lockIcon} />
      <Typography align="center" className={classes.lockText}>
        {!authenticated && t('video.lock.pleaseAuthenticated')}
        {props.authenticated &&
          accessDenied &&
          (props.isEbook
            ? t('video.lock.accessDeniedEbook')
            : t('video.lock.accessDenied'))}
      </Typography>
      <div className={classes.buttonRow}>
        {!!props.requestVideoAccess && (
          <Button
            color="primary"
            onClick={() => {
              requestVideoAccess();
            }}
            variant="contained"
          >
            <UnlockIcon className={classes.iconLeft} />
            {t('video.lock.useConsumerPass')}
          </Button>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  lockText: {
    color: 'white',
    marginTop: theme.spacing(2),
  },
  lockIcon: {
    color: 'white',
    height: 64,
    width: 64,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    '&>*': {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  },
}));

export default VideoLockOverlay;
