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
};

export const MarketplaceOffer = (props: Props) => {
  const { t, offer, selected, onClickOffer } = props;
  const { available } = offer;
  const isInThePast = isOfferInThePast(offer);
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
          t={t}
          coach={offer.coach ? offer.coach.user : null}
          coach_override={
            offer.coach_override ? offer.coach_override.user : null
          }
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <div style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography inline>
              {`${
                offer.meta_activity ? offer.meta_activity.name || '' : ''
              } - ${formatAsTime(
                offer.date_start,
                offer.establishment.tzname,
              )} - ${formatMinutes(offer.duration_minute, t)} `}
              {props.showOfferFilling
                ? `(${offer.bookings.length + offer.booking_options.length}/${
                    offer.effectif
                  })`
                : null}
            </Typography>
            <div
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Level
                noStyle
                variant="caption"
                align="left"
                levelId={offer.level ? offer.level : null}
              />
              <Typography inline variant="caption">
                {offer.coach ? `  -  ${offer.coach.user.name}` : ''}
              </Typography>
            </div>
          </div>
        }
        secondary={
          offer
            ? (offer.establishment_override || offer.establishment).title
            : ''
        }
      />
      <ListItemSecondaryAction>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
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

export default withNamespaces()(MarketplaceOffer);
