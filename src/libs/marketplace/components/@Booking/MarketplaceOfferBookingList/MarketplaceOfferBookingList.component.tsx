import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MarketplaceOfferBookingItem from '#src/libs/marketplace/components/@Booking/MarketplaceOfferBookingItem';
import { getGuestBookingName } from '#src/libs/marketplace/utils/booking';

import {
  BOOKING_FOR_GUEST_FREQUENCY,
  OfferStatusWaitingListPosition,
  type OfferStatus,
  type OfferWithSpotInformation,
} from '#src/libs/offer/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import { CheckoutItem } from '#src/libs/checkout/types';

import './styles.css';

export type Props = {
  offers: OfferWithSpotInformation[];
  hideCoach: boolean;
  companyTheme: CompanyTheme;
  isLoading: boolean;
  classes?: { [key: string]: string | boolean };
  bookingGuestNumberLeft?: number;
  bookingGuestFrequency?: BOOKING_FOR_GUEST_FREQUENCY;
  checkoutItems: CheckoutItem[];
  onOpenAddGuestModal: () => void;
  getBookableStatus: (offerId: number) => OfferStatus['bookable_status'];
  getIsAddGuestDisabled: (offerId: number) => boolean;
  getOfferWaitListPosition: (
    offerId: number,
  ) => OfferStatusWaitingListPosition | {};
};

const MarketplaceOfferBookingList: React.FC<Props> = ({
  offers,
  companyTheme,
  hideCoach,
  classes,
  isLoading,
  bookingGuestNumberLeft,
  bookingGuestFrequency,
  checkoutItems,
  onOpenAddGuestModal,
  getBookableStatus,
  getIsAddGuestDisabled,
  getOfferWaitListPosition,
}) => {
  const filteredOffers = offers.filter((offer) => !!offer);

  return (
    <div
      className={classNames('bs-offer-booking-list__container', {
        ...classes,
      })}
    >
      <ul className="bs-offer-booking-list">
        {filteredOffers.map((offer) => (
          <MarketplaceOfferBookingItem
            key={`offer-booking-item-id-${offer.id}`}
            bookableStatus={getBookableStatus(offer.id)}
            bookingGuestFrequency={bookingGuestFrequency}
            bookingGuestNumberLeft={bookingGuestNumberLeft}
            companyTheme={companyTheme}
            getOfferWaitListPosition={getOfferWaitListPosition}
            guestName={getGuestBookingName(checkoutItems, offer.id)}
            hideCoach={hideCoach}
            isAddGuestDisabled={getIsAddGuestDisabled(offer.id)}
            isLoading={isLoading}
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
