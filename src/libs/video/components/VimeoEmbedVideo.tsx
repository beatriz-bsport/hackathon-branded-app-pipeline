import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  id: string;
};

const VimeoEmbedVideo: React.FC<Props> = (props) => {
  const classes = useStyles();

  /* eslint-disable */
  return (
    <div className={classes.container}>
      <div className={classes.iframeWrapper}>
        <iframe
          src={`https://player.vimeo.com/video/${props.id}`}
          className={classes.iframe}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
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

export default VimeoEmbedVideo;
