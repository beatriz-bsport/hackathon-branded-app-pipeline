import React from 'react';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import useConsumerBookingsDataManager from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingsDataManager';
import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerBookingHeader from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingHeader';
import ConsumerBookingTabs from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs';
import ConsumerBookingFilters from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters';
import ConsumerBookingListContainer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingListContainer';

import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { ConsumerBookingReworked } from '#libs/consumer-space/types';
import type { ConsumerBooking } from '#libs/booking/types';

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
  getIsBookingsLoading: (selectedTab: BookingTab) => boolean;
  handleBookASessionClick: () => void;
  fetchPastBookings: () => void;
  fetchFutureBookings: () => void;
  fetchPastBookingsWorkshop: () => void;
  fetchFutureBookingsWorkshop: () => void;
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
  getIsBookingsLoading,
  handleBookASessionClick,
  fetchPastBookings,
  fetchFutureBookings,
  fetchPastBookingsWorkshop,
  fetchFutureBookingsWorkshop,
}) => {
  const {
    selectedTab,
    selectedFilterTab,
    selectedBooking,
    futureItemsCount,
    nextPage,
    bookingList,
    isBookingsLoading,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedBooking,
    handlePaginationFetchMore,
    handleJoinOnlineBooking,
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
  });

  const emptyFn = () => {};

  return (
    <MarketplacePageContent>
      <div className="bs-consumer-booking-page__root">
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
          hasNextPage={!!nextPage}
          isLoading={isBookingsLoading}
          onBookingCardClick={handleSetSelectedBooking}
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
