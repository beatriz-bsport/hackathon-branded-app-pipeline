import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code.js';
import {
  MarketPlaceCoachDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization.js';

import {
  getCoachDisplayName,
  getCoachDisplayPicture,
} from '@bsport/common/lib/master-data/coach.js';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import {
  formatAsDate,
  getIsLateBookingCancellation,
} from '#src/utils/datetime';
import { getLevelTranslation } from '#src/libs/level/utils';
import ConsumerBookingDetailsCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard';
import ConsumerBookingListItem from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingListItem';
import ConsumerPrivateBookingListItem from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerPrivateBookingListItem';
import ConsumerBookingOptionListItem from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingOptionListItem';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';
import ConsumerSpaceList from '#src/libs/consumer-space/components/reworked/@Layout/ConsumerSpaceList';

import type {
  ConsumerBooking,
  ConsumerBookingOption,
  ConsumerPrivateBooking,
} from '#src/libs/booking/types';
import type {
  BookingTab,
  BookingFilterTab,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/types';

import {
  BookingFilterTabEnum,
  BookingTabEnum,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/constants';

import type { WaitingListConfiguration } from '#src/libs/waiting-list/types';
import type { OfferStatusWaitingListPosition } from '#src/libs/offer/types';
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
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  selectedTab: BookingTab;
  selectedFilterTab: BookingFilterTab;
  handleSeeBookingDetails: (
    bookingId: number,
    type: 'booking' | 'privateBooking' | 'bookingOption',
  ) => void;
  coachDisplay?: MarketPlaceCoachDisplay;
  handleChangePage: (page: number) => void;
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
  getOfferWaitingListPosition: (
    offerId: number,
  ) => OfferStatusWaitingListPosition;
  waitingListConfiguration: WaitingListConfiguration;
  currentCount: number;
  currentPage: number;
};

type ConsumerBookingListContainerRowProps = {
  isCurrentBookingSelected: boolean;
  item: ConsumerBooking | ConsumerPrivateBooking | ConsumerBookingOption;
  handleSetSelectedBooking: (bookingId: number) => void;
  handleSetSelectedPrivateBooking: (privateBookingId: number) => void;
  handleSetSelectedBookingOption: (bookingOptionId: number) => void;
} & Pick<
  Props,
  | 'selectedFilterTab'
  | 'selectedTab'
  | 'coachDisplay'
  | 'getOfferWaitingListPosition'
  | 'handleBookSession'
  | 'handleSelectBookingForCancelation'
  | 'isMobile'
  | 'isLoading'
  | 'timezone'
  | 'getOfferElligibleGuestNumber'
  | 'sessionTimeDisplay'
  | 'waitingListConfiguration'
  | 'handleJoinOnlineBooking'
  | 'handleShowSpotDetails'
  | 'setSelectedBookingForBookingForAGuest'
>;

const ConsumerBookingListContainerRow: React.FC<
  ConsumerBookingListContainerRowProps
> = ({
  selectedFilterTab,
  selectedTab,
  coachDisplay,
  isMobile,
  isLoading,
  timezone,
  sessionTimeDisplay,
  waitingListConfiguration,
  isCurrentBookingSelected,
  handleSetSelectedBooking,
  handleSetSelectedPrivateBooking,
  handleSetSelectedBookingOption,
  getOfferWaitingListPosition,
  handleBookSession,
  handleSelectBookingForCancelation,
  getOfferElligibleGuestNumber,
  handleJoinOnlineBooking,
  handleShowSpotDetails,
  setSelectedBookingForBookingForAGuest,
  item,
}: ConsumerBookingListContainerRowProps) => {
  if (selectedFilterTab === BookingFilterTabEnum.WAITLIST) {
    return (
      <ConsumerBookingOptionListItem
        coachDisplay={coachDisplay}
        getOfferWaitingListPosition={getOfferWaitingListPosition}
        handleBookSession={handleBookSession}
        handleSelectBookingForCancelation={handleSelectBookingForCancelation}
        isLoading={isLoading}
        isSelected={isCurrentBookingSelected}
        item={item as ConsumerBookingOption}
        onBookingCardClick={handleSetSelectedBookingOption}
        sessionTimeDisplay={sessionTimeDisplay}
        timezone={timezone}
        waitingListConfiguration={waitingListConfiguration}
      />
    );
  }
  if (selectedTab === BookingTabEnum.APPOINTMENT) {
    return (
      <ConsumerPrivateBookingListItem
        coachDisplay={coachDisplay}
        handleSelectBookingForCancelation={handleSelectBookingForCancelation}
        isLoading={isLoading}
        isSelected={isCurrentBookingSelected}
        item={item as ConsumerPrivateBooking}
        onBookingCardClick={handleSetSelectedPrivateBooking}
        sessionTimeDisplay={sessionTimeDisplay}
        timezone={timezone}
      />
    );
  }
  return (
    <ConsumerBookingListItem
      coachDisplay={coachDisplay}
      getOfferElligibleGuestNumber={getOfferElligibleGuestNumber}
      handleJoinOnlineBooking={handleJoinOnlineBooking}
      handleSelectBookingForCancelation={handleSelectBookingForCancelation}
      handleShowSpotDetails={handleShowSpotDetails}
      isLoading={isLoading}
      isMobile={isMobile}
      isSelected={isCurrentBookingSelected}
      item={item as ConsumerBooking}
      onBookingCardClick={handleSetSelectedBooking}
      sessionTimeDisplay={sessionTimeDisplay}
      setSelectedBookingForBookingForAGuest={
        setSelectedBookingForBookingForAGuest
      }
      timezone={timezone}
    />
  );
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
  timezone,
  sessionTimeDisplay,
  relatedBookingsInGroup,
  selectedTab,
  selectedFilterTab,
  handleSeeBookingDetails,
  coachDisplay,
  handleChangePage,
  handleSelectBookingForCancelation,
  handleJoinOnlineBooking,
  handleShowSpotDetails,
  handleBookSession,
  getOfferElligibleGuestNumber,
  setSelectedBookingForBookingForAGuest,
  getOfferWaitingListPosition,
  waitingListConfiguration,
  currentCount,
  currentPage,
}) => {
  const { t } = useTranslation(['consumerSpace', 'translation', 'common']);

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

  const levelName = getLevelTranslation(
    selectedBooking?.level?.id ||
      selectedPrivateBooking?.private_slot?.id ||
      selectedBookingOption?.level?.id,
    selectedBooking?.level?.name ||
      selectedPrivateBooking?.private_slot?.name ||
      selectedBookingOption?.level?.name,
    t,
  );

  const isLateCancellation = getIsLateBookingCancellation(
    selectedBooking?.date_canceled || selectedPrivateBooking?.date_canceled,
    selectedBooking?.meta_activity?.last_discard_minutes ||
      selectedPrivateBooking?.private_service?.last_discard_minutes,
    selectedBooking?.offer?.date_start || selectedPrivateBooking?.date_start,
  );

  const currentBookingList = React.useMemo(() => {
    if (selectedFilterTab === BookingFilterTabEnum.WAITLIST) {
      return bookingOptionList;
    }
    if (selectedTab === BookingTabEnum.APPOINTMENT) {
      return privateBookingList;
    }
    return bookingList;
  }, [
    selectedTab,
    selectedFilterTab,
    bookingList,
    privateBookingList,
    bookingOptionList,
  ]);

  const isCurrentTabContentEmpty = React.useMemo(() => {
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
  }, [
    isLoading,
    selectedFilterTab,
    bookingOptionList,
    privateBookingList,
    bookingList,
    selectedTab,
  ]);

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

  const getIsCurrentBookingSelected = useCallback(
    (index: number) => {
      if (selectedFilterTab === BookingFilterTabEnum.WAITLIST) {
        return (
          !isMobile &&
          selectedBookingOption?.id === currentBookingList[index]?.id
        );
      }
      if (selectedTab === BookingTabEnum.APPOINTMENT) {
        return (
          !isMobile &&
          selectedPrivateBooking?.id === currentBookingList[index]?.id
        );
      }
      return !isMobile && currentBookingList[index]?.id === selectedBooking?.id;
    },
    [
      currentBookingList,
      isMobile,
      selectedBooking?.id,
      selectedBookingOption?.id,
      selectedFilterTab,
      selectedPrivateBooking?.id,
      selectedTab,
    ],
  );

  return (
    <PageInnerContentLayout
      count={currentCount}
      DetailComponent={
        <ConsumerBookingDetailsCard
          cancellationDate={formatAsDate(
            selectedBooking?.date_canceled ||
              selectedPrivateBooking?.date_canceled,
          )}
          className="bs-consumer-page-root__bookings__details-card"
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
            (selectedBooking || selectedPrivateBooking || selectedBookingOption)
              ?.establishment?.location?.address
          }
          establishmentTitle={
            (selectedBooking || selectedPrivateBooking || selectedBookingOption)
              ?.establishment?.title
          }
          isCancelled={
            !!(selectedBooking || selectedPrivateBooking)?.date_canceled ||
            !!selectedBookingOption?.cancelled
          }
          isCancelledFromManager={
            (selectedBooking || selectedPrivateBooking)?.booking_status_code ===
            BOOKING_STATUS_CANCELLED_BY_MANAGER.id
          }
          isCancelledFromOffer={
            (selectedBooking || selectedPrivateBooking)?.booking_status_code ===
            BOOKING_STATUS_CANCELLED_BY_OFFER.id
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
          levelName={levelName}
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
              selectedPrivateBooking?.private_consumer_pass?.private_pass?.name)
          }
          paymentPackTotalCredits={
            selectedBooking?.consumer_payment_pack?.payment_pack?.credits ??
            selectedPrivateBooking?.private_consumer_pass?.private_pass?.credits
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
      }
      emptyPlaceholder={t(
        `consumerSpace:reworked.myBookings.listContainer.placeholder.${selectedTab}.${selectedFilterTab}`,
      )}
      isEmpty={isCurrentTabContentEmpty}
      isLoading={isLoading}
      onPageChange={handleChangePage}
      page={currentPage}
      VirtualizedListComponent={
        <ConsumerSpaceList<
          ConsumerBooking | ConsumerPrivateBooking | ConsumerBookingOption
        >
          data={currentBookingList}
          isLoading={isLoading}
          rowRenderer={({ item, index }) => (
            <ConsumerBookingListContainerRow
              getOfferElligibleGuestNumber={getOfferElligibleGuestNumber}
              getOfferWaitingListPosition={getOfferWaitingListPosition}
              handleBookSession={handleBookSession}
              handleJoinOnlineBooking={handleJoinOnlineBooking}
              handleSelectBookingForCancelation={
                handleSelectBookingForCancelation
              }
              handleSetSelectedBooking={handleSetSelectedBooking}
              handleSetSelectedBookingOption={handleSetSelectedBookingOption}
              handleSetSelectedPrivateBooking={handleSetSelectedPrivateBooking}
              handleShowSpotDetails={handleShowSpotDetails}
              isCurrentBookingSelected={getIsCurrentBookingSelected(index)}
              item={item}
              selectedFilterTab={selectedFilterTab}
              selectedTab={selectedTab}
              sessionTimeDisplay={sessionTimeDisplay}
              setSelectedBookingForBookingForAGuest={
                setSelectedBookingForBookingForAGuest
              }
              timezone={timezone}
              waitingListConfiguration={waitingListConfiguration}
            />
          )}
        />
      }
    />
  );
};

export default React.memo(ConsumerBookingListContainer);
