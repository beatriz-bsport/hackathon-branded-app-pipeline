import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { BOOKING_STATUS_CANCELLED_BY_MANAGER } from '@bsport/common/lib/master-data/booking_status_code';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import useConsumerBookingDateTime from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import { isOfferInThePast } from '#libs/marketplace/utils';
import { formatAsDate, getIsLateBookingCancellation } from '#utils/datetime';
import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerBookingCard from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';
import ConsumerBookingDetailsCard from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard';
import Typography from '#Fabrique/Typography';

import type { ConsumerBooking } from '#libs/booking/types';
import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';

import './styles.css';

type Props = {
  isLoading?: boolean;
  selectedBooking?: ConsumerBooking;
  bookingList: ConsumerBooking[];
  hasNextPage?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  selectedTab: BookingTab;
  selectedFilterTab: BookingFilterTab;
  onBookingCardClick: (bookingId: number) => void;
  handlePaginationFetchMore: () => void;
  handleSelectBookingForCancelation: (bookingId: number) => void;
  handleJoinOnlineBooking: (
    bookingBroadcastURL: string,
    isMetaActivityBroadcast: boolean,
    offerDateStart: string,
    timezone: string,
  ) => void;
  relatedBookingsInGroup: ConsumerBooking[];
  handleShowSpotDetails: (booking: ConsumerBooking) => void;
};

type BookingListCardItemProps = Pick<
  Props,
  | 'isLoading'
  | 'sessionTimeDisplay'
  | 'timezone'
  | 'onBookingCardClick'
  | 'handleJoinOnlineBooking'
  | 'handleSelectBookingForCancelation'
  | 'handleShowSpotDetails'
> & {
  item: ConsumerBooking;
  isSelected?: boolean;
};

const BookingListCardItem: React.FC<BookingListCardItemProps> = ({
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
    offerDateStart: item?.offer?.date_start,
    offerDurationMinute: item?.offer?.duration_minute,
    establishmentTimezoneName: item?.establishment?.tzname,
    isMetaActivityBroadcast: item?.meta_activity?.is_broadcast,
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

  const offerIsInThePast = isOfferInThePast(item.offer);

  const bookingActions = useMemo(
    () => [
      {
        name: 'isCancellable',
        value: !item.date_canceled && !offerIsInThePast,
      },
      {
        name: 'isJoinableOnline',
        value: item.meta_activity?.is_broadcast && !offerIsInThePast,
      },
      {
        name: 'isBookable',
        value: false, // TODO waitlist
      },
      {
        name: 'isBookableForAGuest',
        value: false,
      },
    ],
    [item.date_canceled, item.meta_activity?.is_broadcast, offerIsInThePast],
  );

  const getBookingAction = useCallback(
    (
      name:
        | 'isCancellable'
        | 'isJoinableOnline'
        | 'isBookable'
        | 'isBookableForAGuest',
    ) => bookingActions.find((action) => action.name === name)?.value ?? false,
    [bookingActions],
  );

  const isMoreDisabled =
    bookingActions.filter((action) => !!action.value).length > 2;

  return (
    <ConsumerBookingCard
      activityName={item.offer?.name_override || item.meta_activity?.name}
      coachName={item.coach?.name}
      coachPhoto={item.coach?.photo}
      establishmentAddress={item.establishment?.location?.address}
      isBookable={getBookingAction('isBookable')}
      isBookableForAGuest={getBookingAction('isBookableForAGuest')}
      isBookedForAGuest={!!item.source_member}
      isBookingCancelled={!!item.date_canceled}
      isCancelDisabled={offerIsInThePast}
      isCancellable={getBookingAction('isCancellable')}
      isJoinableOnline={getBookingAction('isJoinableOnline')}
      isLoading={isLoading}
      isMoreDisabled={isMoreDisabled}
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

export const ConsumerBookingListContainer: React.FC<Props> = ({
  isLoading,
  bookingList,
  selectedBooking,
  hasNextPage,
  timezone,
  sessionTimeDisplay,
  relatedBookingsInGroup,
  selectedTab,
  selectedFilterTab,
  onBookingCardClick,
  handlePaginationFetchMore,
  handleSelectBookingForCancelation,
  handleJoinOnlineBooking,
  handleShowSpotDetails,
}) => {
  const { t } = useTranslation('consumerSpace');

  const selectedBookingDate = useConsumerBookingDateTime({
    offerDateStart: selectedBooking?.offer?.date_start,
    offerDurationMinute: selectedBooking?.offer?.duration_minute,
    establishmentTimezoneName: selectedBooking?.establishment?.tzname,
    isMetaActivityBroadcast: selectedBooking?.meta_activity?.is_broadcast,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const isLateCancellation = useMemo(
    () =>
      getIsLateBookingCancellation(
        selectedBooking?.date_canceled,
        selectedBooking?.meta_activity?.last_discard_minutes,
        selectedBooking?.offer?.date_start,
      ),
    [
      selectedBooking?.date_canceled,
      selectedBooking?.meta_activity?.last_discard_minutes,
      selectedBooking?.offer?.date_start,
    ],
  );

  const showPlaceholder =
    !isLoading && (!bookingList || bookingList?.length === 0);

  return (
    <div
      className={classNames('bs-consumer-page-root__bookings', {
        'bs-consumer-page-root__bookings--empty': showPlaceholder,
      })}
    >
      {showPlaceholder && (
        <Typography variant="body-lg">
          {t(
            `consumerSpace:reworked.myBookings.listContainer.placeholder.${selectedTab}.${selectedFilterTab}`,
          )}
        </Typography>
      )}

      {(isLoading || bookingList?.length > 0) && (
        <>
          <ul className="bs-consumer-page-root__bookings__list">
            <GenericInfiniteScrollEnhancedCssOnly<ConsumerBooking>
              fetchMoreData={handlePaginationFetchMore}
              hasMore={hasNextPage}
              // TODO: height needs to be set to trigger fetchMoreData..
              // @ts-expect-error
              height="calc(100dvh - 24px - 44px - 42px - 16px - 56px - 16px - 64px)"
              items={bookingList}
              loader={<ConsumerBookingCard isLoading />}
              renderItem={({ item }) => (
                <BookingListCardItem
                  key={item.id}
                  handleJoinOnlineBooking={handleJoinOnlineBooking}
                  handleSelectBookingForCancelation={
                    handleSelectBookingForCancelation
                  }
                  handleShowSpotDetails={handleShowSpotDetails}
                  isLoading={isLoading}
                  isSelected={item.id === selectedBooking?.id}
                  item={item}
                  onBookingCardClick={onBookingCardClick}
                  sessionTimeDisplay={sessionTimeDisplay}
                  timezone={timezone}
                />
              )}
            />
          </ul>

          <ConsumerBookingDetailsCard
            cancellationDate={formatAsDate(selectedBooking?.date_canceled)}
            coachDescription={selectedBooking?.coach?.description}
            coachFacebookURL={selectedBooking?.coach?.facebook_url}
            coachInstagramURL={selectedBooking?.coach?.instagram_url}
            coachName={selectedBooking?.coach?.name}
            coachOverrideDescription={
              selectedBooking?.coach_override?.description
            }
            coachOverrideName={selectedBooking?.coach_override?.name}
            coachOverridePicture={selectedBooking?.coach_override?.photo}
            coachPicture={selectedBooking?.coach?.photo}
            consumerPaymentPackAvailableCredits={
              selectedBooking?.consumer_payment_pack?.available_credits
            }
            consumerPaymentPackPenaltyDisabledFrom={
              selectedBooking?.consumer_payment_pack?.penalty_disabled_from
            }
            consumerPaymentPackPenaltyDisabledUntil={
              selectedBooking?.consumer_payment_pack?.penalty_disabled_until
            }
            consumerPaymentPackUsedCredits={
              selectedBooking?.consumer_payment_pack?.used_credits
            }
            creditsToRefund={selectedBooking?.offer?.credit_price}
            date={selectedBookingDate}
            description={selectedBooking?.meta_activity?.description}
            establishmentAddress={
              selectedBooking?.establishment?.location?.address
            }
            isCancelled={!!selectedBooking?.date_canceled}
            isCancelledFromManager={
              selectedBooking?.booking_status_code ===
              BOOKING_STATUS_CANCELLED_BY_MANAGER.id
            }
            isConsumerPaymentPackDisabled={
              selectedBooking?.consumer_payment_pack?.disabled
            }
            isLateCancellation={isLateCancellation}
            isLoading={isLoading}
            levelName={selectedBooking?.level?.name}
            metaActivityLastDiscardMinutes={
              selectedBooking?.meta_activity?.last_discard_minutes
            }
            metaActivityName={
              selectedBooking?.offer?.name_override ||
              selectedBooking?.meta_activity?.name
            }
            metaActivityPicture={selectedBooking?.meta_activity?.cover_main}
            paymentPackName={
              selectedBooking?.consumer_payment_pack?.payment_pack?.name
            }
            paymentPackTotalCredits={
              selectedBooking?.consumer_payment_pack?.payment_pack?.credits
            }
            sessionTimeDisplay={sessionTimeDisplay}
            showPlaceholder={!selectedBooking}
            timezoneName={timezone}
            workshopLinkedOffers={relatedBookingsInGroup}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(ConsumerBookingListContainer);
