// @flow
import React, { Component } from 'react';

import {
  ListItem,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { TFunction } from 'react-i18next';

import { formatAsTime } from '../../datetime';

type Props = {
  offer: Offer,
  selected: ?boolean,
  t: TFunction,
};

export class MarketplaceOffer extends Component<Props> {
  renderButton = () => {
    const { t, offer } = this.props;
    if (offer.is_full) {
      return (
        <Link
          to={`/customer/payment/offer/${offer.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Button variant="outlined" color="secondary">
            {t('marketplace.bookOption')}
          </Button>
        </Link>
      );
    }
    return (
      <Link
        to={`/customer/payment/offer/${offer.id}`}
        style={{ textDecoration: 'none' }}
      >
        <Button variant="outlined" color="primary">
          {t('marketplace.book')}
        </Button>
      </Link>
    );
  };

  render() {
    const { offer, selected } = this.props;
    return (
      <ListItem selected={selected} divider>
        <Avatar src={offer.coach.photo} />
        <ListItemText
          primary={`${offer.name} - ${formatAsTime(offer.date_start)}`}
          secondary={offer.etablissement.title}
        />
        <ListItemSecondaryAction>{this.renderButton()}</ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default translate()(MarketplaceOffer);
