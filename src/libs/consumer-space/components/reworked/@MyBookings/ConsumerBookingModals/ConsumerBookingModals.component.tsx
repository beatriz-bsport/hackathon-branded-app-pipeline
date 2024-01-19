import React from 'react';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import { PortalContainer } from '#Fabrique/PortalContainer';
import ConsumerBookingCancelModal from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCancelModal';
import ConsumerBookingOnlineWarningModal from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingOnlineWarningModal';
import ConsumerBookingSpotSchedulingModal from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingSpotSchedulingModal';
import ConsumerBookingDetailsDrawer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsDrawer';
import ConsumerBookingCancelDrawer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCancelDrawer';
import ConsumerBookingOnlineWarningDrawer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingOnlineWarningDrawer';
import ConsumerBookingCalendarDrawer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCalendarDrawer';
import ConsumerBookingTabDrawer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabDrawer';
import ConsumerBookingSpotSchedulingDrawer from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingSpotSchedulingDrawer';

import type {
  ConsumerBooking,
  ConsumerPrivateBooking,
  ConsumerBookingOption,
} from '#libs/booking/types';
import type { CompanyTheme } from '#libs/theme/types';
import type {
  RoomBlueprint,
  SpotInformation,
  SpotType,
} from '#libs/spot-scheduling/types';
import type { Establishment } from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';

type Props = {
  isMobile: boolean;
  companyTheme: CompanyTheme;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  /* CANCEL MODAL */
  isCancelBookingModalOpen: boolean;
  selectedBookingForCancelation: ConsumerBooking;
  selectedPrivateBookingForCancelation: ConsumerPrivateBooking;
  selectedBookingOptionForCancelation: ConsumerBookingOption;
  isCancellingBooking: boolean;
  relatedBookingsInGroup: ConsumerBooking[];
  handleCancelBooking: (params: {
    isRefundingCredit: boolean;
    bookingId?: number;
    privateBookingId?: number;
    bookingOptionId?: number;
  }) => void;
  handleToggleCancelBookingModal: () => void;
  handleResetSelectedItemsForCancellation: () => void;
  /* DETAILS DRAWER */
  isBookingDetailsDrawerOpen: boolean;
  handleToggleBookingDetailsDrawer: () => void;
  /* ONLINE WARNING MODAL */
  isOnlineWarningModalOpen: boolean;
  onlineWarningModalOfferDate: string;
  handleToggleOnlineWarningModal: () => void;
  /* SPOT SCHEDULING MODAL */
  isSpotSchedulingModalOpen: boolean;
  selectedBooking: ConsumerBooking;
  selectedPrivateBooking: ConsumerPrivateBooking;
  selectedBookingOption: ConsumerBookingOption;
  selectedBookingSpotDetails: {
    spotInformation: SpotInformation;
    roomBlueprint: RoomBlueprint;
    establishment: Establishment;
    metaActivity: MetaActivity;
  };
  spotTypes: SpotType[];
  handleToggleSpotSchedulingModal: () => void;
  /* SPOT SCHEDULING DRAWER */
  isSpotSchedulingDrawerOpen: boolean;
  handleToggleSpotSchedulingDrawer: () => void;
  /* CALENDAR DRAWER */
  isCalendarDrawerOpen: boolean;
  calendarBookingDate: string;
  handleToggleCalendarDrawer: () => void;
  handleSelectCalendarBookingDate: (selectedDate: string) => void;
  /* TABS DRAWER */
  isBookingTabDrawerOpen: boolean;
  selectedBookingTab: BookingTab;
  handleSetSelectedTab: (type: BookingTab) => void;
  handleToggleBookingTabDrawer: () => void;
};

const ConsumerBookingModals: React.FC<Props> = ({
  isMobile,
  companyTheme,
  timezone,
  sessionTimeDisplay,
  /* CANCEL MODAL */
  isCancelBookingModalOpen,
  selectedBookingForCancelation,
  selectedPrivateBookingForCancelation,
  selectedBookingOptionForCancelation,
  isCancellingBooking,
  relatedBookingsInGroup,
  handleCancelBooking,
  handleToggleCancelBookingModal,
  handleResetSelectedItemsForCancellation,
  /* DETAILS DRAWER */
  isBookingDetailsDrawerOpen,
  handleToggleBookingDetailsDrawer,
  /* ONLINE WARNING MODAL */
  isOnlineWarningModalOpen,
  onlineWarningModalOfferDate,
  handleToggleOnlineWarningModal,
  /* SPOT SCHEDULING MODAL */
  isSpotSchedulingModalOpen,
  selectedBooking,
  selectedPrivateBooking,
  selectedBookingOption,
  selectedBookingSpotDetails,
  spotTypes,
  handleToggleSpotSchedulingModal,
  /* SPOT SCHEDULING DRAWER */
  isSpotSchedulingDrawerOpen,
  handleToggleSpotSchedulingDrawer,
  /* CALENDAR DRAWER */
  isCalendarDrawerOpen,
  calendarBookingDate,
  handleToggleCalendarDrawer,
  handleSelectCalendarBookingDate,
  /* TABS DRAWER */
  isBookingTabDrawerOpen,
  selectedBookingTab,
  handleSetSelectedTab,
  handleToggleBookingTabDrawer,
}) => {
  return (
    <PortalContainer wrapperId="bs-consumer-booking-modals-portal-container">
      {isCancelBookingModalOpen &&
        !isMobile &&
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

      {isOnlineWarningModalOpen &&
        !!onlineWarningModalOfferDate &&
        !isMobile && (
          <ConsumerBookingOnlineWarningModal
            offerDateStart={onlineWarningModalOfferDate}
            onClose={handleToggleOnlineWarningModal}
          />
        )}

      {!isMobile &&
        isSpotSchedulingModalOpen &&
        !!selectedBookingSpotDetails && (
          <ConsumerBookingSpotSchedulingModal
            bookingOffer={selectedBooking?.offer}
            bookingSpotDetails={selectedBookingSpotDetails}
            companyTheme={companyTheme}
            onClose={handleToggleSpotSchedulingModal}
            spotTypes={spotTypes}
          />
        )}

      <ConsumerBookingSpotSchedulingDrawer
        bookingOffer={selectedBooking?.offer}
        bookingSpotDetails={selectedBookingSpotDetails}
        companyTheme={companyTheme}
        handleClose={handleToggleSpotSchedulingDrawer}
        isOpen={
          isMobile && isSpotSchedulingDrawerOpen && !!selectedBookingSpotDetails
        }
        spotTypes={spotTypes}
      />

      <ConsumerBookingTabDrawer
        handleClose={handleToggleBookingTabDrawer}
        handleSetSelectedTab={handleSetSelectedTab}
        isOpen={isMobile && isBookingTabDrawerOpen}
        selectedBookingTab={selectedBookingTab}
      />

      <ConsumerBookingOnlineWarningDrawer
        handleClose={handleToggleOnlineWarningModal}
        isOpen={
          isMobile && isOnlineWarningModalOpen && !!onlineWarningModalOfferDate
        }
        offerDateStart={onlineWarningModalOfferDate}
      />

      <ConsumerBookingCalendarDrawer
        handleClose={handleToggleCalendarDrawer}
        isOpen={isMobile && isCalendarDrawerOpen}
        onDatePickerClick={handleSelectCalendarBookingDate}
        selectedDate={calendarBookingDate}
        selectedTab={selectedBookingTab}
      />

      <ConsumerBookingDetailsDrawer
        handleClose={handleToggleBookingDetailsDrawer}
        isOpen={
          isMobile &&
          isBookingDetailsDrawerOpen &&
          !!(selectedBooking || selectedPrivateBooking || selectedBookingOption)
        }
        selectedBooking={selectedBooking}
        selectedBookingOption={selectedBookingOption}
        selectedPrivateBooking={selectedPrivateBooking}
        sessionTimeDisplay={sessionTimeDisplay}
        timezone={timezone}
      />

      <ConsumerBookingCancelDrawer
        booking={selectedBookingForCancelation}
        bookingOption={selectedBookingOptionForCancelation}
        cancelBooking={handleCancelBooking}
        handleClose={handleResetSelectedItemsForCancellation}
        isOpen={
          isMobile &&
          !!(
            selectedBookingForCancelation ||
            selectedPrivateBookingForCancelation ||
            selectedBookingOptionForCancelation
          )
        }
        privateBooking={selectedPrivateBookingForCancelation}
        relatedBookings={relatedBookingsInGroup}
        sessionTimeDisplay={sessionTimeDisplay}
        timezone={timezone}
      />
    </PortalContainer>
  );
};

export default React.memo(ConsumerBookingModals);
