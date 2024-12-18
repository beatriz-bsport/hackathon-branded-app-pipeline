import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MarketplaceOfferBookingItem from '#src/libs/marketplace/components/@Booking/MarketplaceOfferBookingItem';

import {
  BOOKING_FOR_GUEST_FREQUENCY,
  OfferStatusWaitingListPosition,
  type OfferStatus,
  type OfferWithSpotInformation,
} from '#src/libs/offer/types';
import type { CompanyTheme } from '#src/libs/theme/types';

import './styles.css';

export type Props = {
  offers: OfferWithSpotInformation[];
  hideCoach: boolean;
  companyTheme: CompanyTheme;
  isLoading: boolean;
  classes?: { [key: string]: string | boolean };
  bookingGuestNumberLeft?: number;
  bookingGuestFrequency?: BOOKING_FOR_GUEST_FREQUENCY;
  getGuestNameFromQueryParams: (index: number) => string;
  onOpenAddGuestModal: () => void;
  getBookableStatus: (offerId: number) => OfferStatus['bookable_status'];
  getIsAddGuestDisabled: (offerId: number) => boolean;
  getOfferWaitListPosition: (
    offerId: number,
  ) => OfferStatusWaitingListPosition | {};
  getOfferStatus: (offerId: number) => OfferStatus;
};

const MarketplaceOfferBookingList: React.FC<Props> = ({
  offers,
  companyTheme,
  hideCoach,
  classes,
  isLoading,
  bookingGuestNumberLeft,
  bookingGuestFrequency,
  getGuestNameFromQueryParams,
  onOpenAddGuestModal,
  getBookableStatus,
  getIsAddGuestDisabled,
  getOfferWaitListPosition,
  getOfferStatus,
}) => {
  const filteredOffers = offers.filter((offer) => !!offer);

  return (
    <div
      className={classNames('bs-offer-booking-list__container', {
        ...classes,
      })}
    >
      <ul className="bs-offer-booking-list">
        {filteredOffers.map((offer, index) => (
          <MarketplaceOfferBookingItem
            key={`offer-booking-item-id-${offer.id}`}
            bookableStatus={getBookableStatus(offer.id)}
            bookingGuestFrequency={bookingGuestFrequency}
            bookingGuestNumberLeft={bookingGuestNumberLeft}
            companyTheme={companyTheme}
            getOfferWaitListPosition={getOfferWaitListPosition}
            guestName={getGuestNameFromQueryParams(index)}
            hideCoach={hideCoach}
            isAddGuestDisabled={getIsAddGuestDisabled(offer.id)}
            isLoading={isLoading}
            isRegistered={getOfferStatus(offer.id)?.is_registered}
            offer={offer}
            onOpenAddGuestModal={onOpenAddGuestModal}
          />
        ))}
      </ul>
    </div>
  );
};

export const MarketplaceOfferBookingListForStorybook = marketplaceCssHoc()(
  MarketplaceOfferBookingList,
);

export default React.memo(MarketplaceOfferBookingList);
