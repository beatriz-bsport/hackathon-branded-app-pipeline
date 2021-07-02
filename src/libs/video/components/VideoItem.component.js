// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import CoachGroupAvatar from '../../associated-coach/components/CoachGroupAvatar.component';

type Props = {
  openVideo: (id: number) => void,
  video: Video,
  loading: boolean,
  hideCoach: boolean,
};

export const VideoItem = (props: Props) => {
  const classes = useStyles();
  return (
    <div
      role="button"
      tabIndex={props.video.id}
      onClick={() => props.openVideo(props.video.id)}
      onKeyDown={() => props.openVideo(props.video.id)}
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
}));

export default VideoItem;
