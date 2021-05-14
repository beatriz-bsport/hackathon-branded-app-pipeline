// @flow

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles } from '@material-ui/core/styles';

import moment from 'moment-timezone';
import MarketplaceBookButton from './MarketplaceBookButton.component';
import Level from '../../../components/category/Level.component';

import { formatAsTime } from '../../../utils/datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import { isOfferInThePast } from '../utils';

type Props = {
  offer: Offer,
  selected: ?boolean,
  onClickOffer: ?(offerId: number) => void,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  showOfferFilling: boolean,
  establishmentLoading: boolean,
  activityLoading: boolean,
};

export const MarketplaceOffer = (props: Props) => {
  const { offer, selected, onClickOffer } = props;
  const { available } = offer;
  const classes = useStyles();

  const isInThePast = isOfferInThePast(offer);

  /* eslint-disable */

  const coachName =
    offer.coach_override && offer.coach_override.name
      ? offer.coach_override.name
      : offer.coach && offer.coach && offer.coach.name
      ? offer.coach.name
      : ' - ';

  const metaActivityName = offer.meta_activity.name || ' - ';

  const establishmentName =
    offer.establishment_override && offer.establishment_override.title
      ? offer.establishment_override.title
      : offer.establishment && offer.establishment.title
      ? offer.establishment.title
      : ' - ';
  /* eslint-enable */

  const onClick =
    onClickOffer && isInThePast ? () => onClickOffer(offer.id) : null;
  return (
    <ListItem
      button={isInThePast && !available}
      selected={selected}
      onClick={onClick}
      divider
      style={{
        borderLeft: '5px solid',
        borderLeftColor: offer.meta_activity_color
          ? offer.meta_activity_color
          : '#FFFFFF00',
      }}
    >
      <Hidden smDown>
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
                <Typography inline>
                  {`${metaActivityName} ${formatAsTime(
                    offer.date_start,
                    offer.meta_activity && offer.meta_activity.is_broadcast
                      ? offer.establishment.tzname
                      : null,
                  )}-${formatAsTime(
                    moment(offer.date_start).add(offer.duration_minute),
                    offer.meta_activity && offer.meta_activity.is_broadcast
                      ? offer.establishment.tzname
                      : null,
                  )}`}
                </Typography>
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
                {`  ${coachName} ${
                  props.showOfferFilling
                    ? `(${offer.tot_slots}/${offer.effectif})`
                    : null
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
      <ListItemSecondaryAction>
        <div className={classes.inlineContainer}>
          <Hidden xsDown>
            <IconButton
              disabled={!isInThePast}
              onClick={onClick}
              color="secondary"
            >
              <InfoIcon />
            </IconButton>
          </Hidden>
          <MarketplaceBookButton
            onClickBook={props.onClickBook}
            onClickBookOption={props.onClickBookOption}
            offer={props.offer}
          />
        </div>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
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
}));

export default MarketplaceOffer;
