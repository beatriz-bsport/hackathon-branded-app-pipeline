// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import flatten from 'lodash/flatten';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';

import PlaylistDetail from '../../libs/playlist/components/PlaylistDetail.component';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import { getPlaylist, withCoachInVideo } from '../../libs/playlist/selectors';
import { retrievePlaylist as retrievePlaylistAction } from '../../libs/playlist/actions';
import {
  fetchVideoBulk as fetchVideoBulkAction,
  registerVideo as registerVideoAction,
  retrieveVideo as retrieveVideoAction,
} from '../../libs/video/actions';
import { getVideo, withCoach, withCategory } from '../../libs/video/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchPrivateConsumerPassCompatibleList as fetchPrivateConsumerPassCompatibleListAction } from '../../libs/private-service/actions';
import { fetchConsumerPaymentPackCompatibleList as fetchConsumerPaymentPackCompatibleListAction } from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import VideoRegisterDialog from '../../libs/video/components/RegisterVideoDialog.component';
import {
  getConsumerPaymentPackCompatibleList,
  withPaymentPack,
} from '../../libs/consumer-payment-pack/selectors';
import { getPrivateConsumerPassCompatibleList } from '../../libs/private-service/selectors/private-consumer-pass';
import { getMarketplaceRoute } from './routing-utils';

type Props = {
  id: number,
  videoId: number,
  loading: boolean,
  retrievePlaylist: () => void,
  retrieveVideo: (id: number) => void,
  replaceToVideoInPlaylist: (playlistId: number, videoId: number) => void,
  goToVideoInPlaylist: (videoId: number) => void,
  authenticated: boolean,
  classes: Object,
  fetchPrivateConsumerPassCompatibleList: () => void,
  fetchConsumerPaymentPackCompatibleList: () => void,
  setPrivateConsumerPassReady: () => void,
  fetchPaymentPackBulk: () => void,
  setConsumerPaymentPackReady: () => void,
  setRegisterVideoOpen: () => void,
  playlist: ?VideoPlaylist,
  consumerPaymentPackCompatibleList: *,
  privateConsumerPassCompatibleList: *,
  registerVideo: () => void,
  onRequestBuyPass: () => void,
  registerVideoOpen: boolean,
  consumerPaymentPackReady: boolean,
  privateConsumerPassReady: boolean,
  videoId: ?number,
  video: *,
  selectedVideo: ?Video,
};

export class MarketplacePlaylistDetailPage extends React.Component<Props> {
  componentDidMount() {
    this.props.retrievePlaylist();
    if (this.props.videoId) {
      this.props.retrieveVideo(this.props.videoId);
    }

    const currentFirstVideoId = this.getFirstVideoId(this.props);

    if (currentFirstVideoId) {
      this.props.replaceToVideoInPlaylist(this.props.id, currentFirstVideoId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const currentFirstVideoId = this.getFirstVideoId(this.props);
    const prevFirstVideoId = this.getFirstVideoId(prevProps);

    if (currentFirstVideoId && currentFirstVideoId !== prevFirstVideoId) {
      this.props.goToVideoInPlaylist(currentFirstVideoId);
    }
    if (!!this.props.videoId && this.props.videoId !== prevProps.videoId) {
      this.props.retrieveVideo(this.props.videoId);
    }
  }

  requestVideoAccess = () => {
    this.props.fetchPrivateConsumerPassCompatibleList(
      {
        video: this.props.videoId,
      },
      {
        onSuccess: () => this.props.setPrivateConsumerPassReady(true),
        onError: () => this.props.setPrivateConsumerPassReady(true),
      },
    );
    this.props.fetchConsumerPaymentPackCompatibleList(
      {
        video: this.props.videoId,
      },
      {
        onSuccess: (cppList) => {
          this.props.fetchPaymentPackBulk(
            cppList.map((cpp) => cpp.payment_pack),
          );
          this.props.setConsumerPaymentPackReady(true);
        },
        onError: () => this.props.setConsumerPaymentPackReady(true),
      },
    );
    this.props.setRegisterVideoOpen(true);
  };

  getFirstVideoId = (props: Props) => {
    if (
      !props.videoId &&
      !!props.playlist &&
      !!props.playlist.videos &&
      !!props.playlist.videos.length &&
      !!props.playlist.videos[0]
    ) {
      return props.playlist.videos[0].id;
    }
    return null;
  };

  render() {
    if (this.props.loading || !this.props.playlist) {
      return <LinearProgress />;
    }

    return (
      <div className={this.props.classes.container}>
        <div className={this.props.classes.playlistDetailContainer}>
          <PlaylistDetail
            playlist={this.props.playlist}
            videoPlayingId={this.props.videoId}
            selectedVideo={this.props.selectedVideo}
            onOpenVideo={this.props.goToVideoInPlaylist}
            authenticated={this.props.authenticated}
            requestVideoAccess={this.requestVideoAccess}
          />
        </div>

        <VideoRegisterDialog
          consumerPaymentPackList={this.props.consumerPaymentPackCompatibleList}
          privateConsumerPassList={this.props.privateConsumerPassCompatibleList}
          creditPrice={this.props.video && this.props.video.credit_price}
          registerVideo={this.props.registerVideo}
          open={this.props.registerVideoOpen}
          onBuyPass={this.props.onRequestBuyPass}
          onClose={() => this.props.setRegisterVideoOpen(false)}
          loading={
            !(
              this.props.consumerPaymentPackReady &&
              this.props.privateConsumerPassReady
            )
          }
        />
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  playlistDetailContainer: {
    maxWidth: 1400,
    height: '100%',
    width: '100%',
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({
    id: 'id:number',
    videoId: 'videoId:number',
    companyName: 'companyName',
    companyId: 'companyId:number',
  }),
  connect(
    (state, { id, videoId }) => ({
      authenticated: state.auth.authenticated,
      video: withCoach(withCategory(getVideo))(state, videoId),
      playlist: withCoachInVideo(getPlaylist)(state, id),
      loading: state.playlist.loading,
      selectedVideo: withCategory(withCoach(getVideo))(state, videoId),
      privateConsumerPassCompatibleList: getPrivateConsumerPassCompatibleList(
        state,
      ),
      consumerPaymentPackCompatibleList: withPaymentPack(
        getConsumerPaymentPackCompatibleList,
      )(state),
    }),
    {
      retrievePlaylist: retrievePlaylistAction,
      retrieveVideo: retrieveVideoAction,
      fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
      fetchVideoBulk: fetchVideoBulkAction,
      fetchPrivateConsumerPassCompatibleList: fetchPrivateConsumerPassCompatibleListAction,
      fetchConsumerPaymentPackCompatibleList: fetchConsumerPaymentPackCompatibleListAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      registerVideo: registerVideoAction,
      pushRouter: push,
      replaceRouter: replace,
    },
  ),
  withState('consumerPaymentPackReady', 'setConsumerPaymentPackReady', false),
  withState('registerVideoOpen', 'setRegisterVideoOpen', false),
  withState('privateConsumerPassReady', 'setPrivateConsumerPassReady', false),
  withHandlers({
    registerVideo: ({ registerVideo, videoId }) => (data) =>
      registerVideo(videoId, data, {
        onSuccess: () => window.location.reload(),
      }),
    onRequestBuyPass: ({ pushRouter, companyName, companyId }) => () =>
      pushRouter(getMarketplaceRoute(companyName, companyId, 'pass')),
    retrieveVideo: ({ retrieveVideo, fetchAssociatedCoachBulk }) => (id) => {
      retrieveVideo(id, {
        onSuccess: (video) => fetchAssociatedCoachBulk(video.coaches),
      });
    },
    retrievePlaylist: ({
      id,
      retrievePlaylist,
      fetchVideoBulk,
      fetchAssociatedCoachBulk,
    }) => () => {
      retrievePlaylist(id, {
        onSuccess: (pl) => {
          fetchVideoBulk(pl.videos, {
            onSuccess: (videos) => {
              fetchAssociatedCoachBulk(flatten(videos.map((v) => v.coaches)));
            },
          });
        },
      });
    },
    goToVideoInPlaylist: ({ companyName, companyId, id, pushRouter }) => (
      videoId,
    ) => {
      const url = `/m/${companyName}/${companyId}/vod/playlist/${id}/video/${videoId}`;
      pushRouter(url);
    },
    replaceToVideoInPlaylist: ({ companyName, companyId, replaceRouter }) => (
      id,
      videoId,
    ) => {
      const url = `/m/${companyName}/${companyId}/vod/playlist/${id}/video/${videoId}`;
      replaceRouter(url);
    },
  }),
)(MarketplacePlaylistDetailPage);
