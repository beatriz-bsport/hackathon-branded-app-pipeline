import React from 'react';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization.js';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import useConsumerBookingsDataManager from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingsDataManager';
import ConsumerBookingListContainer from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingListContainer';
import ConsumerBookingModals from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingModals';
import PageContentContainer from '#src/libs/consumer-space/components/reworked/@Layout/PageContentContainer';
import ConsumerPageHeader from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

import type {
  BookingTab,
  BookingFilterTab,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/types';
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
import type { SpotType } from '#src/libs/spot-scheduling/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { PrivateBooking } from '#src/libs/private-service/types';
import type {
  DiscardBookingOptionParams,
  WaitingListBookingOption,
  WaitingListConfiguration,
} from '#src/libs/waiting-list/types';

import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import {
  BOOKING_FOR_GUEST_FREQUENCY,
  OfferStatusWaitingListPosition,
} from '#src/libs/offer/types';
import type { AddGuestFormValues } from '#src/libs/marketplace/components/@Booking/MarketplaceBookingAddGuestModal';
import {
  BookingFilterTabEnum,
  BookingTabEnum,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/constants';

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
  fetchPastBookings: (page?: number) => void;
  fetchFutureBookings: (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => void;
  fetchSoonestBooking: (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => void;
  fetchBookingOptions: () => void;
  fetchBookingOptionsWorkshop: () => void;
  fetchPastPrivateBookings: () => void;
  fetchFuturePrivateBookings: (
    page?: number,
    options?: OptionCallback<PaginatedResponse<PrivateBooking>>,
  ) => void;
  fetchSoonestPrivateBooking: (
    page?: number,
    options?: OptionCallback<PaginatedResponse<PrivateBooking>>,
  ) => void;
  fetchPastBookingsWorkshop: () => void;
  fetchFutureBookingsWorkshop: (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => void;
  fetchSoonestWorkshopBooking: (
    page?: number,
    options?: OptionCallback<PaginatedResponse<BookingREST>>,
  ) => void;
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
  getOfferElligibleGuestNumber: (offerId: number) => number;
  bookingGuestFrequency: BOOKING_FOR_GUEST_FREQUENCY;
  onBookingForAGuestSubmit: ({
    guestFormValues,
    offerBookedId,
  }: {
    guestFormValues: AddGuestFormValues;
    offerBookedId: number;
  }) => void;
  getOfferWaitingListPosition: (
    offerId: number,
  ) => OfferStatusWaitingListPosition;
  waitingListConfiguration: WaitingListConfiguration;
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
  getOfferElligibleGuestNumber,
  bookingGuestFrequency,
  onBookingForAGuestSubmit,
  getOfferWaitingListPosition,
  waitingListConfiguration,
  fetchSoonestBooking,
  fetchSoonestPrivateBooking,
  fetchSoonestWorkshopBooking,
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
    handleChangePage,
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
    isBookingForAGuestModalOpen,
    selectedBookingForBookingForAGuest,
    setSelectedBookingForBookingForAGuest,
    currentCount,
    currentPage,
    isFirstLoading,
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
    fetchSoonestBooking,
    fetchSoonestPrivateBooking,
    fetchSoonestWorkshopBooking,
  });

  const { t } = useTranslation('consumerSpace');

  const handleSetFutureFilterTab = React.useCallback(
    () => handleSetSelectedFilterTab?.(BookingFilterTabEnum.FUTURE),
    [handleSetSelectedFilterTab],
  );

  const handleSetPastBookingClick = React.useCallback(
    () => handleSetSelectedFilterTab?.(BookingFilterTabEnum.PAST),
    [handleSetSelectedFilterTab],
  );

  const handleSetWaitlistBookingClick = React.useCallback(
    () => handleSetSelectedFilterTab?.(BookingFilterTabEnum.WAITLIST),
    [handleSetSelectedFilterTab],
  );

  const filters = [
    {
      hasBadge: futureItemsCount > 0,
      type: BookingFilterTabEnum.FUTURE,
      label: t('consumerSpace:reworked.myBookings.filter.upcoming'),
      onClick: handleSetFutureFilterTab,
      value: futureItemsCount,
    },
    {
      hasBadge: false,
      type: BookingFilterTabEnum.PAST,
      label: t('consumerSpace:reworked.myBookings.filter.past'),
      onClick: handleSetPastBookingClick,
    },
    ...(selectedTab !== BookingTabEnum.APPOINTMENT
      ? [
          {
            hasBadge: waitlistItemsCount > 0,
            type: BookingFilterTabEnum.WAITLIST,
            label: t('consumerSpace:reworked.myBookings.filter.onWaitlist'),
            onClick: handleSetWaitlistBookingClick,
            value: waitlistItemsCount,
          },
        ]
      : []),
  ];
  const handleSetActivityBookingTab = React.useCallback(
    () => handleSetSelectedTab?.(BookingTabEnum.ACTIVITY),
    [handleSetSelectedTab],
  );

  const handleSetAppointmentBookingTab = React.useCallback(
    () => handleSetSelectedTab(BookingTabEnum.APPOINTMENT),
    [handleSetSelectedTab],
  );

  const handleSetWorkshopBookingTab = React.useCallback(
    () => handleSetSelectedTab?.(BookingTabEnum.WORKSHOP),
    [handleSetSelectedTab],
  );

  const consumerBookingTabs = React.useMemo(
    () => [
      {
        hidden: false,
        type: BookingTabEnum.ACTIVITY,
        label: t('reworked.myBookings.tab.activities'),
        onClick: handleSetActivityBookingTab,
      },
      {
        hidden: false,
        type: BookingTabEnum.APPOINTMENT,
        label: t('reworked.myBookings.tab.appointments'),
        onClick: handleSetAppointmentBookingTab,
      },
      {
        hidden: false,
        type: BookingTabEnum.WORKSHOP,
        label: t('reworked.myBookings.tab.workshops'),
        onClick: handleSetWorkshopBookingTab,
      },
    ],
    [
      handleSetActivityBookingTab,
      handleSetAppointmentBookingTab,
      handleSetWorkshopBookingTab,
      t,
    ],
  );
  return (
    <PageContentContainer
      contentClassName={clsx('bs-consumer-booking-page__root', {
        'bs-consumer-booking-page__root--fab':
          WidgetUtils.getConsumerSpaceContext() ===
          ConsumerSpaceContextEnum.FAB,
      })}
    >
      <ConsumerBookingModals
        bookingGuestFrequency={bookingGuestFrequency}
        calendarBookingDate={calendarBookingDate}
        companyTheme={companyTheme}
        getOfferElligibleGuestNumber={getOfferElligibleGuestNumber}
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
        isBookingForAGuestModalOpen={isBookingForAGuestModalOpen}
        isBookingTabDrawerOpen={isBookingTabDrawerOpen}
        isCalendarDrawerOpen={isCalendarDrawerOpen}
        isCancelBookingModalOpen={isCancelBookingModalOpen}
        isCancellingBooking={isCancellingBooking}
        isMobile={isMobile}
        isOnlineWarningModalOpen={isOnlineWarningModalOpen}
        isSpotSchedulingDrawerOpen={isSpotSchedulingDrawerOpen}
        isSpotSchedulingModalOpen={isSpotSchedulingModalOpen}
        onBookingForAGuestSubmit={onBookingForAGuestSubmit}
        onlineWarningModalOfferDate={onlineWarningModalOfferDate}
        relatedBookingsInGroup={relatedBookingsInGroup}
        selectedBooking={selectedBooking}
        selectedBookingForBookingForAGuest={selectedBookingForBookingForAGuest}
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
        setSelectedBookingForBookingForAGuest={
          setSelectedBookingForBookingForAGuest
        }
        spotTypes={spotTypes}
        timezone={timezone}
      />
      <ConsumerPageHeader
        FilterProps={{ filters, selectedFilter: selectedFilterTab }}
        isFirstLoading={isFirstLoading}
        isMobile={isMobile}
        TabsProps={{
          selectedTab,
          tabs: consumerBookingTabs,
          handleToggleTabDrawer: handleToggleBookingTabDrawer,
        }}
        TitleProps={{
          title: t('reworked.myBookings.title'),
        }}
      />

      <ConsumerBookingListContainer
        bookingList={bookingList}
        bookingOptionList={bookingOptionList}
        coachDisplay={companyTheme?.coach_display}
        currentCount={currentCount}
        currentPage={currentPage}
        getOfferElligibleGuestNumber={getOfferElligibleGuestNumber}
        getOfferWaitingListPosition={getOfferWaitingListPosition}
        handleBookSession={handleBookSession}
        handleChangePage={handleChangePage}
        handleJoinOnlineBooking={handleJoinOnlineBooking}
        handleSeeBookingDetails={handleSeeBookingDetails}
        handleSelectBookingForCancelation={handleSelectBookingForCancelation}
        handleShowSpotDetails={handleShowSpotDetails}
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
        setSelectedBookingForBookingForAGuest={
          setSelectedBookingForBookingForAGuest
        }
        timezone={timezone}
        waitingListConfiguration={waitingListConfiguration}
      />
    </PageContentContainer>
  );
};

export default React.memo(ConsumerBookingPageReworkedComponent);
