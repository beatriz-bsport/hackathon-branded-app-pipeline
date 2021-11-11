// @flow
import React from 'react';

import { Helmet } from 'react-helmet';
import qualityLevelsPlugin from 'videojs-contrib-quality-levels';
import sourceSelector from 'videojs-http-source-selector';
import hlsQuality from 'videojs-hls-quality-selector';

type Props = {
  rounded: boolean,
  videojsProps: {
    sources: Array<{ src: string }>,
  },
};

export class VideoPlayerBase extends React.Component<Props> {
  player: Object;

  videoNode: HTMLElement;

  onVideoJSRef = (ref: any) => {
    this.videoNode = ref;
    this.startVideoJS();
  };

  startVideoJS = () => {
    if (window.videojs && this.videoNode) {
      this.player = window.videojs(
        this.videoNode,
        this.props.videojsProps,
        () => {
          window.videojs.registerPlugin('qualityLevels', qualityLevelsPlugin);
          window.videojs.registerPlugin('sourceSelector', sourceSelector);
          window.videojs.registerPlugin('hlsQuality', hlsQuality);

          this.player = window.videojs(
            this.videoNode,
            this.props.videojsProps,
            () => {
              const qualityLevels = this.player.qualityLevels();
              qualityLevels.on('addqualitylevel', (event) => {
                const { qualityLevel } = event;
                qualityLevel.enabled = true;
              });
              this.player.hlsQuality();
            },
          );
        },
      );
    } else {
      setTimeout(this.startVideoJS, 100);
    }
  };

  componentDidUpdate(prevProps: Props) {
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
      /* eslint-disable */
      <div>
        <Helmet>
          <link
            href="https://vjs.zencdn.net/7.10.2/video-js.css"
            rel="stylesheet"
          />
          <script src="https://vjs.zencdn.net/7.10.2/video.min.js"></script>
        </Helmet>

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
            ref={this.onVideoJSRef}
            className="video-js fluid vjs-big-play-centered"
          />
        </div>
      </div>
    );
    /* eslint-enable */
  }
}

export default VideoPlayerBase;
