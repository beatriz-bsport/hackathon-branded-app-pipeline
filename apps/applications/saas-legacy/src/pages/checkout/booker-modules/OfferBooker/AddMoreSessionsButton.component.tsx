import React from 'react';

import { ButtonBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/master-data/bookable-status.js';
import { useTranslation } from 'react-i18next';
import type { Offer_FULL, OfferREST, OfferStatus } from '#src/libs/offer/types';

import './BoutiqueBookerModule.css';

type AddMoreSessionsButtonProps = {
  similarOffers: (OfferREST | Offer_FULL)[];
  isGuestBooking: boolean;
  offerStatusById: { [key: number]: OfferStatus };
  toggleSimilarOfferModal: () => void;
  // only true when you can fetch other similar sessions from a multi session offer, does not intervein with grouped session feature
  canFetchMoreSimilarOffers: boolean;
};

const AddMoreSessionsButton: React.FC<AddMoreSessionsButtonProps> = ({
  canFetchMoreSimilarOffers,
  similarOffers,
  isGuestBooking,
  offerStatusById,
  toggleSimilarOfferModal,
}) => {
  const { t } = useTranslation('booking');

  const similarOffersToCheckIds = React.useMemo(
    () => similarOffers.map((similarOffer) => similarOffer.id),
    [similarOffers],
  );

  const doExistBookableSimilarOffers = React.useMemo(
    () =>
      similarOffersToCheckIds.filter(
        (similarOfferId) =>
          offerStatusById[similarOfferId]?.bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE,
      ).length > 0,
    [similarOffersToCheckIds, offerStatusById],
  );

  const doShowButton = React.useMemo(
    () =>
      !isGuestBooking &&
      ((similarOffers &&
        similarOffers.length > 0 &&
        doExistBookableSimilarOffers) ||
        canFetchMoreSimilarOffers),
    [
      similarOffers,
      isGuestBooking,
      doExistBookableSimilarOffers,
      canFetchMoreSimilarOffers,
    ],
  );

  return (
    <>
      {doShowButton && (
        <ButtonBase
          className="bs-new-offer-booking-fetch-more-similar-offers__button"
          onClick={toggleSimilarOfferModal}
        >
          {
            <div className="bs-new-offer-booking-fetch-more-similar-offers__button__text__container">
              <AddIcon />
              <div>{t('booking:offer.addSession')}</div>
            </div>
          }
        </ButtonBase>
      )}
    </>
  );
};

export default React.memo(AddMoreSessionsButton);
