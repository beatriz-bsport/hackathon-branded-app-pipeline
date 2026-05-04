import { FC, useState } from "react";

import { Body, Modal, Toggle } from "@bsport/kaizen-primitive-core";

import { useCancelBooking } from "#src/hooks/booking/actions/use-cancel-booking";
import { useTranslation } from "#src/utils/i18n";

export const CancelBookingModal: FC<{
  bookingId: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({ bookingId, isOpen, onClose }) => {
  const { t } = useTranslation("sessionManagement");

  const [shouldRefund, setShouldRefund] = useState(true);

  const [shouldNotify, setShouldNotify] = useState(true);

  const cancelBooking = useCancelBooking();

  const handleConfirm = () => {
    cancelBooking.mutate(
      {
        bookingId,
        params: { force_refund: shouldRefund, force_notify: shouldNotify },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("modals.cancelBooking.title")}
      onClose={onClose}
      confirmButton={{
        label: t("modals.cancelBooking.confirmButton"),
        onClick: handleConfirm,
        color: "critical",
        disabled: cancelBooking.isPending,
      }}
      cancelButton={{
        label: t("modals.cancelBooking.closeButton"),
        onClick: onClose,
        disabled: cancelBooking.isPending,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p">{t("modals.cancelBooking.body")}</Body>
        <Toggle
          checked={shouldRefund}
          id="should-refund-booking"
          label={t("modals.cancelBooking.refundCredits")}
          onToggleChange={(checked) => setShouldRefund(checked)}
        />
        <Toggle
          checked={shouldNotify}
          id="should-send-notification"
          label={t("modals.cancelBooking.sendNotification")}
          onToggleChange={(checked) => setShouldNotify(checked)}
        />
      </div>
    </Modal>
  );
};
