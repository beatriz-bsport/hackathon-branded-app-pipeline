// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

import CoachChip from '../../associated-coach/components/CoachChip.component';
import SCT from '../../category/components/SCT.component';

import VideoPlayer from './VideoPlayer.component';

type Props = {
  t: TFunction,
};
export const VideoPlayerFull = (props: Props) => {
  const classes = useStyles();
  const coaches = props.video.coaches.filter((c) => !!c);
  return (
    <div className={classes.container}>
      <VideoPlayer
        authenticated={props.authenticated}
        rounded
        video={props.video}
      />
      <div className={classes.inner}>
        <Typography className={classes.videoTitle} variant="h4">
          {`${props.video.name} - ${props.t('video.durationMinute', {
            minute: parseInt(props.video.duration_second / 60, 10) + 1,
          })}`}
        </Typography>
        <SCT parentCategory={props.video.SCT.SCS.id} />
        {!!coaches.length && (
          <div className={classes.coachContainer}>
            {coaches.map((c) => (
              <CoachChip className={classes.coachChip} coach={c} key={c.id} />
            ))}
          </div>
        )}
        <TypographyMultiline color="textSecondary">
          {props.video.description}
        </TypographyMultiline>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  inner: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
  videoTitle: {
    marginBottom: theme.spacing(2),
  },
  coachContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  coachChip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default compose(withTranslation(['video']))(VideoPlayerFull);
