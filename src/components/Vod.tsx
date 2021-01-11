import React from 'react';

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

import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { ButtonBase, withStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { compose } from 'recompose';

import './video.css';

interface Props {
  companyId: number;
  store: any;
  data: {
    videoId?: number;
    playlistId?: number;
  }
  classes: any
  onRequestLogin: () => void;
}

interface State {
  videoId?: number;
  playlistId?: number;
}


const MarketPlaceVideoStyled = themify(
  MarketplaceVideoDataProvider(MarketplaceVideo)
);

const MarketplaceVideoDetailStyled = themify(
  MarketplaceVideoDetailDataProvider(MarketplaceVideoDetail)
);

const MarketplacePlaylistStyled = themify(
  MarketplacePlaylistDetailDataProvider(MarketplacePlaylistDetailPage)
);


class VODWidget extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      videoId: props.data.videoId,
      playlistId: props.data.playlistId,
    };
  }

  openVideo = (videoId: number) => {
    this.setState({ videoId });
  };

  openPlaylist = (playlistId: number, videoId?: number) => {
    this.setState({ playlistId, videoId });
  }

  onRequestBuyPass = () => {

  }



  render() {
    return (
      <div className={this.props.classes.container}>
        {(this.state.videoId === undefined && this.state.playlistId === undefined) && (
          <MarketPlaceVideoStyled
            companyId={this.props.companyId}
            companyName=""
            openVideo={this.openVideo}
            openPlaylist={(playlistId: number) => this.openPlaylist(playlistId)}
            searchParams={{
              coaches: "",
              duration_second_range: "",
              SCTs: "",
              search: "",
              levels: "",
            }}
            store={this.props.store}
          />
        )}

        {this.state.videoId !== undefined && !this.state.playlistId && (
          <div className={this.props.classes.videoContainer}>
            <ButtonBase onClick={() => {
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
                requestSignUp={this.props.onRequestLogin}
                onRequestBuyPass={this.onRequestBuyPass}
                openVideo={this.openVideo}
                searchParams={{
                  coaches: "",
                  duration_second_range: "",
                  SCTs: "",
                  search: "",
                  levels: "",
                }}
                store={this.props.store}
              />
            </div>
          </div>
        )}

        {this.state.playlistId !== undefined && (
          <div className={this.props.classes.videoContainer}>
            <ButtonBase onClick={() => {
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
                requestSignUp={this.props.onRequestLogin}
                goToVideoInPlaylist={this.openPlaylist}
                replaceVideoInPlaylist={this.openPlaylist}
                store={this.props.store}
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
  icon: {
  },
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

export default compose(
  // @ts-ignore
  withStyles(styles)
)(VODWidget);
