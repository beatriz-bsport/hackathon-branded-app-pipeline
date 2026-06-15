import type { FC } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { RecurringBookingRow } from "./build-recurring-booking-rows";
import { RecurringBookingsTable } from "./recurring-bookings-table";

export type RecurringBookingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rows: RecurringBookingRow[];
};

export const RecurringBookingsModal: FC<RecurringBookingsModalProps> = ({
  isOpen,
  onClose,
  rows,
}) => {
  const { t } = useTranslation("sessionManagement");

  return (
    <Modal
      open={isOpen}
      size="lg"
      onClose={onClose}
      title={t("sessionPanel.recurringBookings.modalTitle")}
      description={t("sessionPanel.recurringBookings.modalDescription")}
    >
      <RecurringBookingsTable rows={rows} />
    </Modal>
  );
};
