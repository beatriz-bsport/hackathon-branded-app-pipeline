// @flow

import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';

import type { TFunction } from 'react-i18next';
import Level from '../../../components/category/Level.component';

import { formatMinutes, formatAsTime } from '../../../datetime';
import { isOfferInThePast } from '../utils';

import MarketplaceBookButton from './MarketplaceBookButton.component';

type Props = {
  classes: any,
  offer: Offer,
  onClickOffer: ?() => void,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  t: TFunction,
};

export const MarketplaceCardOffer = (props: Props) => {
  const { t, offer, onClickOffer, classes } = props;
  const { activity } = offer;
  const isInThePast = isOfferInThePast(offer);
  const onClick =
    onClickOffer && isInThePast ? () => onClickOffer(offer.id) : null;

  const coachName = offer.coach_override
    ? offer.coach_override.user.name
    : (offer.activity &&
        offer.activity.coach &&
        offer.activity.coach.user.name) ||
      ' - ';

  return (
    <ButtonBase
      onClick={onClick}
      disableRipple
      component="div"
      className={classes.cardOuter}
    >
      <div className={classes.cardInner}>
        <div className={classes.title}>
          <Typography align="center" variant="subtitle1">
            {activity && activity.meta_activity
              ? activity.meta_activity.name || ''
              : ''}
          </Typography>
          <Typography align="center" variant="caption">
            {coachName}
          </Typography>
        </div>
        <Typography align="center">
          {`${formatAsTime(offer.date_start)} - ${formatMinutes(
            offer.duration_minute,
            t,
          )}`}
        </Typography>
        <Level
          noStyle
          variant="caption"
          levelId={activity && activity.level ? activity.level || null : null}
        />
        <Typography align="center" variant="caption">
          {offer.establishment_override
            ? offer.establishment_override.title
            : ((activity || {}).establishment || {}).title || ''}
        </Typography>
        <div className={classes.bottomButton}>
          <MarketplaceBookButton
            onClickBook={props.onClickBook}
            onClickBookOption={props.onClickBookOption}
            offer={props.offer}
            variant="text"
          />
        </div>
      </div>
    </ButtonBase>
  );
};

const style = (theme) => {
  return {
    cardOuter: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    cardInner: {
      border: '2px solid #F8F8F8',
      backgroundColor: '#F8F8F8',
      borderRadius: theme.shape.borderRadius * 2,
      padding: '2px',
      '&:hover, button': {
        backgroundColor: 'white',
      },
      width: '100%',
      marginLeft: theme.spacing.unit / 2,
      marginRight: theme.spacing.unit / 2,
      marginBottom: theme.spacing.unit,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    title: {
      paddingBottom: theme.spacing.unit,
    },
    bottomButton: {
      marginTop: theme.spacing.unit,
      width: '100%',
    },
  };
};

export default withStyles(style)(withNamespaces()(MarketplaceCardOffer));
