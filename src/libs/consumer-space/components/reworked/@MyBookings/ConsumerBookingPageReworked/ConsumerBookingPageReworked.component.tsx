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
  ConsumerBookingOptionReworked,
} from '#libs/consumer-space/types';
import type {
  ConsumerBooking,
  BookingREST,
  CancelBookingFilterParams,
  ConsumerPrivateBooking,
  ConsumerBookingOption,
} from '#libs/booking/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { OptionCallback } from '../../../../../../state/types';
import type { SpotType } from '#libs/spot-scheduling/types';
import type { CompanyTheme } from '#libs/theme/types';
import type { PrivateBooking } from '#libs/private-service/types';
import type {
  DiscardBookingOptionParams,
  WaitingListBookingOption,
} from '#libs/waiting-list/types';

import { BookingTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';

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
    bookingId: number,
    params: CancelBookingFilterParams,
    options?: OptionCallback<BookingREST>,
  ) => void;
  cancelPrivateBooking: (
    bookingId: number,
    params: CancelBookingFilterParams,
    options?: OptionCallback<PrivateBooking>,
  ) => void;
  cancelBookingOption: (
    id: number,
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
    isBookingsLoading,
    privateBookingList,
    bookingOptionList,
    relatedBookingsInGroup,
    selectedBookingOptionForCancelation,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedBooking,
    handleSetSelectedPrivateBooking,
    handleSetSelectedBookingOption,
    handleSelectBookingForCancelation,
    handleToggleCancelBookingModal,
    handlePaginationFetchMore,
    handleJoinOnlineBooking,
    handleCancelBooking,
    handleToggleOnlineWarningModal,
    handleShowSpotDetails,
    handleToggleSpotSchedulingModal,
    handleBookSession,
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
  });

  const emptyFn = () => {};

  return (
    <MarketplacePageContent>
      <div className="bs-consumer-booking-page__root">
        {isCancelBookingModalOpen &&
          !!(
            selectedBookingForCancelation ||
            selectedPrivateBookingForCancelation ||
            selectedBookingOptionForCancelation
          ) && (
            <ConsumerBookingCancelModal
              booking={selectedBookingForCancelation}
              bookingOption={selectedBookingOptionForCancelation}
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
          isWaitlistFilterHidden={selectedTab === BookingTabEnum.APPOINTMENT}
          onChangeFilterTab={handleSetSelectedFilterTab}
          onDatePickerClick={emptyFn}
          selectedTab={selectedFilterTab}
          waitlistBookingsCount={waitlistItemsCount}
        />

        <ConsumerBookingListContainer
          bookingList={bookingList}
          bookingOptionList={bookingOptionList}
          handleBookSession={handleBookSession}
          handleJoinOnlineBooking={handleJoinOnlineBooking}
          handlePaginationFetchMore={handlePaginationFetchMore}
          handleSelectBookingForCancelation={handleSelectBookingForCancelation}
          handleSetSelectedBooking={handleSetSelectedBooking}
          handleSetSelectedBookingOption={handleSetSelectedBookingOption}
          handleSetSelectedPrivateBooking={handleSetSelectedPrivateBooking}
          handleShowSpotDetails={handleShowSpotDetails}
          hasNextPage={!!nextPage}
          isLoading={isBookingsLoading}
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
