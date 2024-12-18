// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
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
  goToDetail: () => void,
};

export const VideoStatus = (props: Props) => {
  const { status } = props.video;
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  return (
    <div className={classes.container}>
      {status === VIDEO_STATUS_PROCESSED && (
        <Button
          className={classes.button}
          color="primary"
          onClick={props.goToDetail}
          // onClick={() => props.openStream(props.video)}
          variant="outlined"
        >
          <ArrowForwardIcon className={classes.leftIcon} />
          {t('video.status.processed')}
        </Button>
      )}
      {status === VIDEO_STATUS_PROCESSING && (
        <Button
          disabled
          className={classes.button}
          color="secondary"
          variant="outlined"
        >
          <HourglassEmptyIcon className={classes.leftIcon} />
          {t('video.status.processing')}
        </Button>
      )}
      {status === VIDEO_STATUS_ERROR && (
        <RedButton
          className={classes.button}
          onClick={() => props.openUpload(props.video)}
          variant="outlined"
        >
          <ErrorIcon className={classes.leftIcon} />
          {t('video.status.error')}
        </RedButton>
      )}
      {status === VIDEO_STATUS_CREATED && (
        <Button
          className={classes.button}
          color="secondary"
          onClick={() => props.openUpload(props.video)}
          variant="outlined"
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
