// @flow

import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment-timezone';
import Level from '../../../components/category/Level.component';
import { formatAsTime } from '../../../datetime';
import { isOfferInThePast } from '../utils';

import MarketplaceBookButton from './MarketplaceBookButton.component';

type Props = {
  classes: any,
  offer: Offer,
  onClickOffer: ?(offerId: number) => void,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  index: number,
  activityLoading: boolean,
  coachLoading: boolean,
  establishmentLoading: boolean,
  showOfferFilling: boolean,
};

const pairColor = '#FFFFFF';
const impairColor = '#F8F8F8';

export const MarketplaceCardOffer = (props: Props) => {
  const { offer, onClickOffer, classes } = props;
  const isInThePast = isOfferInThePast(offer);
  const onClick =
    onClickOffer && isInThePast ? () => onClickOffer(offer.id) : null; // this open the offer modal

  // const onClickCard = offer.is_full ? onClickBookOption : onClickBook;

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

  const offerEndDate = moment(offer.date_start).add(
    offer.duration_minute,
    'minutes',
  );

  return (
    <div
      className={classes.cardOuter}
      style={{
        borderRadius: '8px',
        background:
          props.index % 2 === 0
            ? `linear-gradient(180deg, ${
                offer.meta_activity_color === ''
                  ? `${pairColor}`
                  : offer.meta_activity_color
              } 3%, ${pairColor} 3%)`
            : `linear-gradient(180deg, ${
                offer.meta_activity_color === ''
                  ? `${impairColor}`
                  : offer.meta_activity_color
              } 3%, ${impairColor} 3%)`,
      }}
      id={`offer-book-${offer.id}`}
    >
      <ButtonBase
        onClick={onClick}
        disableRipple
        component="div"
        className={classes.cardContent}
      >
        <div className={classes.title}>
          {props.activityLoading && metaActivityName === ' - ' ? (
            <MoreHorizIcon fontSize="small" />
          ) : (
            <Typography align="center" variant="subtitle1">
              {metaActivityName}
            </Typography>
          )}
        </div>
        <div className={classes.title}>
          {props.coachLoading && coachName === ' - ' ? (
            <MoreHorizIcon fontSize="small" />
          ) : (
            <Typography align="center" variant="caption">
              {coachName}
            </Typography>
          )}
        </div>
        <Typography align="center">
          {!offer.establishment.tzname ? (
            <MoreHorizIcon fontSize="small" />
          ) : (
            `${formatAsTime(
              offer.date_start,
              offer.establishment.tzname,
            )} - ${formatAsTime(offerEndDate, offer.establishment.tzname)}`
          )}
        </Typography>
        <Level
          noStyle
          align="center"
          variant="caption"
          levelId={offer && offer.level ? offer.level || null : null}
        />
        {props.establishmentLoading && establishmentName === ' - ' ? (
          <MoreHorizIcon fontSize="small" />
        ) : (
          <Typography align="center" variant="caption">
            {establishmentName}
          </Typography>
        )}
      </ButtonBase>
      <div className={classes.bottomButton}>
        <MarketplaceBookButton
          showOfferFilling={props.showOfferFilling}
          onClickBook={(ev) => {
            ev.stopPropagation();
            props.onClickBook(ev);
          }}
          onClickBookOption={(ev) => {
            ev.stopPropagation();
            props.onClickBookOption(ev);
          }}
          offer={props.offer}
          variant="contained"
        />
      </div>
    </div>
  );
};

const style = (theme) => {
  return {
    cardOuter: {
      display: 'flex',
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      borderRadius: theme.shape.borderRadius * 2,
      '&:hover': {
        boxShadow: theme.shadows[1],
      },
    },
    cardContent: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
    title: {
      paddingBottom: theme.spacing.unit,
    },
    bottomButton: {
      textAlign: 'center',
      marginTop: '3px',
    },
    marginIcon: {
      marginRight: theme.spacing.unit,
    },
  };
};

export default withStyles(style)(withNamespaces()(MarketplaceCardOffer));
