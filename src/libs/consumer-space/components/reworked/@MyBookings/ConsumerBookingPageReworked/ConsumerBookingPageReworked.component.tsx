import React from 'react';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import useConsumerBookingsDataManager from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingsDataManager';
import MarketplacePageContent from '#src/components/css-only/MarketplacePageContent';
import ConsumerBookingHeader from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingHeader';
import ConsumerBookingTabs from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs';
import ConsumerBookingFilters from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters';
import ConsumerBookingListContainer from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingListContainer';
import ConsumerBookingModals from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingModals';

import type { BookingTab } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type {
  ConsumerBookingReworked,
  ConsumerPrivateBookingReworked,
  ConsumerBookingOptionReworked,
} from '#src/libs/consumer-space/types';
import type {
  ConsumerBooking,
  BookingREST,
  CancelBookingParams,
  ConsumerPrivateBooking,
  ConsumerBookingOption,
  CancelPrivateBookingParams,
} from '#src/libs/booking/types';
import type { BookingFilterTab } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { SpotType } from '#src/libs/spot-scheduling/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { PrivateBooking } from '#src/libs/private-service/types';
import type {
  DiscardBookingOptionParams,
  WaitingListBookingOption,
} from '#src/libs/waiting-list/types';

import { BookingTabEnum } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';
import type { OptionCallback } from '../../../../../../state/types';

import './styles.css';

type Props = {
  pastBookingsState: ConsumerBookingReworked;
  pastBookingsList: ConsumerBooking[];
  futureBookingsState: ConsumerBookingReworked;
  futureBookingsList: ConsumerBooking[];
  bookingOptionsState: ConsumerBookingOptionReworked;
  bookingOptionsList: ConsumerBookingOption[];
  pastPrivateBookingsState: ConsumerPrivateBookingReworked;
  pastPrivateBookingsList: ConsumerPrivateBooking[];
  futurePrivateBookingsState: ConsumerPrivateBookingReworked;
  futurePrivateBookingsList: ConsumerPrivateBooking[];
  pastBookingsWorkshopState: ConsumerBookingReworked;
  pastBookingsWorkshopList: ConsumerBooking[];
  futureBookingsWorkshopState: ConsumerBookingReworked;
  futureBookingsWorkshopList: ConsumerBooking[];
  bookingOptionsWorkshopState: ConsumerBookingOptionReworked;
  bookingOptionsWorkshopList: ConsumerBookingOption[];
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  spotTypes: SpotType[];
  companyTheme: CompanyTheme;
  isConsumerPacksLoading: boolean;
  getIsBookingsLoading: (selectedTab: BookingTab) => boolean;
  handleBookASessionClick: () => void;
  fetchPastBookings: () => void;
  fetchFutureBookings: () => void;
  fetchBookingOptions: () => void;
  fetchBookingOptionsWorkshop: () => void;
  fetchPastPrivateBookings: () => void;
  fetchFuturePrivateBookings: () => void;
  fetchPastBookingsWorkshop: () => void;
  fetchFutureBookingsWorkshop: () => void;
  resetConsumerState: () => void;
  cancelBooking: (
    params: CancelBookingParams,
    options?: OptionCallback<BookingREST>,
  ) => void;
  cancelPrivateBooking: (
    params: CancelPrivateBookingParams,
    options?: OptionCallback<PrivateBooking>,
  ) => void;
  cancelBookingOption: (
    params: DiscardBookingOptionParams,
    options?: OptionCallback<WaitingListBookingOption>,
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
  bookingOptionsState,
  bookingOptionsList,
  pastPrivateBookingsState,
  pastPrivateBookingsList,
  futurePrivateBookingsState,
  futurePrivateBookingsList,
  pastBookingsWorkshopState,
  pastBookingsWorkshopList,
  futureBookingsWorkshopState,
  futureBookingsWorkshopList,
  bookingOptionsWorkshopState,
  bookingOptionsWorkshopList,
  timezone,
  sessionTimeDisplay,
  spotTypes,
  companyTheme,
  getIsBookingsLoading,
  handleBookASessionClick,
  isConsumerPacksLoading,
  fetchPastBookings,
  fetchFutureBookings,
  fetchBookingOptions,
  fetchBookingOptionsWorkshop,
  fetchPastPrivateBookings,
  fetchFuturePrivateBookings,
  fetchPastBookingsWorkshop,
  fetchFutureBookingsWorkshop,
  resetConsumerState,
  cancelBooking,
  getRelatedConsumerBookingsInGroup,
  fetchAssociatedBlueprintObjects,
  cancelPrivateBooking,
  cancelBookingOption,
}) => {
  const {
    selectedTab,
    selectedFilterTab,
    selectedBooking,
    selectedPrivateBooking,
    selectedBookingOption,
    selectedBookingForCancelation,
    selectedPrivateBookingForCancelation,
    isCancelBookingModalOpen,
    isCancellingBooking,
    isOnlineWarningModalOpen,
    isSpotSchedulingModalOpen,
    onlineWarningModalOfferDate,
    selectedBookingSpotDetails,
    futureItemsCount,
    waitlistItemsCount,
    nextPage,
    bookingList,
    isBookingsPageLoading,
    privateBookingList,
    bookingOptionList,
    relatedBookingsInGroup,
    selectedBookingOptionForCancelation,
    isCalendarDrawerOpen,
    calendarBookingDate,
    isBookingTabDrawerOpen,
    isSpotSchedulingDrawerOpen,
    isBookingDetailsDrawerOpen,
    isMobile,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSelectBookingForCancelation,
    handleToggleCancelBookingModal,
    handlePaginationFetchMore,
    handleJoinOnlineBooking,
    handleCancelBooking,
    handleToggleOnlineWarningModal,
    handleShowSpotDetails,
    handleToggleSpotSchedulingModal,
    handleBookSession,
    handleToggleBookingDetailsDrawer,
    handleResetSelectedItemsForCancellation,
    handleToggleCalendarDrawer,
    handleSelectCalendarBookingDate,
    handleToggleBookingTabDrawer,
    handleToggleSpotSchedulingDrawer,
    handleSeeBookingDetails,
  } = useConsumerBookingsDataManager({
    pastBookingsState,
    pastBookingsList,
    futureBookingsState,
    futureBookingsList,
    bookingOptionsState,
    bookingOptionsList,
    pastPrivateBookingsState,
    pastPrivateBookingsList,
    futurePrivateBookingsState,
    futurePrivateBookingsList,
    pastBookingsWorkshopState,
    pastBookingsWorkshopList,
    futureBookingsWorkshopState,
    futureBookingsWorkshopList,
    bookingOptionsWorkshopState,
    bookingOptionsWorkshopList,
    companyId: companyTheme.company,
    isNewCheckoutFlow: companyTheme.display_new_checkout_flow,
    getIsBookingsLoading,
    fetchPastBookings,
    fetchFutureBookings,
    fetchBookingOptions,
    fetchBookingOptionsWorkshop,
    fetchPastPrivateBookings,
    fetchFuturePrivateBookings,
    fetchPastBookingsWorkshop,
    fetchFutureBookingsWorkshop,
    resetConsumerState,
    getRelatedConsumerBookingsInGroup,
    cancelBooking,
    fetchAssociatedBlueprintObjects,
    cancelPrivateBooking,
    cancelBookingOption,
    isConsumerPacksLoading,
  });

  return (
    <MarketplacePageContent>
      <div className="bs-consumer-booking-page__root">
        <ConsumerBookingModals
          calendarBookingDate={calendarBookingDate}
          companyTheme={companyTheme}
          handleCancelBooking={handleCancelBooking}
          handleResetSelectedItemsForCancellation={
            handleResetSelectedItemsForCancellation
          }
          handleSelectCalendarBookingDate={handleSelectCalendarBookingDate}
          handleSetSelectedTab={handleSetSelectedTab}
          handleToggleBookingDetailsDrawer={handleToggleBookingDetailsDrawer}
          handleToggleBookingTabDrawer={handleToggleBookingTabDrawer}
          handleToggleCalendarDrawer={handleToggleCalendarDrawer}
          handleToggleCancelBookingModal={handleToggleCancelBookingModal}
          handleToggleOnlineWarningModal={handleToggleOnlineWarningModal}
          handleToggleSpotSchedulingDrawer={handleToggleSpotSchedulingDrawer}
          handleToggleSpotSchedulingModal={handleToggleSpotSchedulingModal}
          isBookingDetailsDrawerOpen={isBookingDetailsDrawerOpen}
          isBookingTabDrawerOpen={isBookingTabDrawerOpen}
          isCalendarDrawerOpen={isCalendarDrawerOpen}
          isCancelBookingModalOpen={isCancelBookingModalOpen}
          isCancellingBooking={isCancellingBooking}
          isMobile={isMobile}
          isOnlineWarningModalOpen={isOnlineWarningModalOpen}
          isSpotSchedulingDrawerOpen={isSpotSchedulingDrawerOpen}
          isSpotSchedulingModalOpen={isSpotSchedulingModalOpen}
          onlineWarningModalOfferDate={onlineWarningModalOfferDate}
          relatedBookingsInGroup={relatedBookingsInGroup}
          selectedBooking={selectedBooking}
          selectedBookingForCancelation={selectedBookingForCancelation}
          selectedBookingOption={selectedBookingOption}
          selectedBookingOptionForCancelation={
            selectedBookingOptionForCancelation
          }
          selectedBookingSpotDetails={selectedBookingSpotDetails}
          selectedBookingTab={selectedTab}
          selectedPrivateBooking={selectedPrivateBooking}
          selectedPrivateBookingForCancelation={
            selectedPrivateBookingForCancelation
          }
          sessionTimeDisplay={sessionTimeDisplay}
          spotTypes={spotTypes}
          timezone={timezone}
        />

        <ConsumerBookingHeader
          isMobile={isMobile}
          onBookSessionClick={handleBookASessionClick}
        />

        <ConsumerBookingTabs
          handleToggleTabDrawer={handleToggleBookingTabDrawer}
          isMobile={isMobile}
          onChangeBookingTab={handleSetSelectedTab}
          selectedTab={selectedTab}
        />

        <ConsumerBookingFilters
          futureBookingsCount={futureItemsCount}
          isMobile={isMobile}
          isWaitlistFilterHidden={selectedTab === BookingTabEnum.APPOINTMENT}
          onChangeFilterTab={handleSetSelectedFilterTab}
          selectedTab={selectedFilterTab}
          waitlistBookingsCount={waitlistItemsCount}
        />

        <ConsumerBookingListContainer
          bookingList={bookingList}
          bookingOptionList={bookingOptionList}
          coachDisplay={companyTheme?.coach_display}
          handleBookSession={handleBookSession}
          handleJoinOnlineBooking={handleJoinOnlineBooking}
          handlePaginationFetchMore={handlePaginationFetchMore}
          handleSeeBookingDetails={handleSeeBookingDetails}
          handleSelectBookingForCancelation={handleSelectBookingForCancelation}
          handleShowSpotDetails={handleShowSpotDetails}
          hasNextPage={!!nextPage}
          isLoading={isBookingsPageLoading}
          isMobile={isMobile}
          privateBookingList={privateBookingList}
          relatedBookingsInGroup={relatedBookingsInGroup}
          selectedBooking={selectedBooking}
          selectedBookingOption={selectedBookingOption}
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
