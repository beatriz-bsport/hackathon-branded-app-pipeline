// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import { push as pushRouter } from 'connected-react-router';

import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import VideoThumbnailList from '../../libs/video/components/VideoThumbnailList.component';
import VideoPlayerFull from '../../libs/video/components/VideoPlayerFull.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getMarketplaceRoute } from './routing-utils';
import {
  retrieveVideo as retrieveVideoAction,
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoList as fetchVideoListAction,
} from '../../libs/video/actions';
import {
  getVideo,
  getVideoList,
  withCategory,
  withCoach,
} from '../../libs/video/selectors';

import { getConsumerPaymentPackCompatibleList } from '../../libs/consumer-payment-pack/selectors';
import { fetchConsumerPaymentPackCompatibleList } from '../../libs/consumer-payment-pack/actions';
import { fetchPrivateConsumerPassCompatibleList } from '../../libs/private-service/actions';
import { getPrivateConsumerPassCompatibleList } from '../../libs/private-service/selectors/private-consumer-pass';

type Props = {
  retrieveVideo: () => void,
  classes: Object,
  fetchVideoListSimilar: () => void,
  videoListSimilar: Array<Video>,
  similarVideoLoading: boolean,
  hasMoreVideo: boolean,
  fetchMoreVideo: () => void,
  openVideo: (id: number) => void,
  video: ?Video,
  loading: boolean,
  authenticated: boolean,
};

export class MarketplaceVideoDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.retrieveVideo();
    this.props.fetchVideoListSimilar();
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {!!this.props.loading && <LinearProgress />}
        <Grid
          spacing={2}
          container
          direction="row"
          className={this.props.classes.gridContainer}
        >
          <Grid item xs={12} md={8}>
            {!!this.props.video && (
              <VideoPlayerFull
                authenticated={this.props.authenticated}
                video={this.props.video}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <VideoThumbnailList
              videoList={this.props.videoListSimilar}
              loading={this.props.similarVideoLoading}
              hasMoreVideo={this.props.hasMoreVideo}
              fetchMoreVideo={this.props.fetchMoreVideo}
              onOpenVideo={this.props.openVideo}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  gridContainer: {
    maxWidth: 1400,
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({
    videoId: 'videoId:number',
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  connect(
    (state, { videoId }) => ({
      authenticated: state.auth.authenticated,
      video: withCoach(withCategory(getVideo))(state, videoId),
      videoListSimilar: withCoach(withCategory(getVideoList))(state),
      hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
      similarVideoLoading: state.video.loading,
      privateConsumerPassCompatibleList: getPrivateConsumerPassCompatibleList(
        state,
      ),
      consumerPaymentPackCompatibleList: getConsumerPaymentPackCompatibleList(
        state,
      ),
    }),
    {
      retrieveVideo: retrieveVideoAction,
      fetchVideoList: fetchVideoListAction,
      fetchMoreVideo: fetchMoreVideoAction,
      fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
      fetchPrivateConsumerPassCompatibleList,
      fetchConsumerPaymentPackCompatibleList,
      push: pushRouter,
    },
  ),
  withHandlers({
    retrieveVideo: ({
      retrieveVideo,
      videoId,
      fetchAssociatedCoachBulk,
    }) => () => {
      retrieveVideo(videoId, {
        onSuccess: (video) => {
          fetchAssociatedCoachBulk(video.coaches);
        },
      });
    },
    openVideo: ({ push, companyId, companyName }) => (videoId) => {
      push(getMarketplaceRoute(companyName, companyId, `vod/video/${videoId}`));
    },
    fetchMoreVideo: ({ videoId, fetchMoreVideo }) => () => {
      fetchMoreVideo({
        status: 400,
        similar: videoId,
      });
    },
    fetchVideoListSimilar: ({
      fetchVideoList,
      videoId,
      fetchAssociatedCoachBulk,
    }) => () => {
      fetchVideoList(
        {
          status: 400,
          similar: videoId,
        },
        1,
        {
          onSuccess: (videoList) => {
            fetchAssociatedCoachBulk(flatten(videoList.map((v) => v.coaches)));
          },
        },
      );
    },
  }),
)(MarketplaceVideoDetail);
