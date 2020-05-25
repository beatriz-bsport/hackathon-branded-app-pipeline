// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import CoachGroupAvatar from '../../associated-coach/components/CoachGroupAvatar.component';

type Props = {};

export const VideoItem = (props: Props) => {
  const classes = useStyles();
  return (
    <div
      onClick={() => props.openVideo(props.video.id)}
      disableRipple
      className={classes.container}
    >
      <div className={classes.imageWrapper}>
        <img
          className={classes.media}
          src={props.video.cover_main}
          alt={props.video.name}
        />
        <div className={classes.mediaOverlay} />
      </div>
      <div className={classes.footer}>
        <Typography variant="h6">{props.video.name}</Typography>
        <CoachGroupAvatar size="small" coaches={props.video.coaches} />
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
}));

export default VideoItem;
