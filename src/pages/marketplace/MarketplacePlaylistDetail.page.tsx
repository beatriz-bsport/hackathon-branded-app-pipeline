import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import flatten from 'lodash/flatten';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';

import { Theme } from '@material-ui/core';
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
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';

type OwnProps = {
  id: number;
  videoId: number;
  companyName: string;
  companyId: number;
  requestSignUp?: () => void;
  goToVideoInPlaylist?: (
    playlistId: number,
    videoId: number,
    companyId: number,
    companyName: string,
  ) => void;
  replaceVideoInPlaylist?: (
    playlistId: number,
    videoId: number,
    companyId: number,
    companyName: string,
  ) => void;
  store?: any;
};

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = ConnectProps &
  OwnProps &
  WithHandlerType<typeof mapHandlers> &
  StateHandlerType &
  MaterialStyleType<ReturnType<typeof styles>>;

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
    if (!this.props.authenticated) {
      this.props.requestSignUp();
      return;
    }

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
        onSuccess: (cppList: any) => {
          this.props.fetchPaymentPackBulk(
            cppList.map((cpp: any) => cpp.payment_pack),
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

const styles = (theme: Theme) => ({
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

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  authenticated: state.auth.authenticated,
  video: withCoach(withCategory(getVideo))(state, ownProps.videoId),
  playlist: withCoachInVideo(getPlaylist)(state, ownProps.id),
  loading: state.playlist.loading,
  selectedVideo: withCategory(withCoach(getVideo))(state, ownProps.videoId),
  privateConsumerPassCompatibleList: getPrivateConsumerPassCompatibleList(
    state,
  ),
  consumerPaymentPackCompatibleList: withPaymentPack(
    getConsumerPaymentPackCompatibleList,
  )(state),
});

const mapDispatchToProps = {
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
};

const mapHandlers = {
  registerVideo: (props: OwnProps & ConnectProps) => (data: any) =>
    props.registerVideo(props.videoId, data, {
      onSuccess: () => window.location.reload(),
    }),
  onRequestBuyPass: (props: OwnProps & ConnectProps) => () =>
    props.pushRouter(
      getMarketplaceRoute(props.companyName, props.companyId, 'pass'),
    ),
  retrieveVideo: (props: OwnProps & ConnectProps) => (id: number) => {
    props.retrieveVideo(id, {
      onSuccess: (video) => props.fetchAssociatedCoachBulk(video.coaches),
    });
  },
  retrievePlaylist: (props: OwnProps & ConnectProps) => () => {
    props.retrievePlaylist(props.id, {
      onSuccess: (pl) => {
        props.fetchVideoBulk(pl.videos, {
          onSuccess: (videos) => {
            props.fetchAssociatedCoachBulk(
              flatten(videos.map((v) => v.coaches)),
            );
          },
        });
      },
    });
  },
  goToVideoInPlaylist: (props: OwnProps & ConnectProps) => (
    videoId: number,
  ) => {
    if (props.goToVideoInPlaylist) {
      props.goToVideoInPlaylist(
        props.id,
        videoId,
        props.companyId,
        props.companyName,
      );
      return;
    }
    const url = `/m/${props.companyName}/${props.companyId}/vod/playlist/${props.id}/video/${videoId}`;
    props.pushRouter(url);
  },
  replaceToVideoInPlaylist: (props: OwnProps & ConnectProps) => (
    id: number,
    videoId: number,
  ) => {
    if (props.replaceVideoInPlaylist) {
      props.replaceVideoInPlaylist(
        props.id,
        videoId,
        props.companyId,
        props.companyName,
      );
      return;
    }

    const url = `/m/${props.companyName}/${props.companyId}/vod/playlist/${id}/video/${videoId}`;
    props.replaceRouter(url);
  },
};

const withStateHandlersInit = {
  consumerPaymentPackReady: false,
  registerVideoOpen: false,
  privateConsumerPassReady: false,
};

const withStateHandlersSetter = {
  setConsumerPaymentPackReady: () => (consumerPaymentPackReady: boolean) => {
    return { consumerPaymentPackReady };
  },
  setRegisterVideoOpen: () => (registerVideoOpen: boolean) => {
    return { registerVideoOpen };
  },
  setPrivateConsumerPassReady: () => (privateConsumerPassReady: boolean) => {
    return { privateConsumerPassReady };
  },
};

export const MarketplacePlaylistDetailDataProvider = compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapHandlers),
);

export default compose(
  routerParamsToProps({
    id: 'id:number',
    videoId: 'videoId:number',
    companyName: 'companyName',
    companyId: 'companyId:number',
  }),
  MarketplacePlaylistDetailDataProvider,
)(MarketplacePlaylistDetailPage);
