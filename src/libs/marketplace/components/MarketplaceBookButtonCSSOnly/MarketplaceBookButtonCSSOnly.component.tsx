// @ts-nocheck
import React, { useMemo } from 'react';
import classnames from 'classnames';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';

import CancelIcon from '@material-ui/icons/Cancel';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import {
  isOfferInThePast,
  getBookingButtonTraduction,
  firstOfferInGroupLocksBookingBecauseInPast,
} from '../../utils';
import { Offer_FULL } from '#libs/offer/types';
import './MarketplaceBookButtonCSSOnly.css';

type Props = {
  offer: Offer_FULL;
  className?: string;
  isRegistered?: boolean;
};

const MarketplaceBookButtonCSSOnly: React.FC<Props> = ({
  offer,
  className,
  isRegistered,
}) => {
  const { t } = useTranslation('translation');

  const offerIsInThePast = useMemo(() => !isOfferInThePast(offer), [offer]);

  const firstOfferInGroupIsInThePast = useMemo(
    () => firstOfferInGroupLocksBookingBecauseInPast(offer),
    [offer],
  );

  const isDisabled =
    !offer.available || offerIsInThePast || firstOfferInGroupIsInThePast;

  return (
    <div
      className={classnames(
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
        {!isRegistered && (
          <>
            {!offer.available && (
              <CancelIcon className="bs-book-button-card__inner__icon__not-available" />
            )}
            {offer.available && (
              <>
                {(offerIsInThePast || firstOfferInGroupIsInThePast) && (
                  <AlarmOnIcon className="bs-book-button-card__inner__icon__past" />
                )}
              </>
            )}
          </>
        )}
        {isRegistered && (
          <DoneAllIcon className="bs-book-button-card__inner__icon__already-booked" />
        )}
        <div
          id={
            isDisabled
              ? 'book-button__inner__text--disabled'
              : 'book-button__inner__text'
          }
          className={classnames('bs-book-button-card__inner__text', {
            'bs-book-button-card__inner__text--not-available': isDisabled,
            'bs-book-button-card__inner__text--disabled':
              offer.available &&
              (offerIsInThePast || firstOfferInGroupIsInThePast),
            'bs-book-button-card__inner__text--booked': isRegistered,
          })}
        >
          {getBookingButtonTraduction(offer, isRegistered, t)}
        </div>
      </div>
    </div>
  );
};

export default pure(MarketplaceBookButtonCSSOnly);
