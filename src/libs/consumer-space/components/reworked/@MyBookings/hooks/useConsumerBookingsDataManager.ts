import { useCallback, useMemo, useState } from 'react';
import moment from 'moment-timezone';

import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type { ConsumerBookingReworked } from '#libs/consumer-space/types';
import type { ConsumerBooking } from '#libs/booking/types';
import type {
  RoomBlueprint,
  SpotInformation,
} from '#libs/spot-scheduling/types';

import { BookingTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';
import { BookingFilterTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/constants';

/** Provides all of the necessary data and fetch handlers for consumer booking page */
export default function useConsumerBookingsDataManager({
  pastBookingsState,
  pastBookingsList,
  futureBookingsState,
  futureBookingsList,
  pastBookingsWorkshopState,
  pastBookingsWorkshopList,
  futureBookingsWorkshopState,
  futureBookingsWorkshopList,
  fetchPastBookings,
  fetchFutureBookings,
  fetchPastBookingsWorkshop,
  fetchFutureBookingsWorkshop,
}: {
  pastBookingsState: ConsumerBookingReworked;
  pastBookingsList: ConsumerBooking[];
  futureBookingsState: ConsumerBookingReworked;
  futureBookingsList: ConsumerBooking[];
  pastBookingsWorkshopState: ConsumerBookingReworked;
  pastBookingsWorkshopList: ConsumerBooking[];
  futureBookingsWorkshopState: ConsumerBookingReworked;
  futureBookingsWorkshopList: ConsumerBooking[];
  fetchPastBookings: () => void;
  fetchFutureBookings: () => void;
  fetchPastBookingsWorkshop: () => void;
  fetchFutureBookingsWorkshop: () => void;
}) {
  /* PAGE STATES */
  const [selectedTab, setSelectedTab] = useState<BookingTab>(
    BookingTabEnum.ACTIVITY,
  );
  const [selectedFilterTab, setSelectedFilterTab] = useState<BookingFilterTab>(
    BookingFilterTabEnum.FUTURE,
  );
  const [selectedBooking, setSelectedBooking] =
    useState<ConsumerBooking | null>(null);

  /* MODAL STATES */
  const [isCancelBookingModalOpen, setIsCancelBookingModalOpen] =
    useState<boolean>(false);

  const [selectedBookingForCancelation, setSelectedBookingForCancelation] =
    useState<ConsumerBooking | null>(null);

  const [isOnlineWarningModalOpen, setIsOnlineWarningModalOpen] =
    useState<boolean>(false);

  const [onlineWarningModalOfferDate, setOnlineWarningModalOfferDate] =
    useState<string | null>(null);

  const [isSpotSchedulingModalOpen, setIsSpotSchedulingModalOpen] =
    useState<boolean>(null);

  const [selectedBookingSpotDetails, setSelectedBookingSpotDetails] = useState<{
    spotInformation: SpotInformation;
    roomBlueprint: RoomBlueprint;
  } | null>(null);

  const fetchMoreDataHandlerMap = useMemo(
    () => ({
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.PAST}`]:
        fetchPastBookings,
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFutureBookings,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.PAST}`]:
        fetchPastBookingsWorkshop,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFutureBookingsWorkshop,
    }),
    [
      fetchFutureBookings,
      fetchFutureBookingsWorkshop,
      fetchPastBookings,
      fetchPastBookingsWorkshop,
    ],
  );

  const fetchTabDataHandlerMap = useMemo(
    () => ({
      [BookingTabEnum.ACTIVITY]: () => {
        fetchPastBookings();
        fetchFutureBookings();
      },
      [BookingTabEnum.WORKSHOP]: () => {
        fetchPastBookingsWorkshop();
        fetchFutureBookingsWorkshop();
      },
    }),
    [
      fetchFutureBookings,
      fetchFutureBookingsWorkshop,
      fetchPastBookings,
      fetchPastBookingsWorkshop,
    ],
  );

  const currentStateMap = {
    [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.PAST}`]:
      pastBookingsState,
    [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.FUTURE}`]:
      futureBookingsState,
    [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.PAST}`]:
      pastBookingsWorkshopState,
    [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.FUTURE}`]:
      futureBookingsWorkshopState,
  };

  const bookingsListMap = useMemo(
    () => ({
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.PAST}`]:
        pastBookingsList,
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.FUTURE}`]:
        futureBookingsList,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.PAST}`]:
        pastBookingsWorkshopList,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.FUTURE}`]:
        futureBookingsWorkshopList,
    }),
    [
      futureBookingsList,
      futureBookingsWorkshopList,
      pastBookingsList,
      pastBookingsWorkshopList,
    ],
  );

  const futureBookingsCountMap = {
    [BookingTabEnum.ACTIVITY]: futureBookingsState.count,
    [BookingTabEnum.WORKSHOP]: futureBookingsWorkshopState.count,
  };

  const currentState = currentStateMap[`${selectedTab}-${selectedFilterTab}`];
  const futureItemsCount = futureBookingsCountMap[selectedTab] || 0;
  const nextPage = currentState.next_page;
  const bookingList = useMemo(
    () => bookingsListMap[`${selectedTab}-${selectedFilterTab}`] || [],
    [bookingsListMap, selectedFilterTab, selectedTab],
  );

  /**
   * Function used to fetch data from pagination
   * @param type The selected booking tab
   */
  const handlePaginationFetchMore = useCallback(
    (type?: BookingTab) =>
      fetchMoreDataHandlerMap[
        `${type ?? selectedTab}-${selectedFilterTab}`
      ]?.(),
    [fetchMoreDataHandlerMap, selectedFilterTab, selectedTab],
  );

  /**
   * Function triggered when changing tab
   *  We fetch Future/Past so we can retrieve/display count
   */
  const handleFetchTabData = useCallback(
    (type?: BookingTab) => fetchTabDataHandlerMap[`${type ?? selectedTab}`]?.(),
    [fetchTabDataHandlerMap, selectedTab],
  );

  /**
   * Fetch associated objects when changing tab Activities/Appointments/Workshops
   * @param type The new tab that will be selected
   */
  const handleSetSelectedTab = useCallback(
    (type: BookingTab) => {
      setSelectedTab(type);
      handleFetchTabData?.(type);
      setSelectedBooking(null);
    },
    [handleFetchTabData],
  );

  /**
   * Update local state when clicking on a filter tab Future/Past
   * @param type The selected booking filter tab
   */
  const handleSetSelectedFilterTab = useCallback(
    (type: BookingFilterTab) => setSelectedFilterTab(type),
    [],
  );

  /**
   * Update local state when clicking on a booking details\
   * Finds the associated booking from an ID and set it as the selectedBooking
   * @param bookingId The ID of the selected booking
   */
  const handleSetSelectedBooking = useCallback(
    (bookingId: number) => {
      const booking = bookingList.find((item) => item.id === bookingId) || null;
      setSelectedBooking(booking);
    },
    [bookingList],
  );

  /**
   * Toggle display the cancellation modal dialog
   */
  const handleToggleCancelBookingModal = useCallback(
    () => setIsCancelBookingModalOpen((state) => !state),
    [],
  );

  /**
   * Display the cancel modal when cancel button on a booking is clicked\
   * Finds the associated booking from an ID and set is as the bookingForCancellation
   * and toggle display the cancellation modal
   */
  const handleSelectBookingForCancelation = useCallback(
    (bookingId: number) => {
      const booking = bookingList.find((item) => item.id === bookingId);
      if (booking) {
        setSelectedBookingForCancelation(booking);
        handleToggleCancelBookingModal();
      }
    },
    [bookingList, handleToggleCancelBookingModal],
  );

  /**
   * Toggle display the booking cancellation modal dialog
   */
  const handleToggleOnlineWarningModal = useCallback(() => {
    setIsOnlineWarningModalOpen((state) => !state);
  }, []);

  /**
   * Handles the 'Join online' button action when clicked from a booking card
   * @param bookingBroadcastURL The URL of the selected online booking
   * @param isMetaActivityBroadcast Whether the activity is online or not
   * @param offerDateStart The start date of the offer
   */
  const handleJoinOnlineBooking = useCallback(
    (
      bookingBroadcastURL: string,
      isMetaActivityBroadcast: boolean,
      offerDateStart: string,
      establishmentTimezone: string,
    ) => {
      const startDate = moment(offerDateStart)
        .tz(moment.tz.guess() || establishmentTimezone)
        .format();
      const startDateSubtractMinutes = moment(offerDateStart)
        .tz(moment.tz.guess() || establishmentTimezone)
        .subtract(15, 'minutes');

      const isOnlineUnavailable =
        !isMetaActivityBroadcast || moment().isBefore(startDateSubtractMinutes);

      if (isOnlineUnavailable) {
        setOnlineWarningModalOfferDate(startDate);
        return handleToggleOnlineWarningModal();
      }

      return window.open(bookingBroadcastURL, '_blank');
    },
    [handleToggleOnlineWarningModal],
  );

  /**
   * Toggle display the booking spot scheduling details modal dialog
   */
  const handleToggleSpotSchedulingModal = useCallback(() => {
    setIsSpotSchedulingModalOpen((state) => !state);
  }, []);

  const handleShowSpotDetails = useCallback(
    (spotInformation: SpotInformation, roomBlueprint: RoomBlueprint) => {
      if (spotInformation.name && roomBlueprint) {
        setSelectedBookingSpotDetails({ spotInformation, roomBlueprint });
        setIsSpotSchedulingModalOpen((state) => !state);
      }
    },
    [],
  );

  return {
    // LOCAL STATE
    selectedTab,
    selectedFilterTab,
    selectedBooking,
    selectedBookingForCancelation,
    isCancelBookingModalOpen,
    isOnlineWarningModalOpen,
    isSpotSchedulingModalOpen,
    onlineWarningModalOfferDate,
    selectedBookingSpotDetails,
    // STATE HANDLERS
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedBooking,
    handleSelectBookingForCancelation,
    handleToggleCancelBookingModal,
    handleToggleOnlineWarningModal,
    handleToggleSpotSchedulingModal,
    // DATA/USER ACTIONS HANDLERS
    handlePaginationFetchMore,
    handleJoinOnlineBooking,
    handleShowSpotDetails,
    // COMPUTED STATE
    futureItemsCount,
    nextPage,
    bookingList,
  };
}
