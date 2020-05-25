// @flow
import React from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';

type Props = {
  t: TFunction,
};

export class VideoPlayerBase extends React.Component<Props> {
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props.videojsProps, () => {});
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.videojsProps.sources[0].src !==
      prevProps.videojsProps.sources[0].src
    ) {
      this.player.src(this.props.videojsProps.sources[0].src);
    }
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div data-vjs-player>
          <video
            style={
              this.props.rounded
                ? {
                    borderRadius: 12,
                    border: '1px transparent rgba(0, 0, 0, 0)',
                  }
                : {}
            }
            ref={(node) => (this.videoNode = node)}
            className="video-js fluid"
          />
        </div>
      </div>
    );
  }
}

export default VideoPlayerBase;
