// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import LockIcon from '@material-ui/icons/Lock';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import VideoPlayerBase from './VideoPlayerBase.component';
import { getPlaybackUrl as getPlaybackUrlAPI } from '../api';

import './videojs-fullscreen.css';

type Props = {
  t: TFunction,
};

export class VideoPlayer extends React.Component<Props> {
  state = { playbackUrl: '', playbackLoading: false, accessDenied: false };

  componentDidMount() {
    this.getPlaybackUrl();
  }

  getPlaybackUrl = () => {
    if (this.props.video && this.props.authenticated) {
      this.setState({ playbackLoading: true });
      getPlaybackUrlAPI(this.props.video.id)
        .then((r) =>
          this.setState({
            playbackLoading: false,
            playbackUrl: r.data.playback_url,
          }),
        )
        .catch((err) => {
          if (err.response.status === 403) {
            this.setState({ playbackLoading: false, accessDenied: true });
          } else {
            console.error(err);
          }
        });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.video &&
      ((!prevProps.authenticated && this.props.authenticated) ||
        (!prevProps.video || prevProps.video.id !== this.props.video.id))
    ) {
      this.getPlaybackUrl();
    }
  }

  render() {
    const { classes, video } = this.props;
    if (!this.state.playbackUrl || this.state.playbackLoading) {
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
              {!!this.state.playbackLoading && (
                <CircularProgress className={classes.circularProgress} />
              )}
              {!this.state.playbackLoading &&
                (!!this.state.accessDenied || !this.props.authenticated) && (
                  <React.Fragment>
                    <LockIcon className={classes.lockIcon} />
                    <Typography align="center" className={classes.lockText}>
                      {!this.props.authenticated &&
                        this.props.t('video.lock.pleaseAuthenticated')}
                      {this.props.authenticated &&
                        this.state.accessDenied &&
                        this.props.t('video.lock.accessDenied')}
                    </Typography>
                  </React.Fragment>
                )}
            </div>
            <div className={classes.loadingOverlay} />
          </div>
        </div>
      );
    }
    return (
      <VideoPlayerBase
        rounded={this.props.rounded}
        videojsProps={{
          autoplay: false,
          preload: 'auto',
          fluid: true,
          responsive: true,
          controls: true,
          sources: [
            {
              src: this.state.playbackUrl,
              type: 'application/x-mpegURL',
            },
          ],
        }}
      />
    );
  }
}

const styles = (theme) => ({
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
    zIndex: 9009,
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
  lockText: {
    color: 'white',
    marginTop: theme.spacing(2),
  },
  lockIcon: {
    color: 'white',
    height: 64,
    width: 64,
  },
  loadingOverlay: {
    position: 'absolute',
    zIndex: 9000,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.4,
    backgroundColor: 'black',
  },
});

export default compose(
  withTranslation(['video']),
  withStyles(styles),
)(VideoPlayer);
