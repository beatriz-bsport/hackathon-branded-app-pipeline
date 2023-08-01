import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import getVideoId from 'get-video-id';

type Props = {
  url: string;
};

const YoutubeEmbedVideo: React.FC<Props> = (props) => {
  const classes = useStyles();
  const video = getVideoId(props.url);

  return (
    <div className={classes.container}>
      <div className={classes.iframeWrapper}>
        <iframe
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className={classes.iframe}
          frameBorder="0"
          height="100%"
          src={`https://www.youtube.com/embed/${video.id}`}
          title="youtube-video"
          width="100%"
        />
      </div>
    </div>
  );
};

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
