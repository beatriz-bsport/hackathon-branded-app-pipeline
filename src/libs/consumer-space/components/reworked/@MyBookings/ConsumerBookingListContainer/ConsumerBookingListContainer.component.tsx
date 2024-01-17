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
import ConsumerPrivateBookingListItem from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerPrivateBookingListItem';
import Typography from '#Fabrique/Typography';

import type {
  ConsumerBooking,
  ConsumerPrivateBooking,
} from '#libs/booking/types';
import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';

import { BookingTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';

import './styles.css';

type Props = {
  isLoading?: boolean;
  selectedBooking?: ConsumerBooking;
  selectedPrivateBooking?: ConsumerPrivateBooking;
  bookingList: ConsumerBooking[];
  privateBookingList: ConsumerPrivateBooking[];
  hasNextPage?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  selectedTab: BookingTab;
  selectedFilterTab: BookingFilterTab;
  handleSetSelectedBooking: (bookingId: number) => void;
  handleSetSelectedPrivateBooking: (privateBookingId: number) => void;
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
  privateBookingList,
  selectedBooking,
  selectedPrivateBooking,
  hasNextPage,
  timezone,
  sessionTimeDisplay,
  relatedBookingsInGroup,
  selectedTab,
  selectedFilterTab,
  handleSetSelectedBooking,
  handleSetSelectedPrivateBooking,
  handlePaginationFetchMore,
  handleSelectBookingForCancelation,
  handleJoinOnlineBooking,
  handleShowSpotDetails,
}) => {
  const { t } = useTranslation('consumerSpace');

  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart:
      selectedBooking?.offer?.date_start || selectedPrivateBooking?.date_start,
    durationMinute:
      selectedBooking?.offer?.duration_minute ||
      selectedPrivateBooking?.private_slot?.duration_minutes,
    establishmentTimezoneName:
      selectedBooking?.establishment?.tzname ||
      selectedPrivateBooking?.establishment?.tzname,
    isMetaActivityBroadcast: selectedBooking?.meta_activity?.is_broadcast,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const isLateCancellation = useMemo(
    () =>
      getIsLateBookingCancellation(
        selectedBooking?.date_canceled || selectedPrivateBooking?.date_canceled,
        selectedBooking?.meta_activity?.last_discard_minutes ||
          selectedPrivateBooking?.private_service?.last_discard_minutes,
        selectedBooking?.offer?.date_start ||
          selectedPrivateBooking?.date_start,
      ),
    [
      selectedBooking?.date_canceled,
      selectedPrivateBooking?.date_canceled,
      selectedBooking?.meta_activity?.last_discard_minutes,
      selectedPrivateBooking?.private_service?.last_discard_minutes,
      selectedBooking?.offer?.date_start,
      selectedPrivateBooking?.date_start,
    ],
  );

  const showPlaceholder = (() => {
    if (selectedTab === BookingTabEnum.APPOINTMENT) {
      return (
        !isLoading && (!privateBookingList || privateBookingList?.length === 0)
      );
    }
    return !isLoading && (!bookingList || bookingList?.length === 0);
  })();

  const currentBookingList = useMemo(() => {
    const listMap = {
      activity: bookingList,
      appointment: privateBookingList,
      workshop: bookingList,
    };
    return listMap[selectedTab];
  }, [bookingList, privateBookingList, selectedTab]);

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

      {(isLoading || currentBookingList?.length > 0) && (
        <>
          <ul className="bs-consumer-page-root__bookings__list">
            <GenericInfiniteScrollEnhancedCssOnly<
              ConsumerBooking | ConsumerPrivateBooking
            >
              fetchMoreData={handlePaginationFetchMore}
              hasMore={hasNextPage}
              // TODO: height needs to be set to trigger fetchMoreData..
              // @ts-expect-error
              height="calc(100dvh - 24px - 44px - 42px - 16px - 56px - 16px - 64px)"
              items={currentBookingList}
              loader={<ConsumerBookingCard isLoading />}
              renderItem={({ item }) =>
                selectedTab === BookingTabEnum.APPOINTMENT ? (
                  <ConsumerPrivateBookingListItem
                    key={item.id}
                    handleSelectBookingForCancelation={
                      handleSelectBookingForCancelation
                    }
                    isLoading={isLoading}
                    isSelected={selectedPrivateBooking?.id === item.id}
                    item={item as ConsumerPrivateBooking}
                    onBookingCardClick={handleSetSelectedPrivateBooking}
                    sessionTimeDisplay={sessionTimeDisplay}
                    timezone={timezone}
                  />
                ) : (
                  <ConsumerBookingListItem
                    key={item.id}
                    handleJoinOnlineBooking={handleJoinOnlineBooking}
                    handleSelectBookingForCancelation={
                      handleSelectBookingForCancelation
                    }
                    handleShowSpotDetails={handleShowSpotDetails}
                    isLoading={isLoading}
                    isSelected={item.id === selectedBooking?.id}
                    item={item as ConsumerBooking}
                    onBookingCardClick={handleSetSelectedBooking}
                    sessionTimeDisplay={sessionTimeDisplay}
                    timezone={timezone}
                  />
                )
              }
            />
          </ul>

          <ConsumerBookingDetailsCard
            cancellationDate={formatAsDate(
              selectedBooking?.date_canceled ||
                selectedPrivateBooking?.date_canceled,
            )}
            coachDescription={
              selectedBooking?.coach?.description ||
              selectedPrivateBooking?.coach?.description
            }
            coachFacebookURL={
              selectedBooking?.coach?.facebook_url ||
              selectedPrivateBooking?.coach?.facebook_url
            }
            coachInstagramURL={
              selectedBooking?.coach?.instagram_url ||
              selectedPrivateBooking?.coach?.instagram_url
            }
            coachName={
              selectedBooking?.coach?.name ||
              selectedPrivateBooking?.coach?.name
            }
            coachOverrideDescription={
              selectedBooking?.coach_override?.description
            }
            coachOverrideName={selectedBooking?.coach_override?.name}
            coachOverridePicture={selectedBooking?.coach_override?.photo}
            coachPicture={
              selectedBooking?.coach?.photo ||
              selectedPrivateBooking?.coach?.photo
            }
            consumerPaymentPackAvailableCredits={
              selectedBooking?.consumer_payment_pack?.available_credits ||
              selectedPrivateBooking?.private_consumer_pass?.private_pass
                ?.credits -
                selectedPrivateBooking?.private_consumer_pass?.used_credits
            }
            consumerPaymentPackPenaltyDisabledFrom={
              selectedBooking?.consumer_payment_pack?.penalty_disabled_from
            }
            consumerPaymentPackPenaltyDisabledUntil={
              selectedBooking?.consumer_payment_pack?.penalty_disabled_until
            }
            consumerPaymentPackUsedCredits={
              selectedBooking?.consumer_payment_pack?.used_credits ||
              selectedPrivateBooking?.private_consumer_pass?.used_credits
            }
            creditsToRefund={
              selectedBooking?.offer?.credit_price ||
              selectedPrivateBooking?.private_slot?.credit
            }
            date={selectedBookingDate}
            description={
              selectedBooking?.meta_activity?.description ||
              selectedPrivateBooking?.private_service?.description
            }
            establishmentAddress={
              (selectedBooking || selectedPrivateBooking)?.establishment
                ?.location?.address
            }
            isCancelled={
              !!(selectedBooking || selectedPrivateBooking)?.date_canceled
            }
            isCancelledFromManager={
              (selectedBooking || selectedPrivateBooking)
                ?.booking_status_code === BOOKING_STATUS_CANCELLED_BY_MANAGER.id
            }
            isConsumerPaymentPackDisabled={
              selectedBooking?.consumer_payment_pack?.disabled ||
              selectedPrivateBooking?.private_consumer_pass?.disabled
            }
            isLateCancellation={isLateCancellation}
            isLoading={isLoading}
            levelName={
              selectedBooking?.level?.name ||
              selectedPrivateBooking?.private_slot?.name
            }
            metaActivityLastDiscardMinutes={
              selectedBooking?.meta_activity?.last_discard_minutes ||
              selectedPrivateBooking?.private_service?.last_discard_minutes
            }
            metaActivityName={
              selectedBooking?.offer?.name_override ||
              selectedBooking?.meta_activity?.name ||
              selectedPrivateBooking?.private_service?.name
            }
            metaActivityPicture={
              selectedBooking?.meta_activity?.cover_main ||
              selectedPrivateBooking?.private_service?.cover_main
            }
            paymentPackName={
              selectedBooking?.consumer_payment_pack?.payment_pack?.name ||
              (!selectedPrivateBooking?.is_unpaid &&
                selectedPrivateBooking?.private_consumer_pass?.private_pass
                  ?.name)
            }
            paymentPackTotalCredits={
              selectedBooking?.consumer_payment_pack?.payment_pack?.credits ||
              selectedPrivateBooking?.private_consumer_pass?.private_pass
                ?.credits
            }
            sessionTimeDisplay={sessionTimeDisplay}
            showPlaceholder={!(selectedBooking || selectedPrivateBooking)}
            timezoneName={timezone}
            workshopLinkedOffers={relatedBookingsInGroup}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(ConsumerBookingListContainer);
