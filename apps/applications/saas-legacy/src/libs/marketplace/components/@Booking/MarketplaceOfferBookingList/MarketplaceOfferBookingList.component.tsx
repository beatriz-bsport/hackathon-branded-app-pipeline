import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import BUYABLE_ITEM_CAN_NOT_BE_BOUGHT_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';

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
  offerNotBookableIdWithErrorCodeList?: number[][];
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
  offerNotBookableIdWithErrorCodeList,
}) => {
  const { t } = useTranslation('snackbar');

  const filteredOffers = offers.filter((offer) => !!offer);

  const items = filteredOffers.map((offer, index) => {
    const errorCode = offerNotBookableIdWithErrorCodeList?.length
      ? offerNotBookableIdWithErrorCodeList?.find((offerNotBookable) =>
          offerNotBookable.includes(offer.id),
        )[1]
      : null;

    const errorMessage = (() => {
      if (!errorCode) return null;
      if (BUYABLE_ITEM_CAN_NOT_BE_BOUGHT_ERROR_CODES.includes(errorCode)) {
        return t(`canNotBuyErrorCode.${errorCode}`);
      }
      return t('canNotBuyErrorCode.generic');
    })();

    return (
      <MarketplaceOfferBookingItem
        key={`offer-booking-item-id-${offer.id}`}
        bookableStatus={getBookableStatus(offer.id)}
        bookingGuestFrequency={bookingGuestFrequency}
        bookingGuestNumberLeft={bookingGuestNumberLeft}
        companyTheme={companyTheme}
        errorMessage={errorMessage}
        getOfferWaitListPosition={getOfferWaitListPosition}
        guestName={getGuestNameFromQueryParams(index)}
        hideCoach={hideCoach}
        isAddGuestDisabled={getIsAddGuestDisabled(offer.id)}
        isLoading={isLoading}
        isRegistered={getOfferStatus(offer.id)?.is_registered}
        offer={offer}
        onOpenAddGuestModal={onOpenAddGuestModal}
      />
    );
  });

  return (
    <div
      className={classNames('bs-offer-booking-list__container', {
        ...classes,
      })}
    >
      <ul className="bs-offer-booking-list">{items}</ul>
    </div>
  );
};

export const MarketplaceOfferBookingListForStorybook = marketplaceCssHoc()(
  MarketplaceOfferBookingList,
);

export default React.memo(MarketplaceOfferBookingList);
