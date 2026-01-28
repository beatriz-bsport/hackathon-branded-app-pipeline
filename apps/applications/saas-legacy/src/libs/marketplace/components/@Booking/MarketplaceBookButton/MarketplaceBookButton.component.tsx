import React, { useMemo } from 'react';
import clsx from 'clsx';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';

import CancelIcon from '@material-ui/icons/Cancel';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import {
  getBookingButtonTraduction,
  isOfferInGroupLockedByPreviousOfferInPast,
} from '#src/libs/marketplace/utils';
import { OfferREST } from '#src/libs/offer/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import { MetaActivity } from '#src/libs/meta-activity/types';

import { isDateInThePast } from '#src/utils/datetime';
import './MarketplaceBookButton.css';
import { ImmutableObject } from 'seamless-immutable';

export type Props = {
  offer: OfferREST;
  group: OffersGroup;
  className?: string;
  isRegistered?: boolean;
  metaActivity: MetaActivity | ImmutableObject<MetaActivity>;
  isHidden?: boolean;
};

const MarketplaceBookButton: React.FC<Props> = ({
  offer,
  group,
  className,
  isRegistered,
  metaActivity,
  isHidden,
}) => {
  const { t } = useTranslation('translation');

  const offerIsInThePast = useMemo(
    () => isDateInThePast(offer.date_start),
    [offer],
  );

  const firstOfferInGroupIsInThePast = useMemo(
    // @ts-expect-error
    () => isOfferInGroupLockedByPreviousOfferInPast(offer, group),
    [group, offer],
  );

  if (isHidden) return null;

  const isDisabled =
    !offer.available || offerIsInThePast || firstOfferInGroupIsInThePast;

  return (
    <div
      className={clsx(
        'bs-book-button-card',
        {
          'bs-book-button-card--disabled': isDisabled,
          'bs-book-button-card--booked': isRegistered,
        },
        className,
      )}
      id={isDisabled ? 'book-button--disabled' : 'book-button'}
    >
      <div
        className="bs-book-button-card__inner"
        id={isDisabled ? 'book-button__inner--disabled' : 'book-button__inner'}
      >
        <>
          {!offer.available && (
            <CancelIcon className="bs-book-button-card__inner__icon__not-available" />
          )}
          {(offerIsInThePast || firstOfferInGroupIsInThePast) &&
            offer.available && (
              <AlarmOnIcon className="bs-book-button-card__inner__icon__past" />
            )}
          {offer.available &&
            isRegistered &&
            !(offerIsInThePast || firstOfferInGroupIsInThePast) && (
              <DoneAllIcon className="bs-book-button-card__inner__icon__already-booked" />
            )}
        </>
        <div
          className={clsx('bs-book-button-card__inner__text', {
            'bs-book-button-card__inner__text--not-available': isDisabled,
            'bs-book-button-card__inner__text--disabled':
              offer.available &&
              (offerIsInThePast || firstOfferInGroupIsInThePast),
            'bs-book-button-card__inner__text--booked':
              isRegistered && !offerIsInThePast && offer.available,
          })}
          id={
            isDisabled
              ? 'book-button__inner__text--disabled'
              : 'book-button__inner__text'
          }
        >
          {getBookingButtonTraduction(
            // @ts-expect-error offer should be of type Offer_full but is type as Offer here
            { ...offer, group },
            metaActivity,
            isRegistered,
            t,
          )}
        </div>
      </div>
    </div>
  );
};

export default pure(MarketplaceBookButton);
