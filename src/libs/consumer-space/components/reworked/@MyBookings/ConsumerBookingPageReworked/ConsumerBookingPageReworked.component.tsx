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
import type {
  ConsumerBookingReworked,
  ConsumerPrivateBookingReworked,
} from '#libs/consumer-space/types';
import type {
  ConsumerBooking,
  BookingREST,
  CancelBookingFilterParams,
  ConsumerPrivateBooking,
} from '#libs/booking/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { OptionCallback } from '../../../../../../state/types';
import type { SpotType } from '#libs/spot-scheduling/types';
import type { CompanyTheme } from '#libs/theme/types';
import type { PrivateBooking } from '#libs/private-service/types';

import './styles.css';

type Props = {
  pastBookingsState: ConsumerBookingReworked;
  pastBookingsList: ConsumerBooking[];
  futureBookingsState: ConsumerBookingReworked;
  futureBookingsList: ConsumerBooking[];
  pastPrivateBookingsState: ConsumerPrivateBookingReworked;
  pastPrivateBookingsList: ConsumerPrivateBooking[];
  futurePrivateBookingsState: ConsumerPrivateBookingReworked;
  futurePrivateBookingsList: ConsumerPrivateBooking[];
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
  fetchPastPrivateBookings: () => void;
  fetchFuturePrivateBookings: () => void;
  fetchPastBookingsWorkshop: () => void;
  fetchFutureBookingsWorkshop: () => void;
  resetConsumerState: () => void;
  cancelBooking: (
    bookingId: number,
    params: CancelBookingFilterParams,
    options?: OptionCallback<BookingREST>,
  ) => void;
  cancelPrivateBooking: (
    bookingId: number,
    params: CancelBookingFilterParams,
    options?: OptionCallback<PrivateBooking>,
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
  pastPrivateBookingsState,
  pastPrivateBookingsList,
  futurePrivateBookingsState,
  futurePrivateBookingsList,
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
  fetchPastPrivateBookings,
  fetchFuturePrivateBookings,
  fetchPastBookingsWorkshop,
  fetchFutureBookingsWorkshop,
  resetConsumerState,
  cancelBooking,
  getRelatedConsumerBookingsInGroup,
  fetchAssociatedBlueprintObjects,
  cancelPrivateBooking,
}) => {
  const {
    selectedTab,
    selectedFilterTab,
    selectedBooking,
    selectedPrivateBooking,
    selectedBookingForCancelation,
    selectedPrivateBookingForCancelation,
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
    privateBookingList,
    relatedBookingsInGroup,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedBooking,
    handleSetSelectedPrivateBooking,
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
    pastPrivateBookingsState,
    pastPrivateBookingsList,
    futurePrivateBookingsState,
    futurePrivateBookingsList,
    pastBookingsWorkshopState,
    pastBookingsWorkshopList,
    futureBookingsWorkshopState,
    futureBookingsWorkshopList,
    getIsBookingsLoading,
    fetchPastBookings,
    fetchFutureBookings,
    fetchPastPrivateBookings,
    fetchFuturePrivateBookings,
    fetchPastBookingsWorkshop,
    fetchFutureBookingsWorkshop,
    resetConsumerState,
    getRelatedConsumerBookingsInGroup,
    cancelBooking,
    fetchAssociatedBlueprintObjects,
    cancelPrivateBooking,
  });

  const emptyFn = () => {};

  return (
    <MarketplacePageContent>
      <div className="bs-consumer-booking-page__root">
        {isCancelBookingModalOpen &&
          !!(
            selectedBookingForCancelation ||
            selectedPrivateBookingForCancelation
          ) && (
            <ConsumerBookingCancelModal
              booking={selectedBookingForCancelation}
              cancelBooking={handleCancelBooking}
              isLoading={isCancellingBooking}
              onClose={handleToggleCancelBookingModal}
              privateBooking={selectedPrivateBookingForCancelation}
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
          handleSetSelectedBooking={handleSetSelectedBooking}
          handleSetSelectedPrivateBooking={handleSetSelectedPrivateBooking}
          handleShowSpotDetails={handleShowSpotDetails}
          hasNextPage={!!nextPage}
          isLoading={isBookingsLoading}
          privateBookingList={privateBookingList}
          relatedBookingsInGroup={relatedBookingsInGroup}
          selectedBooking={selectedBooking}
          selectedFilterTab={selectedFilterTab}
          selectedPrivateBooking={selectedPrivateBooking}
          selectedTab={selectedTab}
          sessionTimeDisplay={sessionTimeDisplay}
          timezone={timezone}
        />
      </div>
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerBookingPageReworkedComponent);
