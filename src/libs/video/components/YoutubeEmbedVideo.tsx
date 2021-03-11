import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  videoId: string;
};

const YoutubeEmbedVideo: React.FC<Props> = (props) => {
  const classes = useStyles();

  /* eslint-disable */
  return (
    <div className={classes.container}>
      <div className={classes.iframeWrapper}>
        <iframe
          title="youtube-video"
          className={classes.iframe}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${props.videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

/* eslint-enable */

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
  },
  iframeWrapper: {
    width: '100%',
    paddingTop: '56.25%',
    position: 'relative',
  },
  iframe: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}));

export default YoutubeEmbedVideo;
