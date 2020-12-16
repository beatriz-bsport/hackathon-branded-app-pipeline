// @flow

import React from 'react';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  title: string,
  description: string,
  imageUrl: string,
  videoCount: number,
  onClick: () => void,
};

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  },

  playlistItem__image_wrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.2%',
    overflow: 'hidden',
  },

  img: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },

  image_wrapper__count_wrapper: {
    position: 'absolute',
    zIndex: '1',
    paddingTop: '100%',
    height: '100%',
    width: '100%',
    opacity: '0.5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transition: 'all 0.3s',
    '&:hover': {
      paddingTop: '0%',
      backgroundColor: 'black',
    },
  },

  image_wrapper__playlist_icon: {
    marginLeft: '5px',
  },

  playlist_item__content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '8px',
    width: '100%',
  },
}));

const MarketplacePlaylistItem = (props: Props) => {
  const { title, description, imageUrl, videoCount, onClick } = props;
  const classes = useStyles();

  return (
    <ButtonBase onClick={onClick}>
      <div className={classes.container}>
        <div className={classes.playlistItem__image_wrapper}>
          <img src={imageUrl} className={classes.img} alt="playlist" />
          <div className={classes.image_wrapper__count_wrapper}>
            <Typography variant="h6" component="h3">
              {videoCount}
            </Typography>
            <VideoLibraryIcon
              className={classes.image_wrapper__playlist_icon}
              fontSize="large"
            />
          </div>
        </div>

        <div className={classes.playlist_item__content}>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>

          <Typography variant="body2" color="textSecondary" align="left">
            {description}
          </Typography>
        </div>
      </div>
    </ButtonBase>
  );
};

export default MarketplacePlaylistItem;
