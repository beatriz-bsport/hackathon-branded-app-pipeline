// @ts-nocheck
import React, { useMemo } from 'react';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';

import DoneAllIcon from '@material-ui/icons/DoneAll';

import {
  isOfferInThePast,
  getBookingButtonTraduction,
  firstOfferInGroupLocksBookingBecauseInPast,
} from '../../utils';
import { Offer_FULL } from '#libs/offer/types';
import './MarketplaceBookButtonCSSOnlyForDialog.css';
import { OffersGroup } from '#libs/group-offer/types';

type Props = {
  offer: Offer_FULL;
  isRegistered?: boolean;
  group?: OffersGroup;
  onClickBook: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickBookOption: (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

const MarketplaceBookButtonCSSOnly: React.FC<Props> = ({
  offer,
  isRegistered,
  group,
  onClickBook,
  onClickBookOption,
}) => {
  const { t } = useTranslation('translation');

  const onClick = offer.is_full ? onClickBookOption : onClickBook;
  const isDisabled = useMemo(
    () =>
      !offer.available ||
      !isOfferInThePast(offer) ||
      firstOfferInGroupLocksBookingBecauseInPast(offer, group),
    [group, offer],
  );
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className="bs-book-button"
      type="button"
    >
      {isRegistered && (
        <DoneAllIcon className="bs-book-button__inner__icon__already-booked" />
      )}
      <div className="bs-book-button__inner__text">
        {getBookingButtonTraduction(offer, isRegistered, t)}
      </div>
    </button>
  );
};

export default pure(MarketplaceBookButtonCSSOnly);
