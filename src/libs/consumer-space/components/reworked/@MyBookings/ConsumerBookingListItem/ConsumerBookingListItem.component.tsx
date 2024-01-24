import React, { useCallback } from 'react';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import useConsumerBookingDateTime from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import { isDateInThePast } from '#utils/datetime';
import ConsumerBookingCard from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';

import type { ConsumerBooking } from '#libs/booking/types';

type Props = {
  isSelected?: boolean;
  isLoading?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  item: ConsumerBooking;
  onBookingCardClick: (bookingId: number) => void;
  handleJoinOnlineBooking: (
    bookingBroadcastURL: string,
    isMetaActivityBroadcast: boolean,
    offerDateStart: string,
    timezone: string,
  ) => void;
  handleSelectBookingForCancelation: (bookingId: number) => void;
  handleShowSpotDetails: (booking: ConsumerBooking) => void;
};

const ConsumerBookingListItem: React.FC<Props> = ({
  item,
  isSelected,
  isLoading,
  sessionTimeDisplay,
  timezone,
  onBookingCardClick,
  handleJoinOnlineBooking,
  handleSelectBookingForCancelation,
  handleShowSpotDetails,
}) => {
  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart: item.offer?.date_start,
    durationMinute: item.offer?.duration_minute,
    establishmentTimezoneName: item.establishment?.tzname,
    isMetaActivityBroadcast: item.meta_activity?.is_broadcast,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const handleSeeDetailsClick = useCallback(
    () => onBookingCardClick(item.id),
    [item.id, onBookingCardClick],
  );

  const handleJoinOnlineClick = useCallback(
    () =>
      handleJoinOnlineBooking(
        item.offer?.broadcast_link,
        item.meta_activity?.is_broadcast,
        item.offer_date_start,
        item.establishment?.tzname || timezone,
      ),
    [
      handleJoinOnlineBooking,
      item.establishment?.tzname,
      item.meta_activity?.is_broadcast,
      item.offer?.broadcast_link,
      item.offer_date_start,
      timezone,
    ],
  );

  const handleCancelBookingClick = useCallback(
    () => handleSelectBookingForCancelation(item.id),
    [handleSelectBookingForCancelation, item.id],
  );

  const handleSpotSchedulingClick = useCallback(
    () => handleShowSpotDetails(item),
    [handleShowSpotDetails, item],
  );

  const offerIsInThePast = isDateInThePast(item.offer?.date_start);

  const bookingActionsMap = {
    isCancellable: !item.date_canceled && !offerIsInThePast,
    isJoinableOnline: item.meta_activity?.is_broadcast && !offerIsInThePast,
  };

  return (
    <ConsumerBookingCard
      isMoreDisabled
      activityName={item.offer?.name_override || item.meta_activity?.name}
      coachName={item.coach?.name}
      coachPhoto={item.coach?.photo}
      establishmentAddress={item.establishment?.location?.address}
      isBookedForAGuest={!!item.source_member}
      isBookingCancelled={!!item.date_canceled}
      isCancelDisabled={offerIsInThePast}
      isCancellable={bookingActionsMap.isCancellable}
      isJoinableOnline={bookingActionsMap.isJoinableOnline}
      isLoading={isLoading}
      isNoShow={item.is_no_show}
      isOnline={item.meta_activity?.is_broadcast}
      isSelected={isSelected}
      menuId={item.id.toString()}
      offerDate={selectedBookingDate}
      onBookingCancelClick={handleCancelBookingClick}
      onDetailsClick={handleSeeDetailsClick}
      onJoinOnlineClick={handleJoinOnlineClick}
      onSpotSchedulingClick={handleSpotSchedulingClick}
      spotSchedulingPosition={item.spot_id?.toString()}
    />
  );
};

export default React.memo(ConsumerBookingListItem);
