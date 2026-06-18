import React, { useCallback, useMemo } from 'react';

import {
  MarketPlaceCoachDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization.js';

import {
  getCoachDisplayName,
  getCoachDisplayPicture,
} from '@bsport/common/lib/master-data/coach.js';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import { isDateInThePast } from '#src/utils/datetime';
import ConsumerBookingCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';

import type { ConsumerBooking } from '#src/libs/booking/types';
import { DateTime } from 'luxon';

type Props = {
  isSelected?: boolean;
  isLoading?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  item: ConsumerBooking;
  coachDisplay?: MarketPlaceCoachDisplay;
  isMobile?: boolean;
  onBookingCardClick: (bookingId: number) => void;
  handleJoinOnlineBooking: (
    bookingBroadcastURL: string,
    isMetaActivityBroadcast: boolean,
    offerDateStart: string,
    timezone: string,
  ) => void;
  handleSelectBookingForCancelation: (bookingId: number) => void;
  handleShowSpotDetails: (booking: ConsumerBooking) => void;
  getOfferElligibleGuestNumber: (offerId: number) => number;
  setSelectedBookingForBookingForAGuest: (booking: ConsumerBooking) => void;
};

const ConsumerBookingListItem: React.FC<Props> = ({
  item,
  isSelected,
  isLoading,
  sessionTimeDisplay,
  coachDisplay,
  timezone,
  isMobile,
  onBookingCardClick,
  handleJoinOnlineBooking,
  handleSelectBookingForCancelation,
  handleShowSpotDetails,
  getOfferElligibleGuestNumber,
  setSelectedBookingForBookingForAGuest,
}) => {
  const { date_start: dateStart, duration_minute: durationMinute } =
    item?.offer ?? {};

  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart,
    durationMinute,
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

  const offerIsInThePast = isDateInThePast(dateStart);

  const sessionEndTime =
    dateStart &&
    DateTime.fromISO(dateStart).plus({ minute: durationMinute }).toISO();

  const sessionHasEnded = sessionEndTime
    ? isDateInThePast(sessionEndTime)
    : true;

  const bookingActionsMap = {
    isCancellable: !item.date_canceled && !offerIsInThePast,
    isJoinableOnline: item.meta_activity?.is_broadcast && !sessionHasEnded,
  };

  const coachName = getCoachDisplayName(
    coachDisplay,
    item.coach?.name,
    item.coach?.firstname,
  );

  // Check if the booking has a spot and return its name if so
  const spotName = useMemo(() => {
    if ('indexType' in item.spot_information) {
      return `${item.spot_information?.prefix ?? ''}${
        item.spot_information?.indexType ?? ''
      }${item.spot_information?.suffix ?? ''}`;
    }
  }, [item.spot_information]);

  const coachPicture = getCoachDisplayPicture(coachDisplay, item.coach?.photo);

  const isBookableForAGuest =
    !!item.offer?.id && getOfferElligibleGuestNumber(item.offer?.id) > 0;

  const handleSelectBookingForBookingForAGuest = React.useCallback(
    () => setSelectedBookingForBookingForAGuest(item),
    [setSelectedBookingForBookingForAGuest, item],
  );
  return (
    <ConsumerBookingCard
      activityName={item.offer?.name_override || item.meta_activity?.name}
      coachName={coachName}
      coachPhoto={coachPicture}
      establishmentAddress={item.establishment?.location?.address}
      isBookableForAGuest={isBookableForAGuest}
      isBookedForAGuest={!!item.source_member}
      isBookingCancelled={!!item.date_canceled}
      isCancellable={bookingActionsMap.isCancellable}
      isItemInThePast={offerIsInThePast}
      isJoinableOnline={bookingActionsMap.isJoinableOnline}
      isLoading={isLoading}
      isMobile={isMobile}
      isNoShow={item.is_no_show}
      isOnline={item.meta_activity?.is_broadcast}
      isSelected={isSelected}
      offerDate={selectedBookingDate}
      onBookingCancelClick={handleCancelBookingClick}
      onBookingForAGuestClick={handleSelectBookingForBookingForAGuest}
      onDetailsClick={handleSeeDetailsClick}
      onJoinOnlineClick={handleJoinOnlineClick}
      onSpotSchedulingClick={handleSpotSchedulingClick}
      spotSchedulingPosition={spotName}
    />
  );
};

export default React.memo(ConsumerBookingListItem);
