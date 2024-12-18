// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Backdrop from '@material-ui/core/Backdrop';

import VideoPlayerBase from './VideoPlayerBase.component';
import { getPlaybackUrl as getPlaybackUrlAPI } from '../api';

export class VideoPlayerDialog extends React.Component<Props> {
  state = { playbackUrl: '' };

  componentDidMount() {
    getPlaybackUrlAPI(this.props.video.id)
      .then((r) => this.setState({ playbackUrl: r.data.playback_url }))
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <React.Fragment>
        <Backdrop open={!this.state.playbackUrl} />
        <Dialog open onClose={this.props.onClose}>
          {!!this.state.playbackUrl && (
            <VideoPlayerBase
              videojsProps={{
                autoplay: false,
                preload: 'auto',
                controls: true,
                sources: [
                  {
                    src: this.state.playbackUrl,
                    type: 'application/x-mpegURL',
                  },
                ],
              }}
            />
          )}
        </Dialog>
      </React.Fragment>
    );
  }
}

export default VideoPlayerDialog;
