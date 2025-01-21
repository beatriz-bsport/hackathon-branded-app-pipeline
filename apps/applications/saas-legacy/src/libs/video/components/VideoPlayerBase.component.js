// @flow
import React from 'react';

import { Helmet } from 'react-helmet';
import qualityLevelsPlugin from 'videojs-contrib-quality-levels';
import sourceSelector from 'videojs-http-source-selector';
import hlsQuality from 'videojs-hls-quality-selector';

const VIDEOJS_CSS_LINK = 'https://vjs.zencdn.net/7.10.2/video-js.css';
const VIDEOJS_JS_LINK = 'https://vjs.zencdn.net/7.10.2/video.min.js';

type Props = {
  rounded: boolean,
  videojsProps: {
    sources: Array<{ src: string }>,
  },
};

type State = {
  isVideoJSCSSReady: boolean,
};

class VideoPlayerBase extends React.Component<Props, State> {
  player: Object;

  videoNode: HTMLElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVideoJSCSSReady: false,
    };
  }

  videoJSCallbackRef = (node: HTMLElement) => {
    this.videoNode = node;
    this.startVideoJS();
  };

  startVideoJS = () => {
    if (!this.state.isVideoJSCSSReady || !window.videojs || !this.videoNode) {
      setTimeout(this.startVideoJS, 100);
      return;
    }
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
      <div>
        <Helmet
          onChangeClientState={(addedTags) => {
            if (
              addedTags.linkTags?.length > 0 &&
              addedTags.linkTags[0].href === VIDEOJS_CSS_LINK
            ) {
              this.setState({ isVideoJSCSSReady: true });
            }
          }}
        >
          <link href={VIDEOJS_CSS_LINK} rel="stylesheet" />
          <script src={VIDEOJS_JS_LINK} />
        </Helmet>

        <div data-vjs-player>
          <video
            ref={this.videoJSCallbackRef}
            className="video-js fluid vjs-big-play-centered"
            style={
              this.props.rounded
                ? {
                    borderRadius: 12,
                    border: '1px transparent rgba(0, 0, 0, 0)',
                  }
                : {}
            }
          />
        </div>
      </div>
    );
  }
}

export default VideoPlayerBase;
