// @flow

import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Level from '../../../components/category/Level.component';

import { Moment } from '../../../i18n';
import { formatAsTime } from '../../../datetime';
import { isOfferInThePast } from '../utils';

import MarketplaceBookButton from './MarketplaceBookButton.component';

type Props = {
  classes: any,
  offer: Offer,
  onClickOffer: ?(offerId: number) => void,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
};

export const MarketplaceCardOffer = (props: Props) => {
  const { offer, onClickOffer, classes } = props;
  const { activity } = offer;
  const isInThePast = isOfferInThePast(offer);
  const onClick =
    onClickOffer && isInThePast ? () => onClickOffer(offer.id) : null; // this open the offer modal

  // const onClickCard = offer.is_full ? onClickBookOption : onClickBook;

  const coachName = offer.coach_override
    ? offer.coach_override.user.name
    : (offer.activity &&
        offer.activity.coach &&
        offer.activity.coach.user.name) ||
      ' - ';

  const offerEndDate = Moment(offer.date_start).add(
    offer.duration_minute,
    'minutes',
  );

  return (
    <div className={classes.cardOuter} id={`offer-book-${offer.id}`}>
      <div className={classes.cardInner}>
        <ButtonBase
          onClick={onClick}
          disableRipple
          component="div"
          className={classes.cardContent}
        >
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
            {`${formatAsTime(offer.date_start)} - ${formatAsTime(
              offerEndDate,
            )}`}
          </Typography>
          <Level
            noStyle
            align="center"
            variant="caption"
            levelId={activity && activity.level ? activity.level || null : null}
          />
          <Typography
            align="center"
            variant="caption"
            className={classes.textEllipsis}
          >
            {offer.establishment_override
              ? offer.establishment_override.title
              : ((activity || {}).establishment || {}).title || ''}
          </Typography>
        </ButtonBase>
        <div className={classes.bottomButton}>
          <MarketplaceBookButton
            onClickBook={(ev) => {
              ev.stopPropagation();
              props.onClickBook(ev);
            }}
            onClickBookOption={(ev) => {
              ev.stopPropagation();
              props.onClickBookOption(ev);
            }}
            offer={props.offer}
            variant="text"
          />
        </div>
      </div>
    </div>
  );
};

const style = (theme) => {
  return {
    cardOuter: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingLeft: theme.spacing.unit / 2,
      paddingRight: theme.spacing.unit / 2,
    },
    cardInner: {
      backgroundColor: '#F8F8F8',
      borderRadius: theme.shape.borderRadius * 2,
      border: '2px solid #F4F4F4',
      '&:hover, button': {
        backgroundColor: 'white',
      },
    },
    cardContent: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing.unit,
    },
    title: {
      paddingBottom: theme.spacing.unit,
    },
    bottomButton: {
      textAlign: 'center',
      marginTop: theme.spacing.unit,
      width: '100%',
      padding: '2px',
    },
    marginIcon: {
      marginRight: theme.spacing.unit,
    },
  };
};

export default withStyles(style)(withNamespaces()(MarketplaceCardOffer));
