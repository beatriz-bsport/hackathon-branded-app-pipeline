import React, { useCallback } from 'react';

import {
  MarketPlaceCoachDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization';

import {
  getCoachDisplayName,
  getCoachDisplayPicture,
} from '@bsport/common/lib/master-data/coach';
import { isDateInThePast } from '#utils/datetime';
import useConsumerBookingDateTime from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import ConsumerBookingCard from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';

import type { ConsumerBookingOption } from '#libs/booking/types';

type Props = {
  isSelected?: boolean;
  isLoading?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  item: ConsumerBookingOption;
  coachDisplay?: MarketPlaceCoachDisplay;
  onBookingCardClick: (bookingId: number) => void;
  handleSelectBookingForCancelation: (bookingId: number) => void;
  handleBookSession: (offerId: number) => void;
};

const ConsumerBookingOptionListItem: React.FC<Props> = ({
  item,
  isLoading,
  isSelected,
  sessionTimeDisplay,
  coachDisplay,
  timezone,
  onBookingCardClick,
  handleSelectBookingForCancelation,
  handleBookSession,
}) => {
  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart: item.offer?.date_start,
    durationMinute: item.offer?.duration_minute,
    establishmentTimezoneName: item.establishment?.tzname,
    isMetaActivityBroadcast: item.meta_activity?.is_workshop,
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

  const handleBookSessionClick = useCallback(() => {
    handleBookSession(item.offer?.id);
  }, [handleBookSession, item.offer?.id]);

  const isBookingOptionInThePast = isDateInThePast(item.offer?.date_start);

  const coachName = getCoachDisplayName(
    coachDisplay,
    item.coach?.name,
    item.coach?.firstname,
  );

  const coachPicture = getCoachDisplayPicture(coachDisplay, item.coach?.photo);

  return (
    <ConsumerBookingCard
      isBookable
      activityName={item.meta_activity?.name}
      coachName={coachName}
      coachPhoto={coachPicture}
      establishmentAddress={item.establishment?.location?.address}
      isBookableDisabled={!item.is_convertible}
      isBookingCancelled={!!item.cancelled}
      isCancelDisabled={isBookingOptionInThePast}
      isCancellable={!item.cancelled}
      isLoading={isLoading}
      isSelected={isSelected}
      menuId={item.id.toString()}
      offerDate={selectedBookingDate}
      onBookClick={handleBookSessionClick}
      onBookingCancelClick={handleCancelBookingClick}
      onDetailsClick={handleSeeDetailsClick}
    />
  );
};

export default React.memo(ConsumerBookingOptionListItem);
