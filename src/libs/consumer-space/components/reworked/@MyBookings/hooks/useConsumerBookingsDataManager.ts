import { useCallback, useMemo, useState } from 'react';
import moment from 'moment-timezone';

import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import type { BookingFilterTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingFilters/types';
import type {
  ConsumerBookingReworked,
  ConsumerPrivateBookingReworked,
} from '#libs/consumer-space/types';
import type {
  BookingREST,
  CancelBookingFilterParams,
  CancelPrivateBookingFilterParams,
  ConsumerBooking,
  ConsumerPrivateBooking,
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

import { BookingTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';

/** Provides all of the necessary data and fetch handlers for consumer booking page */
export default function useConsumerBookingsDataManager({
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
  cancelBooking,
  getRelatedConsumerBookingsInGroup,
  fetchAssociatedBlueprintObjects,
  cancelPrivateBooking,
}: {
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
  getIsBookingsLoading: (selectedTab: BookingTab) => boolean;
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
    params: CancelPrivateBookingFilterParams,
    options?: OptionCallback<PrivateBooking>,
  ) => void;
  getRelatedConsumerBookingsInGroup: (
    groupId: number,
    filterTab: BookingFilterTab,
  ) => ConsumerBooking[];
  fetchAssociatedBlueprintObjects: (blueprintid: number) => void;
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

  const [selectedPrivateBooking, setSelectedPrivateBooking] =
    useState<ConsumerPrivateBooking | null>(null);

  /* MODAL STATES */
  const [isCancelBookingModalOpen, setIsCancelBookingModalOpen] =
    useState<boolean>(false);

  const [selectedBookingForCancelation, setSelectedBookingForCancelation] =
    useState<ConsumerBooking | null>(null);

  const [
    selectedPrivateBookingForCancelation,
    setSelectedPrivateBookingForCancelation,
  ] = useState<ConsumerPrivateBooking | null>(null);

  const [isCancellingBooking, setIsCancellingBooking] =
    useState<boolean>(false);

  const [isOnlineWarningModalOpen, setIsOnlineWarningModalOpen] =
    useState<boolean>(false);

  const [onlineWarningModalOfferDate, setOnlineWarningModalOfferDate] =
    useState<string | null>(null);

  const [isSpotSchedulingModalOpen, setIsSpotSchedulingModalOpen] =
    useState<boolean>(null);

  const [selectedBookingSpotDetails, setSelectedBookingSpotDetails] = useState<{
    spotInformation: SpotInformation;
    roomBlueprint: RoomBlueprint;
    establishment: Establishment;
    metaActivity: MetaActivity;
  } | null>(null);

  const fetchMoreDataHandlerMap = useMemo(
    () => ({
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.PAST}`]:
        fetchPastBookings,
      [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFutureBookings,
      [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.PAST}`]:
        fetchPastPrivateBookings,
      [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFuturePrivateBookings,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.PAST}`]:
        fetchPastBookingsWorkshop,
      [`${BookingTabEnum.WORKSHOP}-${BookingFilterTabEnum.FUTURE}`]:
        fetchFutureBookingsWorkshop,
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
      },
      [BookingTabEnum.APPOINTMENT]: () => {
        fetchPastPrivateBookings();
        fetchFuturePrivateBookings();
      },
      [BookingTabEnum.WORKSHOP]: () => {
        fetchPastBookingsWorkshop();
        fetchFutureBookingsWorkshop();
      },
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

  const currentStateMap = {
    [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.PAST}`]:
      pastBookingsState,
    [`${BookingTabEnum.ACTIVITY}-${BookingFilterTabEnum.FUTURE}`]:
      futureBookingsState,
    [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.PAST}`]:
      pastPrivateBookingsState,
    [`${BookingTabEnum.APPOINTMENT}-${BookingFilterTabEnum.FUTURE}`]:
      futurePrivateBookingsState,
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

  const currentState = currentStateMap[`${selectedTab}-${selectedFilterTab}`];
  const futureItemsCount = futureBookingsCountMap[selectedTab] || 0;

  const nextPage = currentState.next_page;

  const bookingList: ConsumerBooking[] = useMemo(
    () =>
      bookingsListMap[
        `${
          selectedTab as Exclude<BookingTabEnum, BookingTabEnum.APPOINTMENT>
        }-${selectedFilterTab}`
      ] || [],
    [bookingsListMap, selectedFilterTab, selectedTab],
  );

  const privateBookingList: ConsumerPrivateBooking[] = useMemo(
    () =>
      privateBookingListMap[
        `${selectedTab as BookingTabEnum.APPOINTMENT}-${selectedFilterTab}`
      ] || [],
    [privateBookingListMap, selectedFilterTab, selectedTab],
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
   * Fetch associated objects when changing tab Activities/Appointments/Workshops
   * @param type The new tab that will be selected
   */
  const handleSetSelectedTab = useCallback(
    (type: BookingTab) => {
      resetConsumerState();
      handleFetchTabData?.(type);
      setSelectedTab(type);
      setSelectedBooking(null);
      setSelectedPrivateBooking(null);
    },
    [handleFetchTabData, resetConsumerState],
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
      if (booking) {
        setSelectedBookingForCancelation(booking);
        handleToggleCancelBookingModal();
      }
      if (privateBooking) {
        setSelectedPrivateBookingForCancelation(privateBooking);
        handleToggleCancelBookingModal();
      }
    },
    [bookingList, handleToggleCancelBookingModal, privateBookingList],
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
    }: {
      isRefundingCredit: boolean;
      bookingId?: number;
      privateBookingId?: number;
    }) => {
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
    },
    [
      cancelBooking,
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
        setIsSpotSchedulingModalOpen((state) => !state);
      }
    },
    [fetchAssociatedBlueprintObjects],
  );

  return {
    // LOCAL STATE
    selectedTab,
    selectedFilterTab,
    selectedBooking,
    selectedPrivateBooking,
    selectedBookingForCancelation,
    selectedPrivateBookingForCancelation,
    isCancelBookingModalOpen,
    isOnlineWarningModalOpen,
    isSpotSchedulingModalOpen,
    onlineWarningModalOfferDate,
    selectedBookingSpotDetails,
    isCancellingBooking,
    // STATE HANDLERS
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedBooking,
    handleSetSelectedPrivateBooking,
    handleSelectBookingForCancelation,
    handleToggleCancelBookingModal,
    handleToggleOnlineWarningModal,
    handleToggleSpotSchedulingModal,
    // DATA/USER ACTIONS HANDLERS
    handlePaginationFetchMore,
    handleJoinOnlineBooking,
    handleShowSpotDetails,
    handleCancelBooking,
    // COMPUTED STATE
    isBookingsLoading,
    futureItemsCount,
    nextPage,
    bookingList,
    privateBookingList,
    relatedBookingsInGroup,
  };
}
