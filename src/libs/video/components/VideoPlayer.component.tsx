// @flow
import React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core';
import { compose } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import { VideoProvider } from '@bsport/common/lib/master-data/video-provider';
import VideoPlayerBase from './VideoPlayerBase.component';
import { Video } from '../types';
import VideoLockOverlay from './VideoLockOverlay.component';

import './videojs-fullscreen.css';
import YoutubeEmbedVideo from './YoutubeEmbedVideo';
import VimeoEmbedVideo from './VimeoEmbedVideo';

type OwnProps = {
  authenticated: boolean;
  video: Video;
  rounded: boolean;
  classes: Object;
  requestVideoAccess: () => void;
  accessDenied: boolean;
  playbackUrlLoading: boolean;
  playbackUrl: string;
};

type Props = WithStyles & OwnProps;

export const VideoPlayer = (props: Props) => {
  const { classes, video } = props;

  if (!props.playbackUrl || props.playbackUrlLoading || props.accessDenied) {
    return (
      <div className={classes.loadingContainer}>
        <div
          className={classes.loadingInner}
          style={
            video && video.cover_main
              ? { backgroundImage: `url(${video.cover_main})` }
              : { backgroundColor: 'black' }
          }
        >
          <div className={classes.circularProgressContainer}>
            {!!props.playbackUrlLoading && (
              <CircularProgress className={classes.circularProgress} />
            )}
            {!props.playbackUrlLoading &&
              (!!props.accessDenied || !props.authenticated) && (
                <VideoLockOverlay
                  accessDenied={props.accessDenied}
                  authenticated={props.authenticated}
                  requestVideoAccess={props.requestVideoAccess}
                />
              )}
          </div>
          <div className={classes.loadingOverlay} />
        </div>
      </div>
    );
  }

  if (props.video.provider_identifier === VideoProvider.YOUTUBE_URL_PROVIDER) {
    return <YoutubeEmbedVideo url={props.playbackUrl} />;
  }

  if (props.video.provider_identifier === VideoProvider.VIMEO_URL_PROVIDER) {
    return <VimeoEmbedVideo id={props.playbackUrl} />;
  }

  return (
    <VideoPlayerBase
      rounded={props.rounded}
      videojsProps={{
        autoplay: false,
        preload: 'auto',
        fluid: true,
        responsive: true,
        controls: true,
        sources: [
          {
            src: props.playbackUrl,
            type: 'application/x-mpegURL',
          },
        ],
      }}
    />
  );
};

const styles = createStyles((theme: Theme) => ({
  loadingContainer: {
    borderRadius: theme.spacing(0.5),
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingInner: {
    backgroundSize: 'cover',

    paddingBottom: '56.25%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressContainer: {
    zIndex: 909,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
  },
  circularProgress: {
    color: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    zIndex: 900,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.4,
    backgroundColor: 'black',
  },
}));

export default compose(
  withTranslation(['video']),
  withStyles(styles),
)(VideoPlayer);
