import React from 'react';
import Modal from '@material-ui/core/Modal';
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
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
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
      !!props.playlist.videos &&
      !!props.playlist.videos.length &&
      !!props.playlist.videos[0]
    ) {
      return props.playlist.videos[0].id;
    }
    return null;
  };

  onRegisterSuccess = () => {
    this.props.retrieveVideo(this.props.videoId);
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
            playlist={this.props.playlist}
            videoPlayingId={this.props.videoId}
            selectedVideo={this.props.selectedVideo}
            onOpenVideo={this.props.goToVideoInPlaylist}
            authenticated={this.props.authenticated}
            requestVideoAccess={this.requestVideoAccess}
            getPlaybackUrl={this.props.getPlaybackUrl}
            playbackUrl={this.props.playbackUrl}
            playbackUrlLoading={this.props.playbackUrlLoading}
            accessDenied={this.props.accessDenied}
          />
        </div>
        {this.props.registerVideoOpen && (
          <Modal open onClose={() => this.props.setRegisterVideoOpen(false)}>
            <div
              style={{
                transform: 'translate(-50%, -50%)',
                top: '50%',
                left: '50%',
              }}
              className={this.props.classes.modal}
            >
              <VideoCheckoutComponent
                id={this.props.video.id}
                companyId={this.props.video.company}
                onSuccess={this.onRegisterSuccess}
              />
            </div>
          </Modal>
        )}
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
  video: withCoach(withCategory(getVideo))(state, ownProps.videoId),
  playlist: withCoachInVideo(getPlaylist)(state, ownProps.id),
  loading: state.playlist.loading,
  selectedVideo: withCategory(withCoach(getVideo))(state, ownProps.videoId),
});

const mapDispatchToProps = {
  retrievePlaylist: retrievePlaylistAction,
  retrieveVideo: retrieveVideoAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  fetchVideoBulk: fetchVideoBulkAction,
  pushRouter: push,
  replaceRouter: replace,
};

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
      const url = `/m/${props.companyName}/${props.companyId}/vod/playlist/${props.id}/video/${videoId}`;
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

      const url = `/m/${props.companyName}/${props.companyId}/vod/playlist/${id}/video/${videoId}`;
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
  connect(
    (state: RootState, ownProps: OwnProps) => ({
      authenticated: state.auth.authenticated,
      playbackUrl: getPlaybackUrlById(state, ownProps.videoId),
      playbackUrlLoading: state.video.playbackUrl.loading,
      accessDenied: state.video.playbackUrl.accessDenied,
    }),
    {
      getPlaybackUrl,
    },
  ),
  MarketplacePlaylistDetailDataProvider,
)(MarketplacePlaylistDetailPage);
