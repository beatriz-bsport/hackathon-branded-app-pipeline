// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withTranslation, TFunction } from 'react-i18next';
import { DateTime } from 'luxon';
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
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '../../libs/member/actions';
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
import { formatISOStringAsTime } from '../../utils/datetime';
import { openNewBackOfficeWindow } from '#src/utils/windows';

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
        <Grid container direction="row" spacing={3}>
          <Grid item lg={8} xs={12}>
            {this.props.video ? (
              <VideoPlayerFull
                authenticated
                accessDenied={this.props.accessDenied}
                managerOnly={this.props.video.manager_only}
                playbackUrl={this.props.playbackUrl}
                playbackUrlLoading={this.props.playbackUrlLoading}
                video={this.props.video}
              />
            ) : null}
          </Grid>
          <Grid item lg={4} xs={12}>
            <VodVideoAnalytics
              data={this.props.analytics.data}
              loading={this.props.analytics.loading || !this.props.video}
              videoDateCreated={
                this.props.video ? this.props.video.date_created : null
              }
            />
            <div className={this.props.classes.list}>
              <Typography className={this.props.classes.listTitle} variant="h6">
                {this.props.t('video.viewsListTitle')}
              </Typography>
              <Paper>
                <VodGenericPaginatedList
                  emptyText={this.props.t('video.noVideoView')}
                  itemPerPage={VIDEO_VIEWS_PAGE_SIZE}
                  items={this.props.views.items}
                  loading={this.props.views.loading}
                  nbItems={this.props.views.count}
                  onClick={(view) => this.props.goToMember(view.member_id)}
                  onPageRequested={this.props.onPageRequestedView}
                  page={this.props.views.page}
                  renderSecondaryText={(view) =>
                    this.props.t('video.viewedOn', {
                      date: DateTime.fromISO(view.date_created).toFormat('D'),
                      hour: formatISOStringAsTime(view.date_created),
                    })
                  }
                />
              </Paper>
            </div>
            {this.props.video && this.props.video.credit_price > 0 && (
              <>
                <div className={this.props.classes.list}>
                  <Typography
                    className={this.props.classes.listTitle}
                    variant="h6"
                  >
                    {this.props.t('video.purchaseListTitle')}
                  </Typography>
                  <Paper>
                    <VodGenericPaginatedList
                      emptyText={this.props.t('video.noVideoPurchase')}
                      itemPerPage={VIDEO_PURCHASES_PAGE_SIZE}
                      items={this.props.purchases.items}
                      loading={this.props.purchases.loading}
                      nbItems={this.props.purchases.count}
                      onClick={(purchase) =>
                        this.props.goToMember(purchase.member_id)
                      }
                      onPageRequested={this.props.onPageRequestedPurchase}
                      page={this.props.purchases.page}
                      renderSecondaryText={(purchase) =>
                        this.props.t('video.boughtOn', {
                          date: DateTime.fromISO(
                            purchase.date_created,
                          ).toFormat('D'),
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
      fetchMemberBulkById: fetchMemberBulkByIdAction,
      fetchVideoPurchase: fetchVideoPurchaseAction,
      fetchVideoAnalytics: fetchVideoAnalyticsAction,
      fetchVideoViews: fetchVideoViewsAction,
      getPlaybackUrl,
    },
  ),
  withHandlers({
    goToMember: () => (memberId) => {
      const url = `/member/${memberId}/`;
      openNewBackOfficeWindow(url);
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
      ({ fetchVideoPurchase, fetchMemberBulkById, videoId }) =>
      (page, pageSize) => {
        fetchVideoPurchase(
          page,
          pageSize,
          { video: videoId },
          {
            onSuccess: (purchases) => {
              fetchMemberBulkById(
                purchases.map((purchase) => purchase.member_id),
              );
            },
          },
        );
      },
    fetchVideoViews:
      ({ fetchVideoViews, fetchMemberBulkById, videoId }) =>
      (page, pageSize) => {
        fetchVideoViews(
          page,
          pageSize,
          { video_analytics__video: videoId },
          {
            onSuccess: (views) => {
              fetchMemberBulkById(views.map((view) => view.member_id));
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
