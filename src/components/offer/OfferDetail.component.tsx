import React, { memo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FolderIcon from '@material-ui/icons/Folder';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach';
import {
  formatAsDatetimeAdapted,
  formatISOStringAsTime,
} from '../../utils/datetime';
import Tooltip from '#components/Tooltip.component';
import type { Offer } from '#libs/offer/types';
import { AdditionalCoachesTooltipTitle } from '#libs/associated-coach/components/CoachToolTip.component';
import CustomAvatarGroup from '#components/CustomAvatarGroup.component';
import type { Coach } from '#libs/associated-coach/types';
import type { Establishment } from '#libs/establishment/types';
import type { OffersGroup } from '#libs/group-offer/types';
import { ADDITIONAL_COACHES_MAX_DISPLAY } from '#libs/offer/constants';
import type { Level } from '#libs/level/types';
import { CustomChip } from '#components/chip/CustomChip.component';
import { getLevelTranslation } from '#libs/level/utils';

type Props = {
  offer: Offer<
    Coach,
    Establishment,
    number,
    number,
    number,
    OffersGroup,
    Level
  > & { customLevel: Level };
  coachDisplay?: MarketPlaceCoachDisplay;
};

const OfferDetail: React.FC<Props> = ({ offer, coachDisplay }) => {
  const classes = useStyles();
  const { t } = useTranslation(['offer', 'marketplace', 'communication']);

  const theme = useTheme();

  const isBroadcast =
    offer.is_broadcast ||
    // @ts-expect-error
    offer.meta_activity?.is_broadcast;

  const areDisplayedChips = !!offer.customLevel || isBroadcast;

  const coach = offer.coach_override || offer.coach || null;
  const allImageLinks =
    offer?.additional_coaches?.map((offerCoach) => offerCoach?.photo ?? '') ||
    [];
  const slicedImageLinks =
    allImageLinks.length > ADDITIONAL_COACHES_MAX_DISPLAY
      ? allImageLinks.slice(0, ADDITIONAL_COACHES_MAX_DISPLAY)
      : allImageLinks;

  const coachName = getCoachDisplayName(
    coachDisplay,
    coach?.name,
    coach?.firstname,
  );

  return (
    <div className={classes.container}>
      {areDisplayedChips && (
        <div className={classes.chipContainer}>
          {!!offer.customLevel && (
            <div className={classes.levelContainer}>
              <CustomChip
                displayedValue={getLevelTranslation(
                  offer.customLevel.id,
                  offer.customLevel.name,
                  t,
                )}
              />
            </div>
          )}
          {isBroadcast && (
            <CustomChip
              displayedValue={t('marketplace:calendar.broadcast')}
              icon="Videocam"
              iconColor={theme.palette.primary.main}
              mainColor={theme.palette.primary.main}
            />
          )}
        </div>
      )}

      <div className={classes.sectionContainer}>
        <ListItem disableGutters classes={{ root: classes.denseListItem }}>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText
            primary={formatISOStringAsTime(
              offer.date_start,
              offer.timezone_name,
            )}
            secondary={formatAsDatetimeAdapted(
              offer.date_start,
              'DDD',
              offer.timezone_name,
            )}
          />
        </ListItem>
      </div>
      {!!coach && (
        <div className={classes.sectionContainer}>
          <ListItem disableGutters classes={{ root: classes.denseListItem }}>
            <ListItemAvatar>
              <Avatar src={coach.photo} />
            </ListItemAvatar>
            <ListItemText primary={coachName} />
          </ListItem>
        </div>
      )}
      {!!offer?.additional_coaches?.length && (
        <div className={classes.sectionContainer}>
          <ListItem disableGutters classes={{ root: classes.denseListItem }}>
            <Tooltip
              title={
                <AdditionalCoachesTooltipTitle
                  coaches={offer.additional_coaches}
                />
              }
            >
              <ListItemAvatar className={classes.additionalCoachAvatarList}>
                <CustomAvatarGroup
                  imgLinks={slicedImageLinks}
                  imgStyle={classes.additionalCoachAvatar}
                />
              </ListItemAvatar>
            </Tooltip>
            <ListItemText
              primary={t('additionalCoaches', {
                count: offer.additional_coaches?.length,
              })}
            />
          </ListItem>
        </div>
      )}
      {!!offer.establishment && (
        <div className={classes.sectionContainer}>
          <ListItem disableGutters classes={{ root: classes.denseListItem }}>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                offer.establishment ? offer.establishment.title : '  -  '
              }
              secondary={
                offer.establishment && offer.establishment.location
                  ? offer.establishment.location.address
                  : '  -  '
              }
            />
          </ListItem>
        </div>
      )}
      {!!offer?.group && (
        <div className={classes.sectionContainer}>
          <ListItem disableGutters classes={{ root: classes.denseListItem }}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={offer.group?.name} />
          </ListItem>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(4),
  },
  additionalCoachAvatarList: {
    marginRight: theme.spacing(2),
  },
  additionalCoachAvatar: {
    height: theme.spacing(5),
    width: theme.spacing(5),
    marginRight: 0,
  },
  denseListItem: {
    width: '100%',
    display: 'flex',
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxSizing: 'border-box',
    paddingBottom: 0,
    paddingTop: 0,
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelContainer: {
    paddingRight: theme.spacing(2),
  },
}));

export default memo(OfferDetail);
