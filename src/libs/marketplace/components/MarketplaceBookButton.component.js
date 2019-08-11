// @flow
import React from 'react';
import Button from '@material-ui/core/Button';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { isOfferInThePast } from '../utils';

type Props = {
  onClickBook: () => void,
  variant: ?string,
  onClickBookOption: () => void,
  offer: Offer,
  t: TFunction,
};

const MarketplaceBookButton = (props: Props) => {
  const { t, offer, onClickBook, onClickBookOption } = props;
  const disabled = !isOfferInThePast(offer) || !offer.available;
  const onClick = offer.is_full ? onClickBookOption : onClickBook;
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
      fullWidth
      variant={props.variant || 'outlined'}
      color="primary"
      id={`offer-book-${offer.id}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default withNamespaces()(MarketplaceBookButton);
