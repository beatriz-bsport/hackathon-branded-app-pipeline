import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  BOOKING_FOR_GUEST_FREQUENCY,
  OfferStatus,
  OfferStatusWaitingListPosition,
  OfferWithSpotInformation,
} from '#src/libs/offer/types';
import {
  useOfferFormattedDate,
  useOfferHours,
} from '#src/libs/marketplace/hooks';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { CompanyTheme } from '#src/libs/theme/types';
import { getAddGuestTooltipText } from '#src/libs/marketplace/utils/booking';
import {
  formatOfferDateWithTime,
  formatOfferHours,
} from '#src/libs/marketplace/utils/offer';
import MarketplaceOfferBookingItemSkeleton from './MarketplaceOfferBookingItemSkeleton.component';
import MarketplaceBookingItem from '../MarketplaceBookingItem';
import { OFFER_BOOKABLE_STATUS_FULL } from '@bsport/common/lib/master-data/bookable-status.js';

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
  isRegistered: boolean;
  onOpenAddGuestModal?: () => void;
  getOfferWaitListPosition: (
    offerId: number,
  ) => OfferStatusWaitingListPosition | {};
  errorMessage?: string;
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
  isRegistered,
  onOpenAddGuestModal,
  getOfferWaitListPosition,
  errorMessage,
}) => {
  const formattedDate = useOfferFormattedDate(
    offer,
    offer.establishment,
    offer.meta_activity,
    companyTheme,
  );
  const { t } = useTranslation('booking');

  const offerHours = useOfferHours(
    offer,
    offer.establishment,
    offer.meta_activity,
    companyTheme,
  );

  const formattedOfferHours = formatOfferHours(offerHours);

  const date = formatOfferDateWithTime(formattedDate, formattedOfferHours);

  const getPositionInWaitlist = (offerId: number): number => {
    const offerWaitlistPositionData = getOfferWaitListPosition(offerId);

    if ('waiting_list_position' in offerWaitlistPositionData) {
      return offerWaitlistPositionData.waiting_list_position.member_position;
    }
    return 0;
  };

  const positionInWaitingList = getPositionInWaitlist(offer.id);

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
      errorMessage={errorMessage}
      establishment={offer.establishment}
      guestName={guestName}
      hideCoach={hideCoach}
      isAddGuestDisabled={isAddGuestDisabled}
      isWaitingList={
        offer?.full &&
        bookableStatus === OFFER_BOOKABLE_STATUS_FULL &&
        !isRegistered
      }
      level={offer.customLevel}
      onOpenAddGuestModal={onOpenAddGuestModal}
      positionInWaitingList={positionInWaitingList}
      shouldDisplayAddGuestButton={
        companyTheme.allow_guest && companyTheme.allow_guest_activatable
      }
      spotId={offer.spot_information?.indexType}
      spotName={
        offer?.spot_information &&
        `${t('place')} ${offer.spot_information?.prefix}${
          offer.spot_information?.indexType
        }${offer.spot_information?.suffix}`
      }
      title={offer?.name_override || offer.meta_activity?.name}
    />
  );
};

export const MarketplaceOfferBookingItemForStorybook = marketplaceCssHoc()(
  MarketplaceOfferBookingItem,
);

export default React.memo(MarketplaceOfferBookingItem);
