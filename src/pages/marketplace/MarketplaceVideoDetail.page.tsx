// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import { push as pushRouter } from 'connected-react-router';
import { LinearProgress, Theme } from '@material-ui/core';

import Modal from '@material-ui/core/Modal';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import VideoThumbnailList from '../../libs/video/components/VideoThumbnailList.component';
import VideoPlayerFull from '../../libs/video/components/VideoPlayerFull.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getMarketplaceRoute } from '../../libs/marketplace/routing-utils';
import {
  retrieveVideo as retrieveVideoAction,
  fetchMoreVideo as fetchMoreVideoAction,
  fetchVideoList as fetchVideoListAction,
  getPlaybackUrl,
  fetchVideoPurchase as fetchVideoPurchaseAction,
} from '../../libs/video/actions';
import {
  getVideo,
  getVideoList,
  withCategory,
  withCoach,
  getPlaybackUrlById,
  getLastVideoPurchasedByVideo,
} from '../../libs/video/selectors';

import themeSelectors from '../../libs/theme/selectors';

import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { Video, VideoPurchase } from '../../libs/video/types';
import { VideoCheckoutComponent } from '../checkout/vod/VideoCheckout.page';
import { OptionCallback } from '../../state/types';

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type OwnProps = {
  videoId: number;
  companyId: number;
  companyName: string;
  requestSignUp?: () => void;
  onRequestBuyPass: (companyId: number, companyName: string) => void;
  openVideo: (videoId: number, companyId: number, companyName: string) => void;
  store?: any;
  requestVideoAccessRefreshFlag?: number;
  accessDenied: boolean;
  authenticated: any;
  getPlaybackUrl: (videoId: number, options?: OptionCallback) => void;
  playbackUrlLoading: boolean;
  playbackUrl: string;
  videoPurchase: VideoPurchase;
} & StateHandlerType;

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = ConnectProps &
  OwnProps &
  WithHandlerType<typeof mapHandlers> &
  MaterialStyleType<ReturnType<typeof styles>>;

export class MarketplaceVideoDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.retrieveVideo();
    this.props.fetchVideoListSimilar();
    this.props.fetchVideoPurchase(1, 1, { video: this.props.videoId });
    if (this.props.authenticated) {
      this.props.getPlaybackUrl(this.props.videoId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (this.props.videoId !== prevProps.videoId && this.props.authenticated) ||
      (this.props.authenticated && !prevProps.authenticated)
    ) {
      this.props.getPlaybackUrl(this.props.videoId);
    }
    if (prevProps.accessDenied && !this.props.accessDenied)
      this.props.fetchVideoPurchase(1, 1, { video: this.props.videoId });
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

  onRegisterSuccess = () => {
    this.props.getPlaybackUrl(this.props.videoId);
    this.props.setRegisterVideoOpen(false);
  };

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
                hideCoach={this.props.theme && this.props.theme.hideCoach}
                requestVideoAccess={this.requestVideoAccess}
                playbackUrl={this.props.playbackUrl}
                playbackUrlLoading={this.props.playbackUrlLoading}
                accessDenied={this.props.accessDenied}
                videoPurchaseDate={this.props.videoPurchase?.date_created}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <VideoThumbnailList
              videoList={this.props.videoListSimilar}
              loading={this.props.similarVideoLoading}
              hasMoreVideo={this.props.hasMoreVideo}
              hideCoach={this.props.theme && this.props.theme.hideCoach}
              fetchMoreVideo={this.props.fetchMoreVideo}
              onOpenVideo={this.props.openVideo}
            />
          </Grid>
        </Grid>
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
    alignItems: 'center',
    flexDirection: 'column',
  },
  gridContainer: {
    maxWidth: 1400,
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
  theme: themeSelectors.getTheme(state),
  video: withCoach(withCategory(getVideo))(state, ownProps.videoId),
  videoListSimilar: withCoach(withCategory(getVideoList))(state),
  hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
  similarVideoLoading: state.video.loading,
  loading: state.video.loading,
});

const mapDispatchToProps = {
  retrieveVideo: retrieveVideoAction,
  fetchVideoList: fetchVideoListAction,
  fetchMoreVideo: fetchMoreVideoAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  fetchVideoPurchase: fetchVideoPurchaseAction,
  push: pushRouter,
};

const mapHandlers = {
  retrieveVideo: (props: ConnectProps & OwnProps) => () => {
    props.retrieveVideo(props.videoId, {
      onSuccess: (video) => {
        props.fetchAssociatedCoachBulk(video.coaches);
      },
    });
  },
  openVideo: (props: ConnectProps & OwnProps) => (videoId: number) => {
    if (props.openVideo) {
      props.openVideo(videoId, props.companyId, props.companyName);
      return;
    }

    props.push(
      getMarketplaceRoute(
        props.companyName,
        props.companyId,
        `vod/video/${videoId}`,
      ),
    );
  },
  fetchMoreVideo: (props: ConnectProps & OwnProps) => () => {
    props.fetchMoreVideo({
      status: 400,
      similar: props.videoId,
    });
  },
  fetchVideoListSimilar: (props: ConnectProps & OwnProps) => () => {
    props.fetchVideoList(
      {
        status: 400,
        similar: props.videoId,
      },
      1,
      {
        onSuccess: (videoList) => {
          props.fetchAssociatedCoachBulk(
            flatten(videoList.map((v: Video) => v.coaches)),
          );
        },
      },
    );
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

export const MarketplaceVideoDetailDataProvider = compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapHandlers),
);

export default compose(
  routerParamsToProps({
    videoId: 'videoId:number',
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  connect(
    (state: RootState, ownProps: OwnProps) => ({
      authenticated: state.auth.authenticated,
      playbackUrl: getPlaybackUrlById(state, ownProps.videoId),
      playbackUrlLoading: state.video.playbackUrl.loading,
      accessDenied: state.video.playbackUrl.accessDenied,
      videoPurchase: getLastVideoPurchasedByVideo(ownProps.videoId)(state),
    }),
    {
      getPlaybackUrl,
    },
  ),
  MarketplaceVideoDetailDataProvider,
)(MarketplaceVideoDetail);
