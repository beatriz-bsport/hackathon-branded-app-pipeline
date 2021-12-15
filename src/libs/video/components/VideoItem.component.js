// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { useTranslation } from 'react-i18next';
import CoachGroupAvatar from '../../associated-coach/components/CoachGroupAvatar.component';
import { Video, VideoPurchase } from '../types';
import { getExpirationDate } from '../utils';

type Props = {
  openVideo: (id: number) => void,
  video: Video,
  purchasedVideo: VideoPurchase,
  loading: boolean,
  hideCoach: boolean,
};

export const VideoItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);

  let expiration_date = null;
  if (props.video.rental_days > 0 && props.purchasedVideo) {
    expiration_date = getExpirationDate({
      ...props.purchasedVideo,
      video: props.video,
    });
  }

  return (
    <div
      role="button"
      tabIndex={props.video.id}
      onClick={() => {
        if (props.openVideo) props.openVideo(props.video.id);
      }}
      onKeyDown={() => {
        if (props.openVideo) props.openVideo(props.video.id);
      }}
      className={classes.container}
    >
      <div className={classes.imageWrapper}>
        {props.loading ? (
          <Skeleton animatoin="wave" className={classes.media} />
        ) : (
          <img
            className={classes.media}
            src={props.video.cover_main}
            alt={props.video.name}
          />
        )}
        <div className={classes.mediaOverlay} />
      </div>
      <div className={classes.footer}>
        {props.loading ? (
          <Skeleton animation="wave" variant="text" />
        ) : (
          <Typography variant="h6">{props.video.name}</Typography>
        )}

        {!props.hideCoach && (
          <CoachGroupAvatar
            size="small"
            coaches={props.video.coaches}
            loading={props.loading}
          />
        )}
      </div>
      {expiration_date && (
        <Typography
          className={classes.typo}
          variant="body2"
          color="textSecondary"
        >
          {t(
            !props.purchasedVideo.available
              ? 'video.rental.expiredDate'
              : 'video.rental.expirationDate',
            {
              interpolation: {
                escapeValue: false,
              },
              expiration_date: expiration_date.format('L'),
            },
          )}
        </Typography>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    paddingBottom: '56.2%',
    overflow: 'hidden',
    border: '1px solid transparent',
    borderRadius: theme.spacing(1),
  },
  media: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    transition: 'all .3s',
    '&:hover': {
      transform: 'scale(1.2)',
      opacity: '0.7',
    },
  },
  footer: {
    padding: theme.spacing(0.6),
    '&>*': {
      paddingBottom: theme.spacing(0.5),
    },
  },
  skeletonContainer: {
    width: '100%',
    display: 'flex',
  },
  typo: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(0.6),
  },
}));

export default VideoItem;
