// @flow
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { withState, compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Skeleton from '@material-ui/lab/Skeleton';
// import ListItem from '@material-ui/core/ListItem';
//
import { VideoProvider } from '@bsport/common/lib/master-data/video-provider.js';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization.js';
import CoachGroupAvatar from '../../associated-coach/components/CoachGroupAvatar.component';

type Props = {
  video: Video,
  hideCoach: boolean,
  onClick: () => void,
  onDeleteVideo: (id: number) => void,
  isPlaying: number,
  menuAchorEl: HTMLElement,
  setMenuAnchorEl: (ev?: HTMLElement) => void,
  loading: boolean,
  coachDisplay?: MarketPlaceCoachDisplay,
};
export const VideoThumbnail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  const { video } = props;
  return (
    <div
      className={clsx(classes.container, 'bs-vod-thumbnail-item__container')}
    >
      <ButtonBase
        disableRipple
        button={!!props.onClick}
        className={clsx(
          classes.buttonContainer,
          'bs-vod-thumbnail-item__button-container',
        )}
        onClick={props.onClick}
      >
        <div
          className={clsx(
            classes.mediaContainer,
            'bs-vod-thumbnail-item__media-container',
          )}
        >
          {!!props.isPlaying && (
            <div
              className={clsx(
                classes.playIconContainer,
                'bs-vod-thumbnail-item__play-icon-container',
              )}
            >
              <PlayCircleOutlineIcon color="primary" fontSize="large" />
            </div>
          )}
          {props.loading ? (
            <Skeleton
              animation="wave"
              className={clsx(
                classes.media,
                'bs-vod-thumbnail-item__cover-loader',
              )}
              variant="rect"
            />
          ) : (
            <img
              alt={video.name}
              className={clsx(classes.media, 'bs-vod-thumbnail-item__cover')}
              src={video.cover_main}
            />
          )}
        </div>
        <div
          className={clsx(
            classes.rightPanel,
            'bs-vod-thumbnail-item__details-container',
          )}
        >
          <div
            className="bs-vod-thumbnail-item__details-sub-container"
            style={{ width: '100%' }}
          >
            <div
              className="bs-vod-thumbnail-item__details-inner-container"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div className="bs-vod-thumbnail-item__details-inner__title-container">
                <Typography
                  align="left"
                  className={clsx(
                    classes.title,
                    'bs-vod-thumbnail-item__details-inner__title',
                  )}
                  variant="subtitle2"
                >
                  {props.loading ? (
                    <Skeleton animation="wave" variant="text" />
                  ) : (
                    video.name
                  )}
                </Typography>
                {props.video.provider_identifier !==
                VideoProvider.EBOOK_PROVIDER ? (
                  <div
                    className={clsx(
                      classes.row,
                      'bs-vod-thumbnail-item__details-inner__duration-container',
                    )}
                  >
                    <AccessTimeIcon
                      className={clsx(
                        classes.leftIcon,
                        'bs-vod-thumbnail-item__details-inner__duration-icon',
                      )}
                      fontSize="small"
                    />
                    <Typography
                      className="bs-vod-thumbnail-item__details-inner__duration"
                      color="textSecondary"
                      variant="body2"
                    >
                      {props.loading ? (
                        <Skeleton animation="wave" variant="text" />
                      ) : (
                        `${t('video.durationMinute', {
                          minute:
                            parseInt(props.video.duration_second / 60, 10) + 1,
                        })}`
                      )}
                    </Typography>
                  </div>
                ) : (
                  <div className={classes.row}>
                    <MenuBookIcon fontSize="small" />
                  </div>
                )}
              </div>
              {!!props.onDeleteVideo && (
                <IconButton
                  onClick={(ev) => props.setMenuAnchorEl(ev.currentTarget)}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </div>
          </div>
          <CoachGroupAvatar
            coachDisplay={props.coachDisplay}
            coaches={video.coaches}
            hideCoach={props.hideCoach}
            loading={props.loading}
            size="small"
          />
        </div>
      </ButtonBase>
      <Menu
        anchorEl={props.menuAchorEl}
        onClose={() => props.setMenuAnchorEl(null)}
        open={!!props.menuAchorEl}
      >
        <MenuItem
          onClick={() => {
            props.setMenuAnchorEl(null);
            props.onDeleteVideo(props.video.id);
          }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={t('playlist.deleteVideo')} />
        </MenuItem>
      </Menu>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flex: 'display',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    '&:hover': {
      opacity: 0.7,
      transition: '.5s ease',
    },
  },
  mediaContainer: {
    height: 90,
    width: 90 * (16 / 9),
    borderRadius: theme.spacing(0.5),
    position: 'relative',
  },
  media: {
    objectFit: 'cover',
    borderRadius: theme.spacing(0.5),
    height: 90,
    width: 90 * (16 / 9),
  },
  playIcon: {
    color: 'white',
  },
  playIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, .5)',
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftIcon: {
    marginRight: theme.spacing(0.5),
  },
  rightPanel: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

export default compose(withState('menuAchorEl', 'setMenuAnchorEl', null))(
  VideoThumbnail,
);
