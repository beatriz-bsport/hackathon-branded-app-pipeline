// @flow

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import VideocamIcon from '@material-ui/icons/Videocam';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import { pure } from 'recompose';

import Level from '../../../components/category/Level.component';

import { formatAsTime } from '../../../datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import { isOfferInThePast } from '../utils';

type Props = {
  offer: Offer,
  selected: ?boolean,
  showOfferFilling: boolean,
  establishmentLoading: boolean,
  activityLoading: boolean,
  onClick: () => void,
  actions?: any,
};

export const MarketplaceOffer = (props: Props) => {
  const { offer, selected } = props;
  const classes = useStyles();
  const { available } = offer;
  const isInThePast = isOfferInThePast(offer);

  /* eslint-disable */

  const coachName =
    offer.coach_override && offer.coach_override.name
      ? offer.coach_override.name
      : offer.coach && offer.coach && offer.coach.name
      ? offer.coach.name
      : ' - ';

  const metaActivityName =
    offer.meta_activity && offer.meta_activity
      ? offer.meta_activity.name
      : ' - ';

  const establishmentName =
    offer.establishment_override && offer.establishment_override.title
      ? offer.establishment_override.title
      : offer.establishment && offer.establishment.title
      ? offer.establishment.title
      : ' - ';
  /* eslint-enable */
  return (
    <ListItem
      button={isInThePast && !available}
      selected={selected}
      onClick={props.onClick}
      divider
      style={{
        borderLeft: '5px solid',
        borderLeftColor: offer.meta_activity_color
          ? offer.meta_activity_color
          : '#FFFFFF00',
      }}
    >
      <Hidden xsDown>
        <ListItemAvatar>
          <CoachAvatar
            coach={offer.coach}
            coach_override={offer.coach_override}
          />
        </ListItemAvatar>
      </Hidden>
      <ListItemText
        primary={
          <div className={classes.primaryTextContainer}>
            <div className={classes.inlineContainer}>
              {(props.activityLoading && metaActivityName === ' - ') ||
              !offer.establishment.tzname ? (
                <MoreHorizIcon fontSize="small" className={classes.icon} />
              ) : (
                <div className={classes.offerTitleText}>
                  {offer.meta_activity && offer.meta_activity.is_broadcast ? (
                    <VideocamIcon className={classes.videocamIcon} />
                  ) : null}
                  <Typography>
                    {`${metaActivityName} ${formatAsTime(
                      offer.date_start,
                      offer.establishment.tzname,
                    )}-${formatAsTime(
                      moment(offer.date_start).add(
                        offer.duration_minute,
                        'minute',
                      ),
                      offer.establishment.tzname,
                    )}`}
                  </Typography>
                </div>
              )}
            </div>
            <div className={classes.levelCoachContainer}>
              <Level
                noStyle
                variant="caption"
                align="left"
                levelId={offer.level ? offer.level : null}
              />
              <Typography
                className={classes.coachName}
                inline
                variant="caption"
              >
                {`  ${coachName}${
                  props.showOfferFilling
                    ? ` (${offer.tot_slots}/${offer.effectif})`
                    : ''
                }`}
              </Typography>
            </div>
          </div>
        }
        secondary={
          props.establishmentLoading && establishmentName === ' - ' ? (
            <MoreHorizIcon fontSize="small" />
          ) : (
            establishmentName
          )
        }
      />
      {props.actions ? (
        <ListItemSecondaryAction>{props.actions}</ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    primaryTextContainer: { flexDirection: 'column', alignItems: 'flex-start' },
    inlineContainer: { alignItems: 'center', display: 'flex' },
    icon: { marginRight: theme.spacing(2) },
    levelCoachContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      display: 'flex',
    },
    coachName: { marginLeft: theme.spacing(2) },
    offerTitleText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    videocamIcon: {
      marginRight: theme.spacing(0.5),
    },
  };
});

export default pure(MarketplaceOffer);
