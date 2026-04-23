import { FC, useState } from "react";

import { Body, Modal, Toggle } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useCancelAppointment } from "#src/hooks/appointment/actions/use-cancel-appointment";
import type { EnrichedAppointment } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { getAppointmentModalDescription } from "./get-appointment-modal-description";

type CancelAppointmentModalProps = {
  appointment: EnrichedAppointment;
  isOpen: boolean;
  onClose: () => void;
};

export const CancelAppointmentModal: FC<CancelAppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const [shouldRefund, setShouldRefund] = useState(true);
  const [shouldNotify, setShouldNotify] = useState(true);

  const cancelAppointment = useCancelAppointment();

  const handleConfirm = () => {
    cancelAppointment.mutate(
      {
        id: appointment.id,
        params: {
          force_refund: shouldRefund,
          send_mail: shouldNotify,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const description = getAppointmentModalDescription(appointment, {
    locale: i18n.language,
    timeZone: companyTimezone,
  });

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("cancelAppointmentModal.title")}
      description={description}
      onClose={onClose}
      confirmButton={{
        label: t("cancelAppointmentModal.confirmButton"),
        color: "critical",
        onClick: handleConfirm,
        disabled: cancelAppointment.isPending,
      }}
      cancelButton={{
        label: t("cancelAppointmentModal.cancelButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("cancelAppointmentModal.description")}
        </Body>
        <Toggle
          id="cancel-appointment-refund-toggle"
          label={t("cancelAppointmentModal.refundCredits")}
          checked={shouldRefund}
          onChange={() => setShouldRefund((prev) => !prev)}
        />
        <Toggle
          id="cancel-appointment-notify-toggle"
          label={t("cancelAppointmentModal.sendNotification")}
          checked={shouldNotify}
          onChange={() => setShouldNotify((prev) => !prev)}
        />
      </div>
    </Modal>
  );
};
