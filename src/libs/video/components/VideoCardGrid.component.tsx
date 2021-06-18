import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import VideoCardGridItem from './VideoCardGridItem.component';
import { Video } from '../types';
import { SCT } from '../../category/types';
import { Coach } from '../../associated-coach/types';

type Props = {
  videoList: Array<Video<SCT, Coach>>;
  onEdit: (v: Video<SCT, Coach>) => void;
  onDelete: (v: Video<SCT, Coach>) => void;
  loading: boolean;
  onRequestUpload: (v: Video<SCT, Coach>) => void;
  hasMoreVideo: boolean;
  onShowMore: () => void;
  onStream: (v: Video<SCT, Coach>) => void;
  goToDetail: (id: number) => void;
  onDuplicate: (v: Video<SCT, Coach>) => void;
};

export const VideoCardList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);

  return (
    <Grid alignItems="stretch" spacing={2} container direction="row">
      {props.videoList.map((v) => (
        <Grid key={v.id} item xs={12} sm={6} md={4} lg={3}>
          <VideoCardGridItem
            video={v}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onRequestUpload={props.onRequestUpload}
            onStream={props.onStream}
            goToDetail={() => props.goToDetail(v.id)}
            onDuplicate={props.onDuplicate}
            withStatus
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
      {!!props.loading && (
        <div className={classes.buttonContainer}>
          <CircularProgress />
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

const useStyles = makeStyles((theme: Theme) => ({
  buttonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

export default memo(VideoCardList);
