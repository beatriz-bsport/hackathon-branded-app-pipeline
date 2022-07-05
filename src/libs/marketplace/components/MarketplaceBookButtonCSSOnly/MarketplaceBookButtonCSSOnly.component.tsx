import React, { useMemo } from 'react';
import classnames from 'classnames';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import { isOfferInThePast, getBookingButtonTraduction } from '../../utils';
import { Offer_FULL } from '#libs/offer/types';
import './MarketplaceBookButtonCSSOnly.css';

type Props = {
  offer: Offer_FULL;
  className?: string;
  isRegistered?: boolean;
  onClickBook: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickBookOption: (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

const MarketplaceBookButtonCSSOnly: React.FC<Props> = ({
  offer,
  className,
  isRegistered,
  onClickBook,
  onClickBookOption,
}) => {
  const { t } = useTranslation('translation');

  const onClick = offer.is_full ? onClickBookOption : onClickBook;
  const isDisabled = useMemo(
    () => !offer.available || !isOfferInThePast(offer),
    [offer],
  );

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={classnames(
        'bs-book-button',
        {
          'bs-book-button--disabled': isDisabled,
          'bs-book-button--booked': isRegistered,
        },
        className,
      )}
      type="button"
    >
      <div className="bs-book-button__inner">
        {!isRegistered && (
          <>
            {!offer.available && (
              <CancelIcon className="bs-book-button__inner__icon__not-available" />
            )}
            {offer.available && (
              <>
                {!isOfferInThePast(offer) && (
                  <AlarmOnIcon className="bs-book-button__inner__icon__past" />
                )}

                {isOfferInThePast(offer) && (
                  <PersonAddIcon className="bs-book-button__inner__icon__book" />
                )}
              </>
            )}
          </>
        )}
        {isRegistered && (
          <DoneAllIcon className="bs-book-button__inner__icon__already-booked" />
        )}
        <div
          className={classnames('bs-book-button__inner__text', {
            'bs-book-button__inner__text--not-available': isDisabled,
            'bs-book-button__inner__text--disabled':
              offer.available && !isOfferInThePast(offer),
            'bs-book-button__inner__text--booked': isRegistered,
          })}
        >
          {getBookingButtonTraduction(offer, isRegistered, t)}
        </div>
      </div>
    </button>
  );
};

export default pure(MarketplaceBookButtonCSSOnly);
