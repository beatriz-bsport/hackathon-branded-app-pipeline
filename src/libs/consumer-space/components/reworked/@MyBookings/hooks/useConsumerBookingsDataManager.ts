import { useCallback, useMemo, useState } from 'react';
import moment from 'moment-timezone';
import { useHistory } from 'react-router-dom';

import useViewport from '#Fabrique/hooks/useViewport';

import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type {
  ConsumerBookingOptionReworked,
  ConsumerBookingReworked,
  ConsumerPrivateBookingReworked,
} from '#libs/consumer-space/types';
import type {
  BookingREST,
  CancelBookingFilterParams,
  CancelPrivateBookingFilterParams,
  ConsumerBooking,
  ConsumerBookingOption,
  ConsumerPrivateBooking,
  ConsumerSpaceCancelBookingParams,
} from '#libs/booking/types';
import type { OptionCallback } from '../../../../../../state/types';
import type {
  RoomBlueprint,
  SpotInformation,
} from '#libs/spot-scheduling/types';
import { BookingFilterTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/constants';
import type { Establishment } from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { PrivateBooking } from '#libs/private-service/types';
import type {
  DiscardBookingOptionParams,
  WaitingListBookingOption,
} from '#libs/waiting-list/types';

import { BookingTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';
import { getOfferBookerUrl } from '#libs/marketplace/routing-utils';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#libs/consumer-space/constants';

/** Provides all of the necessary data and fetch handlers for consumer booking page */
export default function useConsumerBookingsDataManager({
  isNewCheckoutFlow,
  companyId,
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
  cancelBooking,
  getRelatedConsumerBookingsInGroup,
  fetchAssociatedBlueprintObjects,
  cancelPrivateBooking,
  cancelBookingOption,
}: {
  isNewCheckoutFlow: boolean;
  companyId: number;
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
  bookingOptionsWorkshopState: ConsumerBookingOptionReworked;
  bookingOptionsWorkshopList: ConsumerBookingOption[];
  futureBookingsWorkshopState: ConsumerBookingReworked;
  futureBookingsWorkshopList: ConsumerBooking[];
  getIsBookingsLoading: (selectedTab: BookingTab) => boolean;
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
    params: CancelPrivateBookingFilterParams,
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
  fetchAssociatedBlueprintObjects: (blueprintid: number) => void;
}) {
  const history = useHistory();
  const { width } = useViewport();

  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  /* PAGE STATES */
  const [selectedTab, setSelectedTab] = useState<BookingTab>(
    BookingTabEnum.ACTIVITY,
  );

  const [selectedFilterTab, setSelectedFilterTab] = useState<BookingFilterTab>(
    BookingFilterTabEnum.FUTURE,
  );

  const [selectedBooking, setSelectedBooking] =
    useState<ConsumerBooking | null>(null);

  const [selectedPrivateBooking, setSelectedPrivateBooking] =
    useState<ConsumerPrivateBooking | null>(null);

  const [selectedBookingOption, setSelectedBookingOption] =
    useState<ConsumerBookingOption | null>(null);

  /* MODAL/DRAWER STATES */
  const [isBookingTabDrawerOpen, setIsBookingTabDrawerOpen] = useState(false);

  const [isSpotSchedulingDrawerOpen, setIsSpotSchedulingDrawerOpen] =
    useState(false);

  const [isBookingDetailsDrawerOpen, setIsBookingDetailsDrawerOpen] =
    useState(false);

  const [isCalendarDrawerOpen, setIsCalendarDrawerOpen] = useState(false);

  const [isCancelBookingModalOpen, setIsCancelBookingModalOpen] =
    useState(false);

  const [selectedBookingForCancelation, setSelectedBookingForCancelation] =
    useState<ConsumerBooking | null>(null);

  const [
    selectedPrivateBookingForCancelation,
    setSelectedPrivateBookingForCancelation,
  ] = useState<ConsumerPrivateBooking | null>(null);

  const [
    selectedBookingOptionForCancelation,
    setSelectedBookingOptionForCancelation,
  ] = useState<ConsumerBookingOption | null>(null);

  const [isCancellingBooking, setIsCancellingBooking] = useState(false);

  const [isOnlineWarningModalOpen, setIsOnlineWarningModalOpen] =
    useState(false);

  const [onlineWarningModalOfferDate, setOnlineWarningModalOfferDate] =
    useState<string | null>(null);

  const [isSpotSchedulingModalOpen, setIsSpotSchedulingModalOpen] =
    useState(false);

  const [selectedBookingSpotDetails, setSelectedBookingSpotDetails] = useState<{
    spotInformation: SpotInformation;
    roomBlueprint: RoomBlueprint;
    establishment: Establishment;
    metaActivity: MetaActivity;
  } | null>(null);

  const [calendarBookingDate, setCalendarBookingDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );

  const fetchMoreDataHandlerMap = useMemo(
    () => ({
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.PAST}`]:
        fetchPastBookings,
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFutureBookings,
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.WAITLIST}`]: () => {},
      [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.PAST}`]:
        fetchPastPrivateBookings,
      [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFuturePrivateBookings,
      [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.WAITLIST}`]:
        () => {},
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.PAST}`]:
        fetchPastBookingsWorkshop,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFutureBookingsWorkshop,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.WAITLIST}`]: () => {},
    }),
    [
      fetchFutureBookings,
      fetchFutureBookingsWorkshop,
      fetchFuturePrivateBookings,
      fetchPastBookings,
      fetchPastBookingsWorkshop,
      fetchPastPrivateBookings,
    ],
  );

  const fetchTabDataHandlerMap = useMemo(
    () => ({
      [BookingTabEnum.ACTIVITY]: () => {
        fetchPastBookings();
        fetchFutureBookings();
        fetchBookingOptions();
      },
      [BookingTabEnum.APPOINTMENT]: () => {
        fetchPastPrivateBookings();
        fetchFuturePrivateBookings();
      },
      [BookingTabEnum.WORKSHOP]: () => {
        fetchPastBookingsWorkshop();
        fetchFutureBookingsWorkshop();
        fetchBookingOptionsWorkshop();
      },
    }),
    [
      fetchPastBookings,
      fetchFutureBookings,
      fetchBookingOptions,
      fetchPastPrivateBookings,
      fetchFuturePrivateBookings,
      fetchPastBookingsWorkshop,
      fetchFutureBookingsWorkshop,
      fetchBookingOptionsWorkshop,
    ],
  );

  const currentStateMap = {
    [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.PAST}`]:
      pastBookingsState,
    [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.FUTURE}`]:
      futureBookingsState,
    [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.WAITLIST}`]:
      bookingOptionsState,
    [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.PAST}`]:
      pastPrivateBookingsState,
    [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.FUTURE}`]:
      futurePrivateBookingsState,
    // MOCK TO AVOID TS ERROR
    [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.WAITLIST}`]: {
      next_page: 1,
    },
    [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.PAST}`]:
      pastBookingsWorkshopState,
    [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.FUTURE}`]:
      futureBookingsWorkshopState,
    [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.WAITLIST}`]:
      bookingOptionsWorkshopState,
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

  const bookingOptionsListMap = useMemo(
    () => ({
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.WAITLIST}`]:
        bookingOptionsList,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.WAITLIST}`]:
        bookingOptionsWorkshopList,
    }),
    [bookingOptionsList, bookingOptionsWorkshopList],
  );

  const privateBookingListMap = useMemo(
    () => ({
      [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.PAST}`]:
        pastPrivateBookingsList,
      [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.FUTURE}`]:
        futurePrivateBookingsList,
    }),
    [futurePrivateBookingsList, pastPrivateBookingsList],
  );

  const futureBookingsCountMap = {
    [BookingTabEnum.ACTIVITY]: futureBookingsState.count,
    [BookingTabEnum.APPOINTMENT]: futurePrivateBookingsState.count,
    [BookingTabEnum.WORKSHOP]: futureBookingsWorkshopState.count,
  };

  const waitlistBookingsCountMap = {
    [BookingTabEnum.ACTIVITY]: bookingOptionsState.count,
    [BookingTabEnum.WORKSHOP]: bookingOptionsWorkshopState.count,
  };

  const currentState = currentStateMap[`${selectedTab}-${selectedFilterTab}`];
  const futureItemsCount = futureBookingsCountMap[selectedTab] || 0;
  const waitlistItemsCount =
    waitlistBookingsCountMap[selectedTab as 'activity' | 'workshop'] || 0;

  const nextPage = currentState.next_page;

  const bookingList: ConsumerBooking[] = useMemo(
    () =>
      bookingsListMap[
        `${
          selectedTab as Exclude<BookingTabEnum, BookingTabEnum.APPOINTMENT>
        }-${selectedFilterTab as 'future' | 'past'}`
      ] || [],
    [bookingsListMap, selectedFilterTab, selectedTab],
  );

  const privateBookingList: ConsumerPrivateBooking[] = useMemo(
    () =>
      privateBookingListMap[
        `${selectedTab as BookingTabEnum.APPOINTMENT}-${
          selectedFilterTab as 'future' | 'past'
        }`
      ] || [],
    [privateBookingListMap, selectedFilterTab, selectedTab],
  );

  const bookingOptionList: ConsumerBookingOption[] = useMemo(
    () =>
      bookingOptionsListMap[
        `${
          selectedTab as Exclude<BookingTabEnum, BookingTabEnum.APPOINTMENT>
        }-${selectedFilterTab as 'waitlist'}`
      ] || [],
    [bookingOptionsListMap, selectedFilterTab, selectedTab],
  );

  const isBookingsLoading = useMemo(
    () => getIsBookingsLoading(selectedTab),
    [getIsBookingsLoading, selectedTab],
  );

  const relatedBookingsInGroup = useMemo(
    () =>
      getRelatedConsumerBookingsInGroup(
        selectedBookingForCancelation?.offer?.group,
        selectedFilterTab,
      ),
    [
      getRelatedConsumerBookingsInGroup,
      selectedBookingForCancelation?.offer?.group,
      selectedFilterTab,
    ],
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
   * Reset any previous selected booking for details card display\
   * Effective on Tab + Filter tab change
   */
  const handleResetSelectedItems = useCallback(() => {
    setSelectedBooking(null);
    setSelectedPrivateBooking(null);
    setSelectedBookingOption(null);
  }, []);

  /**
   * Reset the selected booking to force close any open modal/drawer
   */
  const handleResetSelectedItemsForCancellation = useCallback(() => {
    setSelectedBookingForCancelation(null);
    setSelectedPrivateBookingForCancelation(null);
    setSelectedBookingOptionForCancelation(null);
  }, []);

  /**
   * Fetch associated objects when changing tab Activities/Appointments/Workshops
   * @param type The new tab that will be selected
   */
  const handleSetSelectedTab = useCallback(
    (type: BookingTab) => {
      resetConsumerState();
      handleFetchTabData?.(type);
      // Fallback to avoid errors -- appointment waitlist dont exist
      if (
        selectedFilterTab === BookingFilterTabEnum.WAITLIST &&
        type === BookingTabEnum.APPOINTMENT
      ) {
        setSelectedFilterTab(BookingFilterTabEnum.FUTURE);
      }
      setSelectedTab(type);
      handleResetSelectedItems();
      handleResetSelectedItemsForCancellation();
    },
    [
      handleFetchTabData,
      handleResetSelectedItems,
      resetConsumerState,
      selectedFilterTab,
      handleResetSelectedItemsForCancellation,
    ],
  );

  /**
   * Update local state when clicking on a filter tab Future/Past/Waitlist
   * @param type The selected booking filter tab
   */
  const handleSetSelectedFilterTab = useCallback(
    (type: BookingFilterTab) => {
      setSelectedFilterTab(type);
      handleResetSelectedItems();
      handleResetSelectedItemsForCancellation();
    },
    [handleResetSelectedItems, handleResetSelectedItemsForCancellation],
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
   * Update local state when clicking on a private booking details\
   * Finds the associated private booking from an ID and set it as the selectedPrivateBooking
   * @param privateBookingId The ID of the selected private booking
   */
  const handleSetSelectedPrivateBooking = useCallback(
    (privateBookingId: number) => {
      const privateBooking =
        privateBookingList.find((item) => item.id === privateBookingId) || null;
      setSelectedPrivateBooking(privateBooking);
    },
    [privateBookingList],
  );

  /**
   * Update local state when clicking on a booking option\
   * Finds the associated booking option from an ID and set it as the selectedBookingOption
   * @param bookingOptionId The ID of the selected booking option
   */
  const handleSetSelectedBookingOption = useCallback(
    (bookingOptionId: number) => {
      const bookingOption =
        bookingOptionList.find((item) => item.id === bookingOptionId) || null;
      setSelectedBookingOption(bookingOption);
    },
    [bookingOptionList],
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
      const privateBooking = privateBookingList.find(
        (item) => item.id === bookingId,
      );
      const bookingOption = bookingOptionList.find(
        (item) => item.id === bookingId,
      );

      if (booking) {
        setSelectedBookingForCancelation(booking);
        handleToggleCancelBookingModal();
      }
      if (privateBooking) {
        setSelectedPrivateBookingForCancelation(privateBooking);
        handleToggleCancelBookingModal();
      }
      if (bookingOption) {
        setSelectedBookingOptionForCancelation(bookingOption);
        handleToggleCancelBookingModal();
      }
    },
    [
      bookingList,
      privateBookingList,
      bookingOptionList,
      handleToggleCancelBookingModal,
    ],
  );

  /**
   * Handles the cancel button action for a booking
   * Tries to cancel a booking from an ID and refetch the tab data on success
   */
  const handleCancelBooking = useCallback(
    ({
      isRefundingCredit,
      bookingId,
      privateBookingId,
      bookingOptionId,
    }: ConsumerSpaceCancelBookingParams) => {
      setIsCancellingBooking(true);
      const optionCallback = {
        onSuccess: () => {
          handleSetSelectedTab(selectedTab);
          setIsCancellingBooking(false);
          handleToggleCancelBookingModal();
        },
        onError: () => {
          setIsCancellingBooking(false);
          handleToggleCancelBookingModal();
        },
      };

      if (bookingId) {
        cancelBooking(
          bookingId,
          { force_refund: isRefundingCredit },
          optionCallback,
        );
      }
      if (privateBookingId) {
        cancelPrivateBooking(
          privateBookingId,
          { force_refund: isRefundingCredit },
          optionCallback,
        );
      }
      if (bookingOptionId) {
        cancelBookingOption(bookingOptionId, null, optionCallback);
      }
    },
    [
      cancelBooking,
      cancelBookingOption,
      cancelPrivateBooking,
      handleSetSelectedTab,
      handleToggleCancelBookingModal,
      selectedTab,
    ],
  );

  /**
   * Toggle display the booking cancellation modal dialog
   */
  const handleToggleOnlineWarningModal = useCallback(() => {
    setIsOnlineWarningModalOpen((state) => !state);
  }, []);

  /**
   * Toggle display the booking details drawer
   */
  const handleToggleBookingDetailsDrawer = useCallback(() => {
    setIsBookingDetailsDrawerOpen((state) => !state);
  }, []);

  /**
   * Toggle display the spot scheduling bottom drawer
   */
  const handleToggleSpotSchedulingDrawer = useCallback(() => {
    setIsSpotSchedulingDrawerOpen((state) => !state);
  }, []);

  /**
   * Toggle display the calendar bottom drawer
   */
  const handleToggleCalendarDrawer = useCallback(() => {
    setIsCalendarDrawerOpen((state) => !state);
  }, []);

  /**
   * Toggle display the booking tab bottom drawer
   */
  const handleToggleBookingTabDrawer = useCallback(() => {
    setIsBookingTabDrawerOpen((state) => !state);
  }, []);

  /**
   * Handles the 'See details' action from booking and display drawer if is mobile
   * @param selectedDate The new date selected from the calendar
   */
  const handleSeeBookingDetails = useCallback(
    (
      bookingId: number,
      type: 'booking' | 'privateBooking' | 'bookingOption',
    ) => {
      switch (type) {
        case 'booking':
          setSelectedBooking(
            bookingList.find((item) => item.id === bookingId) || null,
          );
          break;
        case 'privateBooking':
          setSelectedPrivateBooking(
            privateBookingList.find((item) => item.id === bookingId) || null,
          );
          break;
        case 'bookingOption':
          setSelectedBookingOption(
            bookingOptionList.find((item) => item.id === bookingId) || null,
          );
          break;
        default:
      }
      isMobile && handleToggleBookingDetailsDrawer();
    },
    [
      isMobile,
      bookingList,
      privateBookingList,
      bookingOptionList,
      handleToggleBookingDetailsDrawer,
    ],
  );

  /**
   * Handles the calendar select action for modal/drawer
   * @param selectedDate The new date selected from the calendar
   */
  const handleSelectCalendarBookingDate = useCallback(
    (selectedDate: string) => {
      setCalendarBookingDate(selectedDate);
      setIsCalendarDrawerOpen(false);
    },
    [],
  );

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
   * Handles the 'Book' button action when clicked from a booking card
   * @param bookingBroadcastURL The URL of the selected online booking
   * @param isMetaActivityBroadcast Whether the activity is online or not
   * @param offerDateStart The start date of the offer
   */
  const handleBookSession = useCallback(
    (offerId: number) => {
      const offerBookerUrl = getOfferBookerUrl(
        companyId,
        offerId,
        isNewCheckoutFlow,
      );
      history.push(offerBookerUrl);
    },
    [companyId, history, isNewCheckoutFlow],
  );

  /**
   * Toggle display the booking spot scheduling details modal dialog
   */
  const handleToggleSpotSchedulingModal = useCallback(() => {
    setIsSpotSchedulingModalOpen((state) => !state);
  }, []);

  const handleShowSpotDetails = useCallback(
    (booking: ConsumerBooking) => {
      if (
        (booking.spot_information as SpotInformation).name &&
        booking.room_blueprint
      ) {
        fetchAssociatedBlueprintObjects(booking.room_blueprint.id);
        setSelectedBooking(booking);
        setSelectedBookingSpotDetails({
          spotInformation: booking.spot_information as SpotInformation,
          roomBlueprint: booking.room_blueprint,
          establishment: booking.establishment,
          metaActivity: booking.meta_activity,
        });

        isMobile
          ? handleToggleSpotSchedulingDrawer()
          : handleToggleSpotSchedulingModal();
      }
    },
    [
      fetchAssociatedBlueprintObjects,
      handleToggleSpotSchedulingDrawer,
      handleToggleSpotSchedulingModal,
      isMobile,
    ],
  );

  return {
    // LOCAL STATE
    selectedTab,
    selectedFilterTab,
    selectedBooking,
    selectedPrivateBooking,
    selectedBookingOption,
    selectedBookingForCancelation,
    selectedPrivateBookingForCancelation,
    selectedBookingOptionForCancelation,
    isCancelBookingModalOpen,
    isOnlineWarningModalOpen,
    isSpotSchedulingModalOpen,
    onlineWarningModalOfferDate,
    selectedBookingSpotDetails,
    isCancellingBooking,
    isCalendarDrawerOpen,
    calendarBookingDate,
    isBookingTabDrawerOpen,
    isSpotSchedulingDrawerOpen,
    isBookingDetailsDrawerOpen,
    // STATE HANDLERS
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedBooking,
    handleSetSelectedPrivateBooking,
    handleSetSelectedBookingOption,
    handleSelectBookingForCancelation,
    handleToggleCancelBookingModal,
    handleToggleOnlineWarningModal,
    handleToggleSpotSchedulingModal,
    handleResetSelectedItemsForCancellation,
    handleToggleCalendarDrawer,
    handleSelectCalendarBookingDate,
    handleToggleBookingTabDrawer,
    handleToggleSpotSchedulingDrawer,
    handleToggleBookingDetailsDrawer,
    // DATA/USER ACTIONS HANDLERS
    handleSeeBookingDetails,
    handlePaginationFetchMore,
    handleJoinOnlineBooking,
    handleShowSpotDetails,
    handleCancelBooking,
    handleBookSession,
    // COMPUTED STATE
    isBookingsLoading,
    futureItemsCount,
    waitlistItemsCount,
    nextPage,
    bookingList,
    privateBookingList,
    bookingOptionList,
    relatedBookingsInGroup,
    isMobile,
  };
}
