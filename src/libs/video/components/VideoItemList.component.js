// @flow
import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import VideoItem from './VideoItem.component';

type Props = {
  videoList: Array<Video>,
  loading: boolean,
  hasMoreVideo: boolean,
  onShowMore: () => void,
  openVideo: (id: number) => void,
};

export const VideoCardList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);

  return (
    <Grid alignItems="stretch" spacing={2} container direction="row">
      {props.videoList.map((v) => (
        <Grid key={v.id} item xs={12} sm={6} md={4} lg={3}>
          <VideoItem
            video={v}
            openVideo={props.openVideo}
            loading={props.loading}
          />
        </Grid>
      ))}
      {!props.loading && !props.videoList.length && (
        <div className={classes.buttonContainer}>
          <Typography variant="h6" component="p" color="textSecondary">
            {t('video.search.isEmpty')}
          </Typography>
        </div>
      )}
      {!props.loading && !!props.hasMoreVideo && !!props.onShowMore && (
        <div className={classes.buttonContainer}>
          <Button variant="outlined" onClick={props.onShowMore} color="primary">
            {t('video.showMore')}
          </Button>
        </div>
      )}
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  skeletonContainer: { width: '100%', height: '100%' },
}));

export default memo(VideoCardList);
