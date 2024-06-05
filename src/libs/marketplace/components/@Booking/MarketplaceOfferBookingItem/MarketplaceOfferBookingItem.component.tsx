import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  BOOKING_FOR_GUEST_FREQUENCY,
  OfferStatus,
  OfferWithSpotInformation,
} from '#libs/offer/types';
import { useOfferFormattedDate, useOfferHours } from '#libs/marketplace/hooks';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { CompanyTheme } from '#libs/theme/types';
import { getAddGuestTooltipText } from '#libs/marketplace/utils/booking';
import {
  formatOfferDateWithTime,
  formatOfferHours,
} from '#libs/marketplace/utils/offer';
import MarketplaceOfferBookingItemSkeleton from './MarketplaceOfferBookingItemSkeleton.component';
import MarketplaceBookingItem from '../MarketplaceBookingItem';

export type Props = {
  offer: OfferWithSpotInformation;
  hideCoach: boolean;
  companyTheme: CompanyTheme;
  isLoading: boolean;
  bookableStatus?: OfferStatus['bookable_status'];
  isAddGuestDisabled?: boolean;
  guestName?: string;
  bookingGuestFrequency?: BOOKING_FOR_GUEST_FREQUENCY;
  bookingGuestNumberLeft?: number;
  onOpenAddGuestModal?: () => void;
};

const MarketplaceOfferBookingItem: React.FC<Props> = ({
  companyTheme,
  hideCoach,
  offer,
  isLoading,
  bookableStatus,
  isAddGuestDisabled,
  guestName,
  bookingGuestFrequency,
  bookingGuestNumberLeft,
  onOpenAddGuestModal,
}) => {
  const formattedDate = useOfferFormattedDate(offer, companyTheme);
  const { t } = useTranslation('booking');

  const offerHours = useOfferHours(
    offer,
    offer.establishment,
    offer.meta_activity,
    companyTheme,
  );

  const formattedOfferHours = formatOfferHours(offerHours);

  const date = formatOfferDateWithTime(formattedDate, formattedOfferHours);

  if (isLoading) {
    return <MarketplaceOfferBookingItemSkeleton />;
  }

  return (
    <MarketplaceBookingItem
      addGuestTooltipText={getAddGuestTooltipText(
        bookableStatus,
        offer.allow_guest_offer,
        bookingGuestFrequency,
        bookingGuestNumberLeft,
        t,
      )}
      coach={offer.coach}
      companyTheme={companyTheme}
      date={date}
      establishment={offer.establishment}
      guestName={guestName}
      hideCoach={hideCoach}
      isAddGuestDisabled={isAddGuestDisabled}
      isWaitingList={offer.full}
      level={offer.customLevel}
      onOpenAddGuestModal={onOpenAddGuestModal}
      shouldDisplayAddGuestButton={
        companyTheme.allow_guest && companyTheme.allow_guest_activatable
      }
      spotId={offer.spot_information?.indexType}
      spotName={
        offer?.spot_information &&
        `${t('place')} ${offer.spot_information?.prefix}${
          offer.spot_information?.indexType
        }`
      }
      title={offer?.name_override || offer.meta_activity?.name}
    />
  );
};

export const MarketplaceOfferBookingItemForStorybook = marketplaceCssHoc()(
  MarketplaceOfferBookingItem,
);

export default React.memo(MarketplaceOfferBookingItem);
