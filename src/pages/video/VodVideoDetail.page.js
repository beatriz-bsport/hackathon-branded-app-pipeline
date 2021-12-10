// @flow

import React from 'react';
import moment from 'moment-timezone';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withTranslation, TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import VideoPlayerFull from '../../libs/video/components/VideoPlayerFull.component';
import VodGenericPaginatedList from '../../libs/video/components/VodGenericPaginatedList.component';
import VodVideoAnalytics from '../../libs/video/components/VodVideoAnalytics.component';

import {
  retrieveVideo as retrieveVideoAction,
  fetchVideoPurchase as fetchVideoPurchaseAction,
  fetchVideoAnalytics as fetchVideoAnalyticsAction,
  fetchVideoViews as fetchVideoViewsAction,
  getPlaybackUrl,
} from '../../libs/video/actions';
import { fetchMemberBulk as fetchMemberBulkAction } from '../../libs/member/actions';
import {
  getVideo,
  withCategory,
  withCoach,
  getVideoPurchasesWithMember,
  getVideoViewsWithMember,
  getPlaybackUrlById,
} from '../../libs/video/selectors';
import type {
  VideoPurchase,
  VideoView,
  VideoAnalyticsData,
} from '../../libs/video/types';

type Props = {
  classes: any,
  videoId: number,
  playbackUrl: string,
  playbackUrlLoading: boolean,
  accessDenied: boolean,
  t: TFunction,
  retrieveVideo: () => void,
  fetchVideoAnalytics: () => void,

  video: Video,
  purchases: {
    items: Array<VideoPurchase>,
    count: number,
    loading: boolean,
    page: number,
  },
  views: {
    items: Array<VideoView>,
    count: number,
    loading: boolean,
    page: number,
  },
  analytics: {
    data: VideoAnalyticsData,
    loading: boolean,
  },
  getPlaybackUrl: (id: number) => void,

  goToMember: (memberId: number) => void,
  onPageRequestedPurchase: (page: number, page_size: number) => void,
  onPageRequestedView: (page: number, page_size: number) => void,
};

const VIDEO_PURCHASES_PAGE_SIZE = 5;
const VIDEO_VIEWS_PAGE_SIZE = 5;

export class VodVideoDetailPage extends React.Component<Props> {
  componentDidMount() {
    this.props.retrieveVideo();
    this.props.fetchVideoAnalytics();
    this.props.getPlaybackUrl(this.props.videoId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.videoId !== this.props.videoId && this.props.videoId) {
      this.props.getPlaybackUrl(this.props.videoId);
    }
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <Grid spacing={3} container direction="row">
          <Grid item xs={12} lg={8}>
            {this.props.video ? (
              <VideoPlayerFull
                authenticated
                video={this.props.video}
                managerOnly={this.props.video.manager_only}
                playbackUrl={this.props.playbackUrl}
                playbackUrlLoading={this.props.playbackUrlLoading}
                accessDenied={this.props.accessDenied}
              />
            ) : null}
          </Grid>
          <Grid item xs={12} lg={4}>
            <VodVideoAnalytics
              loading={this.props.analytics.loading || !this.props.video}
              data={this.props.analytics.data}
              videoDateCreated={
                this.props.video ? this.props.video.date_created : null
              }
            />
            <div className={this.props.classes.list}>
              <Typography variant="h6" className={this.props.classes.listTitle}>
                {this.props.t('video.viewsListTitle')}
              </Typography>
              <Paper>
                <VodGenericPaginatedList
                  items={this.props.views.items}
                  nbItems={this.props.views.count}
                  loading={this.props.views.loading}
                  page={this.props.views.page}
                  itemPerPage={VIDEO_VIEWS_PAGE_SIZE}
                  onClick={(view) => this.props.goToMember(view.member_id)}
                  onPageRequested={this.props.onPageRequestedView}
                  emptyText={this.props.t('video.noVideoView')}
                  renderSecondaryText={(view) =>
                    this.props.t('video.viewedOn', {
                      date: moment(view.date_created).format('L'),
                      hour: moment(view.date_created).format('LT'),
                    })
                  }
                />
              </Paper>
            </div>
            {this.props.video && this.props.video.credit_price > 0 && (
              <>
                <div className={this.props.classes.list}>
                  <Typography
                    variant="h6"
                    className={this.props.classes.listTitle}
                  >
                    {this.props.t('video.purchaseListTitle')}
                  </Typography>
                  <Paper>
                    <VodGenericPaginatedList
                      items={this.props.purchases.items}
                      nbItems={this.props.purchases.count}
                      loading={this.props.purchases.loading}
                      page={this.props.purchases.page}
                      itemPerPage={VIDEO_PURCHASES_PAGE_SIZE}
                      onClick={(purchase) =>
                        this.props.goToMember(purchase.member_id)
                      }
                      onPageRequested={this.props.onPageRequestedPurchase}
                      emptyText={this.props.t('video.noVideoPurchase')}
                      renderSecondaryText={(purchase) =>
                        this.props.t('video.boughtOn', {
                          date: moment(purchase.date_created).format('L'),
                        })
                      }
                    />
                  </Paper>
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  listTitle: {
    paddingBottom: theme.spacing(1),
  },
  list: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['video']),
  routerParamsToProps({ videoId: 'videoId:number' }),
  connect(
    (state, { videoId }) => ({
      video: withCoach(withCategory(getVideo))(state, videoId),
      purchases: {
        items: getVideoPurchasesWithMember(state),
        count: state.video.purchase.count,
        loading: state.video.purchase.loading,
        page: state.video.purchase.page,
      },
      views: {
        items: getVideoViewsWithMember(state),
        count: state.video.views.count,
        loading: state.video.views.loading,
        page: state.video.views.page,
      },
      analytics: {
        data: state.video.analytics.data,
        loading: state.video.analytics.loading,
      },
      playbackUrl: getPlaybackUrlById(state, videoId),
      playbackUrlLoading: state.video.playbackUrl.loading,
      accessDenied: state.video.playbackUrl.accessDenied,
    }),
    {
      retrieveVideo: retrieveVideoAction,
      fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
      fetchMemberBulk: fetchMemberBulkAction,
      fetchVideoPurchase: fetchVideoPurchaseAction,
      fetchVideoAnalytics: fetchVideoAnalyticsAction,
      fetchVideoViews: fetchVideoViewsAction,
      getPlaybackUrl,
    },
  ),
  withHandlers({
    goToMember: () => (memberId) => {
      const url = `/member/${memberId}/`;
      const win = window.open(url);
      win.focus();
    },
    retrieveVideo:
      ({ retrieveVideo, videoId, fetchAssociatedCoachBulk }) =>
      () => {
        retrieveVideo(videoId, {
          onSuccess: (video) => {
            fetchAssociatedCoachBulk(video.coaches);
          },
        });
      },
    fetchVideoPurchase:
      ({ fetchVideoPurchase, fetchMemberBulk, videoId }) =>
      (page, pageSize) => {
        fetchVideoPurchase(
          page,
          pageSize,
          { video: videoId },
          {
            onSuccess: (purchases) => {
              fetchMemberBulk({
                id__in: purchases.map((purchase) => purchase.member_id),
              });
            },
          },
        );
      },
    fetchVideoViews:
      ({ fetchVideoViews, fetchMemberBulk, videoId }) =>
      (page, pageSize) => {
        fetchVideoViews(
          page,
          pageSize,
          { video_analytics__video: videoId },
          {
            onSuccess: (views) => {
              fetchMemberBulk({
                id__in: views.map((view) => view.member_id),
              });
            },
          },
        );
      },
    fetchVideoAnalytics:
      ({ fetchVideoAnalytics, videoId }) =>
      () => {
        fetchVideoAnalytics(videoId);
      },
  }),
  withHandlers({
    onPageRequestedPurchase:
      ({ fetchVideoPurchase }) =>
      (page, pageSize) => {
        fetchVideoPurchase(page, pageSize);
      },
    onPageRequestedView:
      ({ fetchVideoViews }) =>
      (page, pageSize) => {
        fetchVideoViews(page, pageSize);
      },
  }),
)(VodVideoDetailPage);
