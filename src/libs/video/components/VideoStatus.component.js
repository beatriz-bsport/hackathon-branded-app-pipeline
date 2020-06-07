// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import ErrorIcon from '@material-ui/icons/Error';
import { useTranslation } from 'react-i18next';

import RedButton from '../../../components/button/RedButton.component';

const VIDEO_STATUS_CREATED = 100;
const VIDEO_STATUS_PROCESSING = 200;
const VIDEO_STATUS_PROCESSED = 400;
const VIDEO_STATUS_ERROR = 0;

type Props = {
  video: Video,
  openUpload: (Video) => void,
  openStream: (Video) => void,
};

export const VideoStatus = (props: Props) => {
  const { status } = props.video;
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  return (
    <div className={classes.container}>
      {status === VIDEO_STATUS_PROCESSED && (
        <Button
          color="primary"
          variant="outlined"
          className={classes.button}
          onClick={() => props.openStream(props.video)}
        >
          <OndemandVideoIcon className={classes.leftIcon} />
          {t('video.status.processed')}
        </Button>
      )}
      {status === VIDEO_STATUS_PROCESSING && (
        <Button
          disabled
          color="secondary"
          variant="outlined"
          className={classes.button}
        >
          <HourglassEmptyIcon className={classes.leftIcon} />
          {t('video.status.processing')}
        </Button>
      )}
      {status === VIDEO_STATUS_ERROR && (
        <RedButton
          variant="outlined"
          className={classes.button}
          onClick={() => props.openUpload(props.video)}
        >
          <ErrorIcon className={classes.leftIcon} />
          {t('video.status.error')}
        </RedButton>
      )}
      {status === VIDEO_STATUS_CREATED && (
        <Button
          color="secondary"
          variant="outlined"
          className={classes.button}
          onClick={() => props.openUpload(props.video)}
        >
          <CloudUploadIcon className={classes.leftIcon} />
          {t('video.status.submitted')}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(1),
  },
  button: { width: '100%' },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default VideoStatus;
