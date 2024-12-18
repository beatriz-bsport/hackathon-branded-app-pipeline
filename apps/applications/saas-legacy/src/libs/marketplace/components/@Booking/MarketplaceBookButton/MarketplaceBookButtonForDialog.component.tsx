import React, { useMemo } from 'react';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';

import DoneAllIcon from '@material-ui/icons/DoneAll';

import { Offer_FULL } from '#src/libs/offer/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import Button from '#src/components/css-only/Fabrique/Button';
import {
  isOfferInThePast,
  getBookingButtonTraduction,
  isOfferInGroupLockedByPreviousOfferInPast,
} from '../../../utils';
import './MarketplaceBookButtonForDialog.css';

type Props = {
  offer: Offer_FULL;
  isRegistered?: boolean;
  group?: OffersGroup;
  onClickBook: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  metaActivity: MetaActivity;
};

const MarketplaceBookButtonForDialog: React.FC<Props> = ({
  offer,
  isRegistered,
  group,
  onClickBook,
  metaActivity,
}) => {
  const { t } = useTranslation('translation');

  // TODO : fix handleBookOption, we have two handlers that were basically doing the same thing.
  // BUT handleBookOption was expecting an id and company id to work. Since forevever, we passed an offer, but
  // handleBookOption was never called: we were doing : offer.is_full ? handleBookOption() : handleBook();
  // where offer.is_full doesn't exist anymore (now offer.full) and therefore was always calling handleBook
  // original code : offer.full ? onClickBookOption : onClickBook;

  const onClick = onClickBook;
  const isDisabled = useMemo(
    () =>
      !offer.available ||
      isOfferInThePast(offer) ||
      isOfferInGroupLockedByPreviousOfferInPast(offer, group),
    [group, offer],
  );
  return (
    <Button
      classes={{ root: 'bs-book-button' }}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {isRegistered && (
        <DoneAllIcon className="bs-book-button__inner__icon__already-booked" />
      )}
      <div className="bs-book-button__inner__text">
        {getBookingButtonTraduction(
          { ...offer, group },
          metaActivity,
          isRegistered,
          t,
        )}
      </div>
    </Button>
  );
};

export default pure(MarketplaceBookButtonForDialog);
