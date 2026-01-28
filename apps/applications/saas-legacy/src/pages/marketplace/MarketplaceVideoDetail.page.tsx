import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';
import { ConnectedProps, connect } from 'react-redux';
import flatten from 'lodash/flatten';
import { push as pushRouter } from 'connected-react-router';
import { LinearProgress } from '@material-ui/core';
import clsx from 'clsx';
import {
  createStyles,
  withStyles,
  type WithStyles,
  type Theme,
} from '@material-ui/core/styles';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
// @ts-expect-error
import VideoThumbnailList from '../../libs/video/components/VideoThumbnailList.component';
// @ts-expect-error
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

import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';
import type { Video, VideoPurchase } from '../../libs/video/types';
import { VideoCheckoutComponent } from '../checkout/vod/VideoCheckout.page';
import type { OptionCallback } from '../../state/types';

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type OwnProps = {
  videoId: number;
  companyId: number;
  companyName: string;
  requestSignUp?: () => void;
  openVideo: (videoId: number, companyId: number, companyName: string) => void;
  store?: any;
  accessDenied: boolean;
  authenticated: any;
  getPlaybackUrl: (videoId: number, options?: OptionCallback) => void;
  playbackUrlLoading: boolean;
  playbackUrl: string;
  videoPurchase?: VideoPurchase;
  requestVideoAccess?: () => void;
};

type ConnectProps = ConnectedProps<typeof connector>;

type Props = ConnectProps &
  OwnProps &
  WithHandlerType<typeof mapHandlers> &
  StateHandlerType &
  WithStyles<typeof styles>;

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
      <div
        className={clsx(
          this.props.classes.container,
          'bs-marketplace-vod-detail-page__main-container',
        )}
      >
        {!!this.props.loading && (
          <LinearProgress className="bs-marketplace-vod-detail-page__linear-progress" />
        )}
        <Grid
          container
          className={clsx(
            this.props.classes.gridContainer,
            'bs-marketplace-vod-detail-page__grid-container',
          )}
          direction="row"
          spacing={2}
        >
          <Grid
            item
            className="bs-marketplace-vod-detail-page__vod-player-full__grid-container"
            md={8}
            xs={12}
          >
            {!!this.props.video && (
              <VideoPlayerFull
                accessDenied={this.props.accessDenied}
                authenticated={this.props.authenticated}
                coachDisplay={this.props.companyTheme.coach_display}
                hideCoach={
                  this.props.companyTheme && this.props.companyTheme.hideCoach
                }
                playbackUrl={this.props.playbackUrl}
                playbackUrlLoading={this.props.playbackUrlLoading}
                requestVideoAccess={this.requestVideoAccess}
                video={this.props.video}
                videoPurchaseDate={this.props.videoPurchase?.date_created}
              />
            )}
          </Grid>
          <Grid
            item
            className="bs-marketplace-vod-detail-page__vod-thumbnai-list-grid-container"
            md={4}
            xs={12}
          >
            <VideoThumbnailList
              coachDisplay={this.props.companyTheme.coach_display}
              fetchMoreVideo={this.props.fetchMoreVideo}
              hasMoreVideo={this.props.hasMoreVideo}
              hideCoach={
                this.props.companyTheme && this.props.companyTheme.hideCoach
              }
              loading={this.props.similarVideoLoading}
              onOpenVideo={this.props.openVideo}
              videoList={this.props.videoListSimilar}
            />
          </Grid>
        </Grid>
        {this.props.registerVideoOpen &&
          // @ts-expect-error
          !!this.props.video?.company &&
          // @ts-expect-error
          !!this.props.video?.id && (
            <GenericResponsiveDialog
              noFullScreen
              open
              onClose={() => this.props.setRegisterVideoOpen(false)}
            >
              <VideoCheckoutComponent
                // @ts-expect-error
                companyId={this.props.video.company}
                // @ts-expect-error
                id={this.props.video.id}
                onSuccess={this.onRegisterSuccess}
              />
            </GenericResponsiveDialog>
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
      alignItems: 'center',
      flexDirection: 'column',
    },
    gridContainer: {
      maxWidth: 1400,
    },
  });

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  companyTheme: themeSelectors.getTheme(state),
  // @ts-expect-error
  video: withCoach(withCategory(getVideo))(state, ownProps.videoId),
  videoListSimilar: withCoach(withCategory(getVideoList))(state),
  hasMoreVideo: state.video.list.nextPage && state.video.list.nextPage > 1,
  similarVideoLoading: state.video.loading,
  loading: state.video.loading,
  authenticated: state.auth.authenticated,
  playbackUrl: getPlaybackUrlById(state, ownProps.videoId),
  playbackUrlLoading: state.video.playbackUrl.loading,
  accessDenied: state.video.playbackUrl.accessDenied,
  videoPurchase: getLastVideoPurchasedByVideo(ownProps.videoId)(state),
});

const mapDispatchToProps = {
  retrieveVideo: retrieveVideoAction,
  fetchVideoList: fetchVideoListAction,
  fetchMoreVideo: fetchMoreVideoAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  fetchVideoPurchase: fetchVideoPurchaseAction,
  push: pushRouter,
  getPlaybackUrl,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

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

export const MarketplaceVideoDetailDataProvider = compose<Props, OwnProps>(
  marketplaceCssHoc(),
  withStyles(styles),
  connector,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapHandlers),
);

export default compose(
  routerParamsToProps({
    videoId: 'videoId:number',
    companyId: 'companyId:number',
    // @ts-expect-error
    companyName: 'companyName',
  }),
  MarketplaceVideoDetailDataProvider,
)(MarketplaceVideoDetail);
