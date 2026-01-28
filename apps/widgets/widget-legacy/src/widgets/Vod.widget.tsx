import React, { useState } from 'react';
import { compose } from 'recompose';
import { ButtonBase } from '@material-ui/core';
import {
  createStyles,
  withStyles,
} from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import type { WithStyles } from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import MarketplaceVideo from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceVideo.page';
import MarketplaceVideoDetail from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceVideoDetail.page';
import MarketplacePlaylistDetailPage from '@bsport/saas-legacy/src/pages/marketplace/MarketplacePlaylistDetail.page';
import {
  MarketplacePlaylistData,
  MarketplaceVODData,
} from '@bsport/saas-legacy/src/libs/marketplace/types';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';
import { getEnv } from '../utils/env';

import '../../vendor/video.css';

type OwnProps = {
  companyId: number;
  config: MarketplacePlaylistData & MarketplaceVODData;
  onRequestLogin: () => void;
  onWindowOpen: (popupWindow: any) => void;
  dialogMode: number;
};

type Props = OwnProps & WithStyles<typeof styles>;

const MarketPlaceVideoStyled = themify(MarketplaceVideo);
const MarketplaceVideoDetailStyled = themify(MarketplaceVideoDetail);
const MarketplacePlaylistStyled = themify(MarketplacePlaylistDetailPage);

const VODWidget = (props: Props) => {
  const { companyId, onWindowOpen, classes } = props;
  const [videoId, setVideoId] = useState(props.config.videoId);
  const [playlistId, setPlaylistId] = useState(props.config.playlistId);
  const [searchParams, setSearchParams] = useState({
    coaches: '',
    duration_second_range: '',
    SCTs: '',
    search: '',
    levels: '',
  });

  const openVideo = (videoId: number) => {
    setVideoId(videoId);
  };

  const openPlaylist = (playlistId: number, videoId?: number) => {
    setPlaylistId(playlistId);
    setVideoId(videoId);
  };

  const updateSearchParams = (key: string) => (value: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const requestVideoAccess = () => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/checkout/${companyId}/vod/${videoId}`;
    onWindowOpen(url);
  };

  const showVODList =
    (videoId === undefined || videoId === null) && playlistId === undefined;

  const showVODDetail =
    videoId !== undefined && videoId !== null && !playlistId;

  return (
    <div className={classes.container}>
      {showVODList && (
        <MarketPlaceVideoStyled
          companyId={companyId}
          searchParams={searchParams}
          setSearchParams={updateSearchParams}
          companyName=""
          openVideo={openVideo}
          openPlaylist={(playlistId: number) => openPlaylist(playlistId)}
        />
      )}

      {showVODDetail && (
        <div className={classes.videoContainer}>
          <ButtonBase onClick={() => setVideoId(undefined)}>
            <ChevronLeftIcon className={classes.icon} fontSize="large" />
          </ButtonBase>

          <div className={classes.videoDetail}>
            <MarketplaceVideoDetailStyled
              companyId={companyId}
              videoId={videoId}
              companyName=""
              requestVideoAccess={requestVideoAccess}
              openVideo={openVideo}
            />
          </div>
        </div>
      )}

      {playlistId !== undefined && (
        <div className={classes.videoContainer}>
          <ButtonBase
            onClick={() => {
              setVideoId(undefined);
              setPlaylistId(undefined);
            }}
          >
            <ChevronLeftIcon className={classes.icon} fontSize="large" />
          </ButtonBase>

          <div className={classes.videoDetail}>
            <MarketplacePlaylistStyled
              companyId={companyId}
              companyName=""
              id={playlistId}
              videoId={videoId}
              requestVideoAccess={requestVideoAccess}
              goToVideoInPlaylist={openPlaylist}
              replaceVideoInPlaylist={openPlaylist}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = () =>
  createStyles({
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

export default compose<Props, OwnProps>(withStyles(styles))(VODWidget);
