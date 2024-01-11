import React, { useCallback, useMemo } from 'react';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import { isDateInThePast } from '#utils/datetime';
import useConsumerBookingDateTime from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import ConsumerBookingCard from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';

import type { ConsumerPrivateBooking } from '#libs/booking/types';

type Props = {
  isSelected?: boolean;
  isLoading?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  item: ConsumerPrivateBooking;
  onBookingCardClick: (bookingId: number) => void;
  handleSelectBookingForCancelation: (bookingId: number) => void;
};

const ConsumerPrivateBookingListItem: React.FC<Props> = ({
  item,
  isLoading,
  isSelected,
  sessionTimeDisplay,
  timezone,
  onBookingCardClick,
  handleSelectBookingForCancelation,
}) => {
  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart: item?.date_start,
    durationMinute: item?.private_slot?.duration_minutes,
    establishmentTimezoneName: null,
    isMetaActivityBroadcast: null,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const handleSeeDetailsClick = useCallback(
    () => onBookingCardClick(item.id),
    [item.id, onBookingCardClick],
  );

  const handleCancelBookingClick = useCallback(
    () => handleSelectBookingForCancelation(item.id),
    [handleSelectBookingForCancelation, item.id],
  );

  const isBookingInThePast = useMemo(
    () => isDateInThePast(item.date_start),
    [item.date_start],
  );

  return (
    <ConsumerBookingCard
      activityName={item.private_service?.name}
      coachName={item.coach?.name}
      coachPhoto={item.coach?.photo}
      establishmentAddress={item.establishment?.location?.address}
      isAtHome={item.private_service?.is_home_service}
      isBookableForAGuest={false}
      isBookingCancelled={!!item.date_canceled}
      isCancelDisabled={isBookingInThePast}
      isCancellable={!item.date_canceled && !isBookingInThePast}
      isLoading={isLoading}
      isSelected={isSelected}
      isUnpaid={item.is_unpaid}
      menuId={item.id.toString()}
      offerDate={selectedBookingDate}
      onBookingCancelClick={handleCancelBookingClick}
      onDetailsClick={handleSeeDetailsClick}
    />
  );
};

export default React.memo(ConsumerPrivateBookingListItem);
