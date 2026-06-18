import React, { useCallback } from 'react';

import {
  MarketPlaceCoachDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization.js';

import {
  getCoachDisplayName,
  getCoachDisplayPicture,
} from '@bsport/common/lib/master-data/coach.js';
import { isDateInThePast } from '#src/utils/datetime';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import ConsumerBookingCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';
import type { WaitingListConfiguration } from '#src/libs/waiting-list/types';
import type { OfferStatusWaitingListPosition } from '#src/libs/offer/types';
import type { ConsumerBookingOption } from '#src/libs/booking/types';

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
  getOfferWaitingListPosition: (
    offerId: number,
  ) => OfferStatusWaitingListPosition;
  waitingListConfiguration: WaitingListConfiguration;
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
  getOfferWaitingListPosition,
  waitingListConfiguration,
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
      displayWaitingListPosition={
        !!waitingListConfiguration?.display_member_position
      }
      establishmentAddress={item.establishment?.location?.address}
      isBookableDisabled={!item.is_convertible}
      isBookingCancelled={!!item.cancelled}
      isCancellable={!item.cancelled}
      isItemInThePast={isBookingOptionInThePast}
      isLoading={isLoading}
      isSelected={isSelected}
      offerDate={selectedBookingDate}
      onBookClick={handleBookSessionClick}
      onBookingCancelClick={handleCancelBookingClick}
      onDetailsClick={handleSeeDetailsClick}
      waitingListPosition={getOfferWaitingListPosition(item.offer?.id)}
    />
  );
};

export default React.memo(ConsumerBookingOptionListItem);
