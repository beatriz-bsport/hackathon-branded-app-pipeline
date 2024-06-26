import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { BOOKING_STATUS_CANCELLED_BY_MANAGER } from '@bsport/common/lib/master-data/booking_status_code';
import {
  MarketPlaceCoachDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization';

import {
  getCoachDisplayName,
  getCoachDisplayPicture,
} from '@bsport/common/lib/master-data/coach';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import {
  formatAsDate,
  getIsLateBookingCancellation,
} from '#src/utils/datetime';
import { GenericInfiniteScrollEnhancedCssOnly } from '#src/components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerBookingCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard';
import ConsumerBookingDetailsCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard';
import ConsumerBookingListItem from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingListItem';
import ConsumerPrivateBookingListItem from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerPrivateBookingListItem';
import ConsumerBookingOptionListItem from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingOptionListItem';
import Typography from '#Fabrique/Typography';

import type {
  ConsumerBooking,
  ConsumerBookingOption,
  ConsumerPrivateBooking,
} from '#src/libs/booking/types';
import type { BookingTab } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';

import { BookingTabEnum } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';
import { BookingFilterTabEnum } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/constants';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/constants';

import './styles.css';

type Props = {
  isMobile?: boolean;
  isLoading?: boolean;
  selectedBooking?: ConsumerBooking;
  selectedPrivateBooking?: ConsumerPrivateBooking;
  selectedBookingOption?: ConsumerBookingOption;
  bookingList: ConsumerBooking[];
  bookingOptionList: ConsumerBookingOption[];
  privateBookingList: ConsumerPrivateBooking[];
  hasNextPage?: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  selectedTab: BookingTab;
  selectedFilterTab: BookingFilterTab;
  handleSeeBookingDetails: (
    bookingId: number,
    type: 'booking' | 'privateBooking' | 'bookingOption',
  ) => void;
  coachDisplay?: MarketPlaceCoachDisplay;
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
  handleBookSession: (offerId: number) => void;
  getOfferElligibleGuestNumber: (offerId: number) => number;
  setSelectedBookingForBookingForAGuest: (booking: ConsumerBooking) => void;
};

export const ConsumerBookingListContainer: React.FC<Props> = ({
  isMobile,
  isLoading,
  bookingList,
  bookingOptionList,
  privateBookingList,
  selectedBooking,
  selectedPrivateBooking,
  selectedBookingOption,
  hasNextPage,
  timezone,
  sessionTimeDisplay,
  relatedBookingsInGroup,
  selectedTab,
  selectedFilterTab,
  handleSeeBookingDetails,
  coachDisplay,
  handlePaginationFetchMore,
  handleSelectBookingForCancelation,
  handleJoinOnlineBooking,
  handleShowSpotDetails,
  handleBookSession,
  getOfferElligibleGuestNumber,
  setSelectedBookingForBookingForAGuest,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetSelectedBooking = useCallback(
    (bookingId: number) => {
      handleSeeBookingDetails(bookingId, 'booking');
    },
    [handleSeeBookingDetails],
  );

  const handleSetSelectedPrivateBooking = useCallback(
    (privateBookingId: number) => {
      handleSeeBookingDetails(privateBookingId, 'privateBooking');
    },
    [handleSeeBookingDetails],
  );

  const handleSetSelectedBookingOption = useCallback(
    (bookingOptionId: number) => {
      handleSeeBookingDetails(bookingOptionId, 'bookingOption');
    },
    [handleSeeBookingDetails],
  );

  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart:
      selectedBooking?.offer?.date_start ||
      selectedPrivateBooking?.date_start ||
      selectedBookingOption?.offer?.date_start,
    durationMinute:
      selectedBooking?.offer?.duration_minute ||
      selectedPrivateBooking?.private_slot?.duration_minutes ||
      selectedBookingOption?.offer?.duration_minute,
    establishmentTimezoneName:
      selectedBooking?.establishment?.tzname ||
      selectedPrivateBooking?.establishment?.tzname ||
      selectedBookingOption?.establishment?.tzname,
    isMetaActivityBroadcast: selectedBooking?.meta_activity?.is_broadcast,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const isLateCancellation = getIsLateBookingCancellation(
    selectedBooking?.date_canceled || selectedPrivateBooking?.date_canceled,
    selectedBooking?.meta_activity?.last_discard_minutes ||
      selectedPrivateBooking?.private_service?.last_discard_minutes,
    selectedBooking?.offer?.date_start || selectedPrivateBooking?.date_start,
  );

  const currentBookingList = (() => {
    if (selectedFilterTab === BookingFilterTabEnum.WAITLIST) {
      return bookingOptionList;
    }
    if (selectedTab === BookingTabEnum.APPOINTMENT) {
      return privateBookingList;
    }
    return bookingList;
  })();

  const showPlaceholder = (() => {
    if (selectedFilterTab === BookingFilterTabEnum.WAITLIST) {
      return (
        !isLoading && (!bookingOptionList || bookingOptionList?.length === 0)
      );
    }
    if (selectedTab === BookingTabEnum.APPOINTMENT) {
      return (
        !isLoading && (!privateBookingList || privateBookingList?.length === 0)
      );
    }
    return !isLoading && (!bookingList || bookingList?.length === 0);
  })();

  const selectedBookingCoachName = getCoachDisplayName(
    coachDisplay,
    selectedBooking?.coach?.name ||
      selectedPrivateBooking?.coach?.name ||
      selectedBookingOption?.coach?.name,
    selectedBooking?.coach?.firstname ||
      selectedPrivateBooking?.coach?.firstname ||
      selectedBookingOption?.coach?.firstname,
  );

  const selectedBookingCoachOverrideName = getCoachDisplayName(
    coachDisplay,
    selectedBooking?.coach_override?.name,
    selectedBooking?.coach_override?.firstname,
  );

  const selectedBookingCoachPicture = getCoachDisplayPicture(
    coachDisplay,
    selectedBooking?.coach?.photo ||
      selectedPrivateBooking?.coach?.photo ||
      selectedBookingOption?.coach?.photo,
  );

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
              ConsumerBooking | ConsumerPrivateBooking | ConsumerBookingOption
            >
              className="bs-consumer-page-root__bookings__list__infinite-scroll"
              fetchMoreData={handlePaginationFetchMore}
              hasMore={hasNextPage}
              height={
                isMobile
                  ? MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT
                  : MY_BOOKINGS_LIST_CONTAINER_HEIGHT
              }
              items={currentBookingList}
              loader={<ConsumerBookingCard isLoading />}
              renderItem={({ item }) => {
                if (selectedFilterTab === BookingFilterTabEnum.WAITLIST) {
                  return (
                    <ConsumerBookingOptionListItem
                      key={item.id}
                      coachDisplay={coachDisplay}
                      handleBookSession={handleBookSession}
                      handleSelectBookingForCancelation={
                        handleSelectBookingForCancelation
                      }
                      isLoading={isLoading}
                      isSelected={
                        !isMobile && selectedBookingOption?.id === item.id
                      }
                      item={item as ConsumerBookingOption}
                      onBookingCardClick={handleSetSelectedBookingOption}
                      sessionTimeDisplay={sessionTimeDisplay}
                      timezone={timezone}
                    />
                  );
                }
                if (selectedTab === BookingTabEnum.APPOINTMENT) {
                  return (
                    <ConsumerPrivateBookingListItem
                      key={item.id}
                      coachDisplay={coachDisplay}
                      handleSelectBookingForCancelation={
                        handleSelectBookingForCancelation
                      }
                      isLoading={isLoading}
                      isSelected={
                        !isMobile && selectedPrivateBooking?.id === item.id
                      }
                      item={item as ConsumerPrivateBooking}
                      onBookingCardClick={handleSetSelectedPrivateBooking}
                      sessionTimeDisplay={sessionTimeDisplay}
                      timezone={timezone}
                    />
                  );
                }
                return (
                  <ConsumerBookingListItem
                    key={item.id}
                    coachDisplay={coachDisplay}
                    getOfferElligibleGuestNumber={getOfferElligibleGuestNumber}
                    handleJoinOnlineBooking={handleJoinOnlineBooking}
                    handleSelectBookingForCancelation={
                      handleSelectBookingForCancelation
                    }
                    handleShowSpotDetails={handleShowSpotDetails}
                    isLoading={isLoading}
                    isSelected={!isMobile && item.id === selectedBooking?.id}
                    item={item as ConsumerBooking}
                    onBookingCardClick={handleSetSelectedBooking}
                    sessionTimeDisplay={sessionTimeDisplay}
                    setSelectedBookingForBookingForAGuest={
                      setSelectedBookingForBookingForAGuest
                    }
                    timezone={timezone}
                  />
                );
              }}
            />
          </ul>

          <ConsumerBookingDetailsCard
            cancellationDate={formatAsDate(
              selectedBooking?.date_canceled ||
                selectedPrivateBooking?.date_canceled,
            )}
            className={classNames(
              'bs-consumer-page-root__bookings__details-card',
              {
                'bs-consumer-page-root__bookings__details-card--hidden':
                  isMobile,
              },
            )}
            coachDescription={
              selectedBooking?.coach?.description ||
              selectedPrivateBooking?.coach?.description ||
              selectedBookingOption?.coach?.description
            }
            coachFacebookURL={
              selectedBooking?.coach?.facebook_url ||
              selectedPrivateBooking?.coach?.facebook_url ||
              selectedBookingOption?.coach?.facebook_url
            }
            coachInstagramURL={
              selectedBooking?.coach?.instagram_url ||
              selectedPrivateBooking?.coach?.instagram_url ||
              selectedBookingOption?.coach?.instagram_url
            }
            coachName={selectedBookingCoachName}
            coachOverrideDescription={
              selectedBooking?.coach_override?.description
            }
            coachOverrideName={selectedBookingCoachOverrideName}
            coachOverridePicture={selectedBooking?.coach_override?.photo}
            coachPicture={selectedBookingCoachPicture}
            consumerPaymentPackAvailableCredits={
              selectedBooking?.consumer_payment_pack?.available_credits ??
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
              selectedBooking?.consumer_payment_pack?.used_credits ??
              selectedPrivateBooking?.private_consumer_pass?.used_credits
            }
            creditsToRefund={
              selectedBooking?.offer?.credit_price ??
              selectedPrivateBooking?.private_slot?.credit
            }
            date={selectedBookingDate}
            description={
              selectedBooking?.meta_activity?.description ||
              selectedPrivateBooking?.private_service?.description ||
              selectedBookingOption?.meta_activity?.description
            }
            establishmentAddress={
              (
                selectedBooking ||
                selectedPrivateBooking ||
                selectedBookingOption
              )?.establishment?.location?.address
            }
            establishmentTitle={
              (
                selectedBooking ||
                selectedPrivateBooking ||
                selectedBookingOption
              )?.establishment?.title
            }
            isCancelled={
              !!(selectedBooking || selectedPrivateBooking)?.date_canceled ||
              !!selectedBookingOption?.cancelled
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
            isPaymentPackUnlimited={
              selectedBooking?.consumer_payment_pack?.payment_pack?.unlimited
            }
            levelName={
              selectedBooking?.level?.name ||
              selectedPrivateBooking?.private_slot?.name ||
              selectedBookingOption?.level?.name
            }
            metaActivityLastDiscardMinutes={
              selectedBooking?.meta_activity?.last_discard_minutes ??
              selectedPrivateBooking?.private_service?.last_discard_minutes ??
              selectedBookingOption?.meta_activity?.last_discard_minutes
            }
            metaActivityName={
              selectedBooking?.offer?.name_override ||
              selectedBooking?.meta_activity?.name ||
              selectedPrivateBooking?.private_service?.name ||
              selectedBookingOption?.meta_activity?.name
            }
            metaActivityPicture={
              selectedBooking?.meta_activity?.cover_main ||
              selectedPrivateBooking?.private_service?.cover_main ||
              selectedBookingOption?.meta_activity?.cover_main
            }
            paymentPackName={
              selectedBooking?.consumer_payment_pack?.payment_pack?.name ||
              (!selectedPrivateBooking?.is_unpaid &&
                selectedPrivateBooking?.private_consumer_pass?.private_pass
                  ?.name)
            }
            paymentPackTotalCredits={
              selectedBooking?.consumer_payment_pack?.payment_pack?.credits ??
              selectedPrivateBooking?.private_consumer_pass?.private_pass
                ?.credits
            }
            sessionTimeDisplay={sessionTimeDisplay}
            showPlaceholder={
              !(
                selectedBooking ||
                selectedPrivateBooking ||
                selectedBookingOption
              )
            }
            timezoneName={timezone}
            workshopLinkedOffers={relatedBookingsInGroup}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(ConsumerBookingListContainer);
