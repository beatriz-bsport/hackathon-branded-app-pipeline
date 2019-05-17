// @flow

import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { TFunction } from 'react-i18next';


import { humanizeDuration, formatAsTime } from '../../datetime';
// eslint-disable-next-line
import CoachAvatar from '../../libs/coach/components/CoachAvatar.component';

type Props = {
  offer: Offer,
  selected: ?boolean,
  onClickOffer: ?() => void,
  companyId: number,
  t: TFunction,
};

function isOfferAvailable(offer) {
  return !moment(offer.date_start).isSameOrBefore(moment());
}

export class MarketplaceOffer extends Component<Props> {
  renderButton = () => {
    const { t, offer, companyId } = this.props;
    const disabled = !isOfferAvailable(offer);
    if (offer.is_full) {
      return (
        <Link
          to={`/customer/payment/offer/${offer.id}?membership=${companyId ||
            0}`}
          style={{ textDecoration: 'none' }}
        >
          <Button variant="outlined" color="secondary" disabled={disabled}>
            {t('marketplace.bookOption')}
          </Button>
        </Link>
      );
    }
    return (
      <Link
        to={`/customer/payment/offer/${offer.id}?membership=${companyId || 0}`}
        style={{ textDecoration: 'none' }}
      >
        <Button
          variant="outlined"
          color="primary"
          id={`offer-book-${offer.id}`}
          disabled={disabled}
        >
          {t('marketplace.book')}
        </Button>
      </Link>
    );
  };

  render() {
    const { t, offer, selected, onClickOffer } = this.props;
    const available = isOfferAvailable(offer);
    const onClick =
      onClickOffer && available ? () => onClickOffer(offer.id) : null;
    return (
      <ListItem
        button={available}
        selected={selected}
        onClick={onClick}
        divider
      >
        <CoachAvatar
          t={t}
          coach={offer.coach}
          coach_override={offer.coach_override}
        />
        <ListItemText
          primary={`${offer.name} - ${formatAsTime(
            offer.date_start,
          )} - ${humanizeDuration(offer.duration_minute * 60000)}`}
          secondary={offer.etablissement.title}
        />
        <ListItemSecondaryAction style={{ marginRight: 12 }}>
          {available ? (
            <IconButton
              onClick={onClick}
              color="secondary"
              style={{ marginRight: 6 }}
            >
              <InfoIcon />
            </IconButton>
          ) : null}
          {this.renderButton()}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

function mapStateToProps(state) {
  return {
    companyId: state.marketplace.company.id,
  };
}

export default withNamespaces()(connect(mapStateToProps)(MarketplaceOffer));
