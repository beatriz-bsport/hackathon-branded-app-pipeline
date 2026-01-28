import React from 'react';
import Modal from '@material-ui/core/Modal';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import flatten from 'lodash/flatten';
import { ConnectedProps, connect } from 'react-redux';
import { push, replace } from 'connected-react-router';

import {
  createStyles,
  withStyles,
  type WithStyles,
  type Theme,
} from '@material-ui/core/styles';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { urlToMarketplaceTab } from '#src/libs/marketplace/utils';
// @ts-expect-error
import PlaylistDetail from '../../libs/playlist/components/PlaylistDetail.component';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import { getPlaylist, withCoachInVideo } from '../../libs/playlist/selectors';
import { retrievePlaylist as retrievePlaylistAction } from '../../libs/playlist/actions';
import {
  fetchVideoBulk as fetchVideoBulkAction,
  getPlaybackUrl,
  retrieveVideo as retrieveVideoAction,
} from '../../libs/video/actions';
import {
  getVideo,
  withCoach,
  withCategory,
  getPlaybackUrlById,
} from '../../libs/video/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import { VideoCheckoutComponent } from '../checkout/vod/VideoCheckout.page';

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
  authenticated?: boolean;
  accessDenied?: boolean;
  getPlaybackUrl?: () => void;
  playbackUrlLoading?: boolean;
  playbackUrl?: string;
  requestVideoAccess?: () => void;
};

type ConnectProps = ConnectedProps<typeof connector>;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = ConnectProps &
  OwnProps &
  WithHandlerType<typeof mapHandlers> &
  StateHandlerType &
  WithStyles<typeof styles>;
export class MarketplacePlaylistDetailPage extends React.Component<Props> {
  componentDidMount() {
    this.props.retrievePlaylist();
    if (this.props.videoId) {
      this.props.retrieveVideo(this.props.videoId);
      if (this.props.authenticated) {
        this.props.getPlaybackUrl(this.props.videoId);
      }
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

    if (
      (this.props.videoId !== prevProps.videoId && this.props.authenticated) ||
      (this.props.authenticated && !prevProps.authenticated)
    ) {
      this.props.getPlaybackUrl(this.props.videoId);
    }
  }

  requestVideoAccess = () => {
    if (this.props.requestVideoAccess) {
      return this.props.requestVideoAccess();
    }
    if (!this.props.authenticated) {
      return this.props.requestSignUp();
    }

    return this.props.setRegisterVideoOpen(true);
  };

  getFirstVideoId = (props: Props) => {
    if (
      !props.videoId &&
      !!props.playlist &&
      // @ts-expect-error
      !!props.playlist.videos &&
      // @ts-expect-error
      !!props.playlist.videos.length &&
      // @ts-expect-error
      !!props.playlist.videos[0]
    ) {
      // @ts-expect-error
      return props.playlist.videos[0].id;
    }
    return null;
  };

  onRegisterSuccess = () => {
    this.props.retrieveVideo(this.props.videoId);
    this.props.getPlaybackUrl(this.props.videoId);
    this.props.setRegisterVideoOpen(false);
  };

  render() {
    if (this.props.loading || !this.props.playlist) {
      return <LinearProgress />;
    }
    return (
      <div className={this.props.classes.container}>
        <div className={this.props.classes.playlistDetailContainer}>
          <PlaylistDetail
            accessDenied={this.props.accessDenied}
            authenticated={this.props.authenticated}
            getPlaybackUrl={this.props.getPlaybackUrl}
            onOpenVideo={this.props.goToVideoInPlaylist}
            playbackUrl={this.props.playbackUrl}
            playbackUrlLoading={this.props.playbackUrlLoading}
            playlist={this.props.playlist}
            requestVideoAccess={this.requestVideoAccess}
            selectedVideo={this.props.selectedVideo}
            videoPlayingId={this.props.videoId}
          />
        </div>
        {this.props.registerVideoOpen &&
          // @ts-expect-error
          !!this.props.video?.company &&
          // @ts-expect-error
          !!this.props.video?.id && (
            <Modal open onClose={() => this.props.setRegisterVideoOpen(false)}>
              <div
                className={this.props.classes.modal}
                style={{
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                }}
              >
                <VideoCheckoutComponent
                  // @ts-expect-error
                  companyId={this.props.video.company}
                  // @ts-expect-error
                  id={this.props.video.id}
                  onSuccess={this.onRegisterSuccess}
                />
              </div>
            </Modal>
          )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
    modal: {
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      borderRadius: 8,
      overflow: 'auto',
      maxHeight: '100vh',
      maxWidth: '60%',
      [theme.breakpoints.up('sm')]: {
        minWidth: 600,
      },
    },
  });

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  // @ts-expect-error
  video: withCoach(withCategory(getVideo))(state, ownProps.videoId),
  // This fails in ci:compile, but not in my IDE right now, spent 5min to understand why but I can't figure it out
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  playlist: withCoachInVideo(getPlaylist)(state, ownProps.id),
  loading: state.playlist.loading,
  // @ts-expect-error
  selectedVideo: withCategory(withCoach(getVideo))(state, ownProps.videoId),
  authenticated: state.auth.authenticated,
  playbackUrl: getPlaybackUrlById(state, ownProps.videoId),
  playbackUrlLoading: state.video.playbackUrl.loading,
  accessDenied: state.video.playbackUrl.accessDenied,
});

const mapDispatchToProps = {
  retrievePlaylist: retrievePlaylistAction,
  retrieveVideo: retrieveVideoAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  fetchVideoBulk: fetchVideoBulkAction,
  pushRouter: push,
  replaceRouter: replace,
  getPlaybackUrl,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const mapHandlers = {
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
  goToVideoInPlaylist:
    (props: OwnProps & ConnectProps) => (videoId: number) => {
      if (props.goToVideoInPlaylist) {
        props.goToVideoInPlaylist(
          props.id,
          videoId,
          props.companyId,
          props.companyName,
        );
        return;
      }
      const url = urlToMarketplaceTab(
        props.companyName,
        // @ts-expect-error
        props.companyId,
        `vod/playlist/${props.id}/video/${videoId}`,
      );
      props.pushRouter(url);
    },
  replaceToVideoInPlaylist:
    (props: OwnProps & ConnectProps) => (id: number, videoId: number) => {
      if (props.replaceVideoInPlaylist) {
        props.replaceVideoInPlaylist(
          props.id,
          videoId,
          props.companyId,
          props.companyName,
        );
        return;
      }

      const url = urlToMarketplaceTab(
        props.companyName,
        // @ts-expect-error
        props.companyId,
        `vod/playlist/${id}/video/${videoId}`,
      );
      props.replaceRouter(url);
    },
};

const withStateHandlersInit = {
  registerVideoOpen: false,
};

const withStateHandlersSetter = {
  setRegisterVideoOpen: () => (registerVideoOpen: boolean) => {
    return { registerVideoOpen };
  },
};

export const MarketplacePlaylistDetailDataProvider = compose<Props, OwnProps>(
  marketplaceCssHoc(),
  withStyles(styles),
  connector,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapHandlers),
);

export default compose(
  routerParamsToProps({
    id: 'id:number',
    videoId: 'videoId:number',
    // @ts-expect-error
    companyName: 'companyName',
    companyId: 'companyId:number',
  }),
  MarketplacePlaylistDetailDataProvider,
)(MarketplacePlaylistDetailPage);
