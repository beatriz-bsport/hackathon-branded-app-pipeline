import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { BOOKING_STATUS_CANCELLED_BY_MANAGER } from '@bsport/common/lib/master-data/booking_status_code';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import useConsumerBookingDateTime from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import { formatAsDate, getIsLateBookingCancellation } from '#utils/datetime';
import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerBookingCard from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';
import ConsumerBookingDetailsCard from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard';
import ConsumerBookingListItem from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingListItem';
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
                <ConsumerBookingListItem
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
