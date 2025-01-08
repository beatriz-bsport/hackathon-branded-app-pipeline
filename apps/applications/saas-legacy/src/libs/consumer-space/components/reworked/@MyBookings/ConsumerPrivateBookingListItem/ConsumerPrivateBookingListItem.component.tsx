import React, { useCallback } from 'react';

import {
  MarketPlaceCoachDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/master-data/personalization.js';

import {
  getCoachDisplayName,
  getCoachDisplayPicture,
} from '@bsport/common/master-data/coach.js';
import { isDateInThePast } from '#src/utils/datetime';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import ConsumerBookingCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';

import type { ConsumerPrivateBooking } from '#src/libs/booking/types';

type Props = {
  isSelected?: boolean;
  isLoading?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  item: ConsumerPrivateBooking;
  coachDisplay?: MarketPlaceCoachDisplay;
  onBookingCardClick: (bookingId: number) => void;
  handleSelectBookingForCancelation: (bookingId: number) => void;
};

const ConsumerPrivateBookingListItem: React.FC<Props> = ({
  item,
  isLoading,
  isSelected,
  sessionTimeDisplay,
  coachDisplay,
  timezone,
  onBookingCardClick,
  handleSelectBookingForCancelation,
}) => {
  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart: item?.date_start,
    durationMinute: item?.private_slot?.duration_minutes,
    establishmentTimezoneName: item.establishment?.tzname,
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

  const isBookingInThePast = isDateInThePast(item.date_start);

  const coachName = getCoachDisplayName(
    coachDisplay,
    item.coach?.name,
    item.coach?.firstname,
  );

  const coachPicture = getCoachDisplayPicture(coachDisplay, item.coach?.photo);

  return (
    <ConsumerBookingCard
      activityName={item.private_service?.name}
      coachName={coachName}
      coachPhoto={coachPicture}
      establishmentAddress={item.establishment?.location?.address}
      isAtHome={item.private_service?.is_home_service}
      isBookableForAGuest={false}
      isBookingCancelled={!!item.date_canceled}
      isCancellable={!item.date_canceled && !isBookingInThePast}
      isItemInThePast={isBookingInThePast}
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
