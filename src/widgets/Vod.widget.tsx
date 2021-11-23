import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { ButtonBase } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import {
  MarketplaceVideo,
  MarketplaceVideoDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplaceVideo.page';
import {
  MarketplaceVideoDetail,
  MarketplaceVideoDetailDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplaceVideoDetail.page';
import {
  MarketplacePlaylistDetailPage,
  MarketplacePlaylistDetailDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplacePlaylistDetail.page';
import {
  MarketplacePlaylistData,
  MarketplaceVODData,
} from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import {
  bridgeRequestAuthenticationStatus,
  bridgeRequestVideoPlaybackUrl,
} from '../libs/bridge/actions';
import { RootState } from '../reducers';
import { getEnv } from '../utils/env';
import { getVideoPlaybackUrlState } from '../libs/bridge/selectors';

import '../../vendor/video.css';

type OwnProps = {
  companyId: number,
  store: any,
  config: MarketplacePlaylistData & MarketplaceVODData,
  onRequestLogin: () => void,
  theme: Theme,
  onWindowOpen: (popupWindow: any) => void,
  dialogMode: number,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  videoId?: number;
  playlistId?: number;
  searchParams: {
    coaches: string,
    duration_second_range: string,
    SCTs: string,
    search: string,
    levels: string,
  };
  showLogin: boolean;
  showSignup: boolean;
}

const MarketPlaceVideoStyled = themify(
  MarketplaceVideoDataProvider(MarketplaceVideo),
);

const MarketplaceVideoDetailStyled = themify(
  MarketplaceVideoDetailDataProvider(MarketplaceVideoDetail),
);

const MarketplacePlaylistStyled = themify(
  MarketplacePlaylistDetailDataProvider(MarketplacePlaylistDetailPage),
);

class VODWidget extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      videoId: props.config.videoId,
      playlistId: props.config.playlistId,
      searchParams: {
        coaches: '',
        duration_second_range: '',
        SCTs: '',
        search: '',
        levels: '',
      },
    };
  }

  openVideo = (videoId: number) => {
    this.setState({ videoId });
  };

  openPlaylist = (playlistId: number, videoId?: number) => {
    this.setState({ playlistId, videoId });
  };

  setSearchParams = (key: string) => (value: string) => {
    this.setState((prevState) => ({
      searchParams: {
        ...prevState.searchParams,
        [key]: value,
      },
    }));
  };

  requestVideoAccess = () => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/checkout/${this.props.companyId}/vod/${this.state.videoId}`;
    this.props.onWindowOpen(url);
  };

  requestPlaybackUrl = () => {
    this.props.bridgeRequestVideoPlaybackUrl(this.state.videoId);
  };

  render() {
    const showVODList =
      (this.state.videoId === undefined || this.state.videoId === null) &&
      this.state.playlistId === undefined;

    const showVODDetail =
      this.state.videoId !== undefined &&
      this.state.videoId !== null &&
      !this.state.playlistId;

    return (
      <div className={this.props.classes.container}>
        {showVODList && (
          <MarketPlaceVideoStyled
            companyId={this.props.companyId}
            searchParams={this.state.searchParams}
            setSearchParams={this.setSearchParams}
            companyName=""
            openVideo={this.openVideo}
            openPlaylist={(playlistId: number) => this.openPlaylist(playlistId)}
            store={this.props.store}
            theme={this.props.theme}
          />
        )}

        {showVODDetail && (
          <div className={this.props.classes.videoContainer}>
            <ButtonBase
              onClick={() => {
                this.setState({ videoId: undefined });
              }}
            >
              <ChevronLeftIcon
                className={this.props.classes.icon}
                fontSize="large"
              />
            </ButtonBase>

            <div className={this.props.classes.videoDetail}>
              <MarketplaceVideoDetailStyled
                companyId={this.props.companyId}
                videoId={this.state.videoId}
                companyName=""
                requestVideoAccess={this.requestVideoAccess}
                playbackUrlLoading={this.props.playbackUrlLoading}
                accessDenied={this.props.accessDenied}
                getPlaybackUrl={this.requestPlaybackUrl}
                playbackUrl={this.props.playbackUrlData[this.state.videoId]}
                authenticated={this.props.authenticated}
                openVideo={this.openVideo}
                store={this.props.store}
                theme={this.props.theme}
              />
            </div>
          </div>
        )}

        {this.state.playlistId !== undefined && (
          <div className={this.props.classes.videoContainer}>
            <ButtonBase
              onClick={() => {
                this.setState({ videoId: undefined, playlistId: undefined });
              }}
            >
              <ChevronLeftIcon
                className={this.props.classes.icon}
                fontSize="large"
              />
            </ButtonBase>

            <div className={this.props.classes.videoDetail}>
              <MarketplacePlaylistStyled
                companyId={this.props.companyId}
                companyName=""
                id={this.state.playlistId}
                videoId={this.state.videoId}
                authenticated={this.props.authenticated}
                accessDenied={this.props.accessDenied}
                getPlaybackUrl={this.requestPlaybackUrl}
                playbackUrlLoading={this.props.playbackUrlLoading}
                playbackUrl={this.props.playbackUrlData[this.state.videoId]}
                requestVideoAccess={this.requestVideoAccess}
                goToVideoInPlaylist={this.openPlaylist}
                replaceVideoInPlaylist={this.openPlaylist}
                store={this.props.store}
                theme={this.props.theme}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  icon: {},
  videoContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  },
  videoDetail: {
    display: 'block',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

const mapStateToProps = (state: RootState) => ({
  authenticated: state.bridge.authentication.authenticated,
  playbackUrlData: getVideoPlaybackUrlState(state),
  playbackUrlLoading: state.bridge.video.playbackUrl.loading,
  accessDenied: state.bridge.video.playbackUrl.accessDenied,
});

const mapDispatchToProps = {
  requestAuthenticationStatus: bridgeRequestAuthenticationStatus,
  bridgeRequestVideoPlaybackUrl,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(VODWidget);
