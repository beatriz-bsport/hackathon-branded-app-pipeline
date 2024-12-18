// @flow
import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import VideoThumbnail from './VideoThumbnail.component';

import TypographyWithShowMore from '../../../components/typo/TypographyWithShowMore.component';

type Props = {
  title: string,
  count: number,
  hideCoach: boolean,
  description: string,
  videoList: Array<Video>,
  onDeleteVideo?: (id: number) => void,

  onOpenVideo: (id: number) => void,
  videoPlayingId: number,
  loading: boolean,
  hasMoreVideo?: boolean,
  fetchMoreVideo: () => void,
  onAddVideo: () => void,
  coachDisplay?: MarketPlaceCoachDisplay,
};

export const VideoThumbnailList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  return (
    <div
      className={classNames(
        classes.container,
        'bs-vod-thumbnail-list__container',
      )}
    >
      <div
        className={classNames(classes.header, 'bs-vod-thumbnail-list__header')}
      >
        <Typography
          className="bs-vod-thumbnail-list__title"
          component="h4"
          variant="h5"
        >
          {props.title || t('video.thumbnailList.similarVideoTitle')}
        </Typography>

        {!!props.count && (
          <Typography
            className="bs-vod-thumbnail-list__counter"
            color="primary"
          >
            {t('video.thumbnailList.count', { count: props.count })}
          </Typography>
        )}
        {!!props.description && (
          <div>
            <TypographyWithShowMore
              multiline
              className="bs-vod-thumbnail-list__description"
              color="textSecondary"
              variant="body"
              whiteSpace="pre-wrap"
            >
              {props.description}
            </TypographyWithShowMore>
          </div>
        )}
        <Divider className={classes.divider} />
      </div>
      <div
        className={classNames(
          classes.contentList,
          'bs-vod-thumbnail-list__vod-thumbnail-list-container',
        )}
      >
        {props.videoList
          .filter((v) => !!v)
          .map((v) => (
            <div
              key={v.id}
              className={classNames(
                classes.thumbnailContainer,
                'bs-vod-thumbnail-list__vod-thumbnail-list-item',
              )}
            >
              <VideoThumbnail
                coachDisplay={props.coachDisplay}
                hideCoach={props.hideCoach}
                isPlaying={props.videoPlayingId === v.id}
                loading={props.loading}
                onClick={() => props.onOpenVideo(v.id)}
                onDeleteVideo={props.onDeleteVideo}
                video={v}
              />
            </div>
          ))}
        {!props.loading && !!props.hasMoreVideo && !!props.fetchMoreVideo && (
          <Button
            className={classNames(
              classes.fetchMoreButton,
              'bs-vod-thumbnail-list__show-more-button',
            )}
            color="primary"
            onClick={props.fetchMoreVideo}
            variant="outlined"
          >
            {t('video.showMore')}
          </Button>
        )}
        {!!props.onAddVideo && (
          <ListItem button onClick={props.onAddVideo}>
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary={t('video.thumbnailList.addVideo')} />
          </ListItem>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: 'white',
    // backgroundColor: '#F2F2F2',
  },
  header: {
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  thumbnailContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    maxHeight: '80vh',
    overflowY: 'auto',
    overflowX: 'auto',
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  fetchMoreButton: {
    marginTop: theme.spacing(1),
  },
}));

export default VideoThumbnailList;
