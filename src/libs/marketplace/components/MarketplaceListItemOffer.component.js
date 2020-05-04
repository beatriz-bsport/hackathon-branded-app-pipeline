// @flow

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { withNamespaces } from 'react-i18next';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import withStyles from '@material-ui/core/styles/withStyles';

import type { TFunction } from 'react-i18next';
import MarketplaceBookButton from './MarketplaceBookButton.component';
import Level from '../../../components/category/Level.component';

import { formatMinutes, formatAsTime } from '../../../datetime';
import CoachAvatar from '../../associated-coach/components/CoachAvatar.component';
import { isOfferInThePast } from '../utils';

type Props = {
  offer: Offer,
  selected: ?boolean,
  onClickOffer: ?(offerId: number) => void,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  t: TFunction,
  showOfferFilling: boolean,
  establishmentLoading: boolean,
  activityLoading: boolean,
  classes: Object,
};

export const MarketplaceOffer = (props: Props) => {
  const { t, offer, selected, onClickOffer, classes } = props;
  const { available } = offer;
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
      <ListItemAvatar>
        <CoachAvatar
          coach={offer.coach}
          coach_override={offer.coach_override}
        />
      </ListItemAvatar>
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
                    offer.establishment.tzname,
                  )} -
                  `}
                </Typography>
              )}
              <Typography inline style={{ marginLeft: '4px' }}>
                {formatMinutes(offer.duration_minute, t)}
                {props.showOfferFilling
                  ? `(${offer.tot_slots}/${offer.effectif})`
                  : null}
              </Typography>
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
                {`  ${coachName}`}
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

const styles = (theme) => {
  return {
    primaryTextContainer: { flexDirection: 'column', alignItems: 'flex-start' },
    inlineContainer: { alignItems: 'center', display: 'flex' },
    icon: { marginRight: theme.spacing.unit * 2 },
    levelCoachContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      display: 'flex',
    },
    coachName: { marginLeft: theme.spacing.unit * 2 },
  };
};
export default withStyles(styles)(
  withNamespaces(['datetime'])(MarketplaceOffer),
);
