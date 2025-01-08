// @flow
import React, { memo } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { MarketPlaceCoachDisplay } from '@bsport/common/master-data/personalization.js';
import VideoItem from './VideoItem.component';
import { VideoPurchase, Video } from '../types';

type Props = {
  videoList: Array<Video>,
  purchasedVideoList?: Array<VideoPurchase>,
  loading: boolean,
  hasMoreVideo: boolean,
  hideCoach: boolean,
  onShowMore: () => void,
  openVideo: (id: number) => void,
  coachDisplay?: MarketPlaceCoachDisplay,
};

export const VideoCardList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  return (
    <Grid
      container
      alignItems="stretch"
      className="bs-vod-list__grid-container"
      direction="row"
      spacing={2}
    >
      {props.videoList.map((v) => (
        <Grid
          key={v.id}
          item
          className={`bs-vod-list__vod_item_container_${v.id}`}
          lg={3}
          md={4}
          sm={6}
          xs={12}
        >
          <VideoItem
            className={`bs-vod-list__vod_item_${v.id}`}
            coachDisplay={props.coachDisplay}
            hideCoach={props.hideCoach}
            loading={v.coaches.includes(undefined)}
            openVideo={props.openVideo}
            purchasedVideo={props.purchasedVideoList?.find(
              (pv) => pv.video === v.id,
            )}
            video={v}
          />
        </Grid>
      ))}
      {props.loading &&
        [0, 1, 2, 3, 4].map((i) => (
          <Grid key={i} item lg={3} md={4} sm={6} xs={12}>
            <VideoItem loading video={{ coaches: [] }} />
          </Grid>
        ))}
      {!props.loading && !props.videoList.length && (
        <div
          className={classNames(
            classes.buttonContainer,
            'bs-vod-list__empty-container',
          )}
        >
          <Typography
            className="bs-vod-list__empty-text"
            color="textSecondary"
            component="p"
            variant="h6"
          >
            {t('video.search.isEmpty')}
          </Typography>
        </div>
      )}
      {!props.loading && !!props.hasMoreVideo && !!props.onShowMore && (
        <div
          className={classNames(
            classes.buttonContainer,
            'bs-vod-list__show-more-button-container',
          )}
        >
          <Button
            className="bs-vod-list__show-more-button"
            color="primary"
            onClick={props.onShowMore}
            variant="outlined"
          >
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
