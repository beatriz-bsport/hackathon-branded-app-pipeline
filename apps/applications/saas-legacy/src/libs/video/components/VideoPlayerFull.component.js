// @flow
import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import clx from 'classnames';
import { VideoProvider } from '@bsport/common/master-data/video-provider.js';
import { MarketPlaceCoachDisplay } from '@bsport/common/master-data/personalization.js';
import { DateTime } from 'luxon';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';

import CoachChip from '../../associated-coach/components/CoachChip.component';
import SCT from '../../category/components/SCT.component';

import VideoPlayer from './VideoPlayer.component';
import { Video } from '../types';

type Props = {
  video: Video,
  authenticated: boolean,
  hideCoach: boolean,
  requestVideoAccess: () => void,
  managerOnly?: boolean,
  playbackUrl: string,
  playbackUrlLoading: boolean,
  accessDenied: boolean,
  videoPurchaseDate: string,
  coachDisplay?: MarketPlaceCoachDisplay,
};

export const VideoPlayerFull = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  const coaches = props.video.coaches.filter((c) => !!c);
  return (
    <div
      className={classNames(classes.container, 'bs-vod-player-full__container')}
    >
      <VideoPlayer
        rounded
        accessDenied={props.accessDenied}
        authenticated={props.authenticated}
        playbackUrl={props.playbackUrl}
        playbackUrlLoading={props.playbackUrlLoading}
        requestVideoAccess={props.requestVideoAccess}
        video={props.video}
      />
      <div
        className={classNames(
          classes.inner,
          'bs-vod-player-full__inner-container',
        )}
      >
        <Typography
          className={classNames(
            classes.videoTitle,
            'bs-vod-player-full__vod-name',
          )}
          variant="h4"
        >
          {`${props.video.name}`}
        </Typography>
        <div
          className={classNames(
            classes.row,
            'bs-vod-player-full__vod-duration',
          )}
        >
          {props.video.provider_identifier !== VideoProvider.EBOOK_PROVIDER && (
            <div className={classes.row}>
              <AccessTimeIcon className={classes.timeIcon} />
              <Typography className={classes.timeTypography} variant="body2">
                {t('video.durationMinute', {
                  minute: parseInt(props.video.duration_second / 60, 10),
                })}
              </Typography>
            </div>
          )}
          {!!(props.video && props.video.SCT && props.video.SCT?.SCS) && (
            <SCT
              parentCategory={props.video.SCT?.SCS?.id}
              SCTName={props.video.SCT?.name}
            />
          )}
          {props.video.rental_days > 0 && (
            <div className={clx([classes.row, classes.rental])}>
              <PlayCircleOutlineIcon />
              <Typography
                className={classNames(
                  classes.managerOnlyText,
                  'bs-vod-player-full__rental-details',
                )}
              >
                {props.accessDenied || !props.videoPurchaseDate
                  ? t('video.rental.duration', {
                      rental_days: props.video.rental_days,
                    })
                  : t('video.rental.expirationDate', {
                      interpolation: {
                        escapeValue: false,
                      },
                      expiration_date: DateTime.fromISO(props.videoPurchaseDate)
                        .plus({ days: props.video.rental_days })
                        .toFormat('D'),
                    })}
              </Typography>
            </div>
          )}
        </div>
        {props.managerOnly && (
          <div className={classes.managerOnlyContainer}>
            <VisibilityOffIcon />
            <Typography className={classes.managerOnlyText} variant="body2">
              {t('video.manager_only')}
            </Typography>
          </div>
        )}
        {!!coaches.length && !props.hideCoach && (
          <div
            className={classNames(
              classes.coachContainer,
              'bs-vod-player-full__coaches-container',
            )}
          >
            {coaches.map((c) => (
              <CoachChip
                key={c.id}
                className={classNames(
                  classes.coachChip,
                  'bs-vod-player-full__coach',
                )}
                coach={c}
                coachDisplay={props.coachDisplay}
              />
            ))}
          </div>
        )}
        <TypographyMultiline
          className="bs-vod-player-full__description"
          color="textSecondary"
          whiteSpace="pre-wrap"
        >
          {props.video.description}
        </TypographyMultiline>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  inner: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
  videoTitle: {
    marginBottom: theme.spacing(2),
  },
  coachContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(6),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  coachChip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  managerOnlyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  managerOnlyText: {
    marginLeft: theme.spacing(1),
  },
  timeIcon: {
    height: 26,
    width: 26,
    marginRight: theme.spacing(1),
  },
  timeTypography: {
    marginRight: theme.spacing(2),
  },
  rental: {
    marginLeft: theme.spacing(2),
  },
}));

export default VideoPlayerFull;
