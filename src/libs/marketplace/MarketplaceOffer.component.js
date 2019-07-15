// @flow

import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { withNamespaces } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import Level from '../../components/category/Level.component';

import { formatMinutes, formatAsTime } from '../../datetime';
import CoachAvatar from '../associated-coach/components/CoachAvatar.component';
import { isOfferInThePast } from './utils';

type Props = {
  offer: Offer,
  selected: ?boolean,
  onClickOffer: ?() => void,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  t: TFunction,
};

export class MarketplaceOffer extends Component<Props> {
  renderButton = () => {
    const { t, offer } = this.props;
    const disabled = !isOfferInThePast(offer) || !offer.available;
    const onClick = offer.is_full
      ? this.props.onClickBookOption
      : this.props.onClickBook;
    let text = offer.is_full
      ? t('marketplace.bookButton.bookOption')
      : t('marketplace.bookButton.book');
    if (!isOfferInThePast(offer)) {
      text = t('marketplace.bookButton.isPast');
    }
    if (!offer.available) {
      text = t('marketplace.bookButton.notAvailable');
    }
    return (
      <Button
        variant="outlined"
        color="primary"
        id={`offer-book-${offer.id}`}
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  };

  render() {
    const { t, offer, selected, onClickOffer } = this.props;
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
          coach={activity && activity.coach ? activity.coach : null}
          coach_override={offer.coach_override || null}
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
          {this.renderButton()}
        </div>
      </ListItem>
    );
  }
}

export default withNamespaces()(MarketplaceOffer);
