import { FC, useState } from "react";

import { Body, Modal, Toggle } from "@bsport/kaizen-primitive-core";

import { useDiscardBookingOption } from "#src/hooks/waitlist/use-discard-booking-option.js";
import { useTranslation } from "#src/utils/i18n.js";

export const DiscardBookingOptionModal: FC<{
  bookingOptionId: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({ bookingOptionId, isOpen, onClose }) => {
  const { t } = useTranslation("sessionManagement");

  const { mutate: discardBookingOption, isPending } = useDiscardBookingOption();

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const [shouldSendNotification, setShouldSendNotification] = useState(true);

  const handleDiscardBookingOption = () => {
    discardBookingOption(
      {
        bookingOptionId,
        params: { disable_notification: !shouldSendNotification },
      },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("modals.removeFromWaitlist.title")}
      onClose={handleClose}
      confirmButton={{
        label: t("modals.removeFromWaitlist.confirmButton"),
        onClick: handleDiscardBookingOption,
        color: "critical",
        disabled: isPending,
      }}
      cancelButton={{
        label: t("modals.removeFromWaitlist.closeButton"),
        onClick: onClose,
        disabled: isPending,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p">{t("modals.removeFromWaitlist.body")}</Body>
        <Toggle
          id="discard-booking-option-notification-toggle"
          onToggleChange={(checked) => setShouldSendNotification(checked)}
          checked={shouldSendNotification}
          label={t("modals.removeFromWaitlist.sendNotification")}
        />
      </div>
    </Modal>
  );
};
