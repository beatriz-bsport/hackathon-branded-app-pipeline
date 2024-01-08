import React from 'react';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import useConsumerBookingsDataManager from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingsDataManager';
import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerBookingHeader from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingHeader';
import ConsumerBookingTabs from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs';
import ConsumerBookingFilters from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters';
import ConsumerBookingListContainer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingListContainer';
import ConsumerBookingCancelModal from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCancelModal';
import ConsumerBookingOnlineWarningModal from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingOnlineWarningModal';
import ConsumerBookingSpotSchedulingModal from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingSpotSchedulingModal';

import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { ConsumerBookingReworked } from '#libs/consumer-space/types';
import type {
  ConsumerBooking,
  BookingREST,
  CancelBookingFilterParams,
} from '#libs/booking/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { OptionCallback } from '../../../../../../state/types';
import type { SpotType } from '#libs/spot-scheduling/types';
import type { CompanyTheme } from '#libs/theme/types';

import './styles.css';

type Props = {
  pastBookingsState: ConsumerBookingReworked;
  pastBookingsList: ConsumerBooking[];
  futureBookingsState: ConsumerBookingReworked;
  futureBookingsList: ConsumerBooking[];
  pastBookingsWorkshopState: ConsumerBookingReworked;
  pastBookingsWorkshopList: ConsumerBooking[];
  futureBookingsWorkshopState: ConsumerBookingReworked;
  futureBookingsWorkshopList: ConsumerBooking[];
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  spotTypes: SpotType[];
  companyTheme: CompanyTheme;
  getIsBookingsLoading: (selectedTab: BookingTab) => boolean;
  handleBookASessionClick: () => void;
  fetchPastBookings: () => void;
  fetchFutureBookings: () => void;
  fetchPastBookingsWorkshop: () => void;
  fetchFutureBookingsWorkshop: () => void;
  cancelBooking: (
    bookingId: number,
    params: CancelBookingFilterParams,
    options?: OptionCallback<BookingREST>,
  ) => void;
  getRelatedConsumerBookingsInGroup: (
    groupId: number,
    filterTab: BookingFilterTab,
  ) => ConsumerBooking[];
  fetchAssociatedBlueprintObjects: (blueprintId: number) => void;
};

export const ConsumerBookingPageReworkedComponent: React.FC<Props> = ({
  pastBookingsState,
  pastBookingsList,
  futureBookingsState,
  futureBookingsList,
  pastBookingsWorkshopState,
  pastBookingsWorkshopList,
  futureBookingsWorkshopState,
  futureBookingsWorkshopList,
  timezone,
  sessionTimeDisplay,
  spotTypes,
  companyTheme,
  getIsBookingsLoading,
  handleBookASessionClick,
  fetchPastBookings,
  fetchFutureBookings,
  fetchPastBookingsWorkshop,
  fetchFutureBookingsWorkshop,
  cancelBooking,
  getRelatedConsumerBookingsInGroup,
  fetchAssociatedBlueprintObjects,
}) => {
  const {
    selectedTab,
    selectedFilterTab,
    selectedBooking,
    selectedBookingForCancelation,
    isCancelBookingModalOpen,
    isCancellingBooking,
    isOnlineWarningModalOpen,
    isSpotSchedulingModalOpen,
    onlineWarningModalOfferDate,
    selectedBookingSpotDetails,
    futureItemsCount,
    nextPage,
    bookingList,
    isBookingsLoading,
    relatedBookingsInGroup,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedBooking,
    handleSelectBookingForCancelation,
    handleToggleCancelBookingModal,
    handlePaginationFetchMore,
    handleJoinOnlineBooking,
    handleCancelBooking,
    handleToggleOnlineWarningModal,
    handleShowSpotDetails,
    handleToggleSpotSchedulingModal,
  } = useConsumerBookingsDataManager({
    pastBookingsState,
    pastBookingsList,
    futureBookingsState,
    futureBookingsList,
    pastBookingsWorkshopState,
    pastBookingsWorkshopList,
    futureBookingsWorkshopState,
    futureBookingsWorkshopList,
    getIsBookingsLoading,
    fetchPastBookings,
    fetchFutureBookings,
    fetchPastBookingsWorkshop,
    fetchFutureBookingsWorkshop,
    getRelatedConsumerBookingsInGroup,
    cancelBooking,
    fetchAssociatedBlueprintObjects,
  });

  const emptyFn = () => {};

  return (
    <MarketplacePageContent>
      <div className="bs-consumer-booking-page__root">
        {isCancelBookingModalOpen && !!selectedBookingForCancelation && (
          <ConsumerBookingCancelModal
            booking={selectedBookingForCancelation}
            cancelBooking={handleCancelBooking}
            isLoading={isCancellingBooking}
            onClose={handleToggleCancelBookingModal}
            relatedBookings={relatedBookingsInGroup}
            sessionTimeDisplay={sessionTimeDisplay}
            timezone={timezone}
          />
        )}
        {isOnlineWarningModalOpen && !!onlineWarningModalOfferDate && (
          <ConsumerBookingOnlineWarningModal
            offerDateStart={onlineWarningModalOfferDate}
            onClose={handleToggleOnlineWarningModal}
          />
        )}
        {isSpotSchedulingModalOpen && !!selectedBookingSpotDetails && (
          <ConsumerBookingSpotSchedulingModal
            bookingOffer={selectedBooking?.offer}
            bookingSpotDetails={selectedBookingSpotDetails}
            companyTheme={companyTheme}
            onClose={handleToggleSpotSchedulingModal}
            spotTypes={spotTypes}
          />
        )}

        <ConsumerBookingHeader onBookSessionClick={handleBookASessionClick} />

        <ConsumerBookingTabs
          onChangeBookingTab={handleSetSelectedTab}
          selectedTab={selectedTab}
        />

        <ConsumerBookingFilters
          futureBookingsCount={futureItemsCount}
          onChangeFilterTab={handleSetSelectedFilterTab}
          onDatePickerClick={emptyFn}
          selectedTab={selectedFilterTab}
        />

        <ConsumerBookingListContainer
          bookingList={bookingList}
          handleJoinOnlineBooking={handleJoinOnlineBooking}
          handlePaginationFetchMore={handlePaginationFetchMore}
          handleSelectBookingForCancelation={handleSelectBookingForCancelation}
          handleShowSpotDetails={handleShowSpotDetails}
          hasNextPage={!!nextPage}
          isLoading={isBookingsLoading}
          onBookingCardClick={handleSetSelectedBooking}
          relatedBookingsInGroup={relatedBookingsInGroup}
          selectedBooking={selectedBooking}
          selectedFilterTab={selectedFilterTab}
          selectedTab={selectedTab}
          sessionTimeDisplay={sessionTimeDisplay}
          timezone={timezone}
        />
      </div>
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerBookingPageReworkedComponent);
