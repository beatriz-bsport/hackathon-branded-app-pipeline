import { clsx } from "clsx";
import { FC } from "react";

import {
  DetailDrawer,
  Divider,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { Loader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useRetrieveRefinedBooking } from "#src/hooks/booking/fetch/use-retrieve-refined-booking";
import {
  type SessionManagementModalParams,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals";

import { BookingDetails } from "./booking-details";
import { ClientDetails } from "./client-details";

export const BookingDetailDrawer: FC<{
  selectedBookingId: number | null;
  onClose: () => void;
  openModal: (
    type: SessionManagementModalType,
    params?: SessionManagementModalParams,
  ) => void;
}> = ({ selectedBookingId, onClose, openModal }) => {
  const isMobile = !useMatchMedia("lg");
  return (
    <DetailDrawer
      id="booking-detail-drawer"
      // Default z-index of the drawer is 1000, we need to set it to 999 to be below the modals that have a z-index of 1000
      // There's no token for 420px max width, so we need to set it manually. The drawer has a min-width of 420px.
      className={clsx("z-[999]", { "max-w-[420px]": !isMobile })}
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
  openModal: (
    type: SessionManagementModalType,
    params?: SessionManagementModalParams,
  ) => void;
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
      <ClientDetails
        sessionId={refinedBooking.offer}
        memberData={refinedBooking.memberData}
        isNewClient={refinedBooking.first_in_company}
        bookingId={refinedBooking.id}
        openModal={openModal}
      />
    </div>
  );
};
