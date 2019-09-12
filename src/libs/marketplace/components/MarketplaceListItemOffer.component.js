// @flow

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { withNamespaces } from 'react-i18next';

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
};

export const MarketplaceOffer = (props: Props) => {
  const { t, offer, selected, onClickOffer } = props;
  const { activity, available } = offer;
  const isInThePast = isOfferInThePast(offer);
  const onClick =
    onClickOffer && isInThePast ? () => onClickOffer(offer.id) : null;
  return (
    <ListItem
      button={isInThePast && !available}
      selected={selected}
      onClick={onClick}
      divider
    >
      <CoachAvatar
        t={t}
        coach={
          activity && activity.coach && activity.coach.user
            ? activity.coach.user
            : null
        }
        coach_override={offer.coach_override ? offer.coach_override.user : null}
      />
      <ListItemText
        primary={
          <div>
            <Typography inline>
              {`${
                activity && activity.meta_activity
                  ? activity.meta_activity.name || ''
                  : ''
              } - ${formatAsTime(offer.date_start)} - ${formatMinutes(
                offer.duration_minute,
                t,
              )}`}
            </Typography>
            <Level
              noStyle
              variant="caption"
              levelId={
                activity && activity.level ? activity.level || null : null
              }
            />
          </div>
        }
        secondary={
          offer.establishment_override
            ? offer.establishment_override.title
            : ((activity || {}).establishment || {}).title || ''
        }
      />
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
    </ListItem>
  );
};

export default withNamespaces()(MarketplaceOffer);
