import React from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import PlaylistItemMarketplace from './PlaylistItemMarketplace.component';
import type { Playlist } from '../types';

type Props = {
  playlistList: Playlist<number>[];
  openPlaylist: (
    playlistId: number,
    companyId?: number,
    companyName?: string,
  ) => void;
  onShowMore: () => void;
  hasMorePlaylist: boolean;
};

const PlaylistListMarketPlace: React.FC<Props> = ({
  playlistList: playlists,
  openPlaylist,
  onShowMore,
  hasMorePlaylist,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('video');
  return (
    <div
      className={classNames(
        classes.playlistListContainer,
        'bs-marketplace-vod__playlist-list-main-container',
      )}
    >
      <Typography
        className="bs-marketplace-vod__playlist-list-title"
        component="h3"
        variant="h6"
      >
        {t('playlist.playlist')}
      </Typography>
      <div
        className={classNames(
          classes.playlistItemsContainer,
          'bs-marketplace-vod__playlist-list-sub-container',
        )}
      >
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={classNames(
              classes.playlistListItem,
              'bs-marketplace-vod__playlist-list-item',
            )}
          >
            <PlaylistItemMarketplace
              description={playlist.description}
              imageUrl={playlist.cover_main}
              onClick={() => openPlaylist(playlist.id)}
              title={playlist.name}
              videoCountDescription={t('video.thumbnailList.count', {
                count: playlist.videos.length,
              })}
            />
          </div>
        ))}
      </div>
      {hasMorePlaylist && (
        <div
          className={classNames(
            classes.buttonContainer,
            'bs-marketplace-vod__playlist__show-more-button-container',
          )}
        >
          <Button
            className="bs-marketplace-vod__playlist__show-more-button"
            color="primary"
            onClick={onShowMore}
            variant="contained"
          >
            {t('video.showMore')}
          </Button>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  playlistListContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '20%',
    border: 'solid',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderTopWidth: 1,
    paddingTop: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      borderLeftWidth: 1,
      borderTopWidth: 0,
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
  playlistItemsContainer: {
    marginLeft: -8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      flexWrap: 'no-wrap',
      maxWidth: 300,
      marginTop: 20,
    },
  },
  playlistListItem: {
    padding: 8,
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexBasis: `${100 / 3}%`,
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
    },
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(PlaylistListMarketPlace);
