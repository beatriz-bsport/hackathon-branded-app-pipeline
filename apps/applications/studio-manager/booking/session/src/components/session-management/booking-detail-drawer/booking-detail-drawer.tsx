import { FC } from "react";

import { DetailDrawer, Divider } from "@bsport/kaizen-primitive-core";

import { Loader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useRetrieveRefinedBooking } from "#src/hooks/booking/fetch/use-retrieve-refined-booking";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";

import { BookingDetails } from "./booking-details";
import { ClientDetails } from "./client-details";

export const BookingDetailDrawer: FC<{
  selectedBookingId: number | null;
  onClose: () => void;
  openModal: (type: SessionManagementModalType, bookingId: number) => void;
}> = ({ selectedBookingId, onClose, openModal }) => {
  return (
    <DetailDrawer
      id="booking-detail-drawer"
      // Default z-index of the drawer is 1000, we need to set it to 999 to be below the modals that have a z-index of 1000
      className="z-[999] max-w-component-modal-max-sm"
      isOpen={selectedBookingId != null}
      onClose={onClose}
    >
      {selectedBookingId != null && (
        <QueryBoundary>
          <BookingDetailDrawerContent
            bookingId={selectedBookingId}
            openModal={openModal}
          />
        </QueryBoundary>
      )}
    </DetailDrawer>
  );
};

const BookingDetailDrawerContent: FC<{
  bookingId: number;
  openModal: (type: SessionManagementModalType, bookingId: number) => void;
}> = ({ bookingId, openModal }) => {
  const { refinedBooking, isLoading } = useRetrieveRefinedBooking(bookingId);

  if (isLoading) {
    return <Loader />;
  }

  if (!refinedBooking) {
    return null;
  }

  return (
    <div className="flex flex-col gap-lg">
      <BookingDetails openModal={openModal} selectedBooking={refinedBooking} />
      <Divider orientation="horizontal" weight="extra-thin" />
      <ClientDetails openModal={openModal} selectedBooking={refinedBooking} />
    </div>
  );
};
