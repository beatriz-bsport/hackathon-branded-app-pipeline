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

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization.js';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach.js';
import type { Offer } from '#src/libs/offer/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { OffersGroup } from '#src/libs/group-offer/types';
import type { Level } from '#src/libs/level/types';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import { getLevelTranslation } from '#src/libs/level/utils';
import {
  formatAsDatetimeAdapted,
  formatISOStringAsTime,
} from '../../utils/datetime';

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
