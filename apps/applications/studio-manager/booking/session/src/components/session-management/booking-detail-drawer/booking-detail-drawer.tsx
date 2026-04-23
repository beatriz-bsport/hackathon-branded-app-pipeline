import { FC } from "react";

import { DetailDrawer, Divider } from "@bsport/kaizen-primitive-core";

import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { RefinedBooking } from "#src/types.js";

import { BookingDetails } from "./booking-details";
import { ClientDetails } from "./client-details";

export const BookingDetailDrawer: FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: RefinedBooking | null;
  openModal: (type: SessionManagementModalType, bookingId: number) => void;
}> = ({ isOpen, onClose, selectedBooking, openModal }) => {
  if (!selectedBooking) {
    return null;
  }

  return (
    <DetailDrawer
      id="booking-detail-drawer"
      // Default z-index of the drawer is 1000, we need to set it to 999 to be below the modals that have a z-index of 1000
      className="z-[999] max-w-component-modal-max-sm"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-lg">
        <BookingDetails
          openModal={openModal}
          selectedBooking={selectedBooking}
        />
        <Divider orientation="horizontal" weight="extra-thin" />
        <ClientDetails
          openModal={openModal}
          selectedBooking={selectedBooking}
        />
      </div>
    </DetailDrawer>
  );
};
