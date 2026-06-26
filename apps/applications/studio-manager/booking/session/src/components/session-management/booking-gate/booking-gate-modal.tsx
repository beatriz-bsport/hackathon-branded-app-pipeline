import { FC } from "react";

import {
  DATETIME_FORMATS,
  formatDateTime,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString, modifyTime } from "@bsport/datetime-manipulation";
import { Alert, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { BookingGateType } from "./get-booking-gate-type";

type Props = {
  gateType: BookingGateType;
  session: {
    date_start: string;
    duration_minute: number;
    timezone_name: string;
  };
  onConfirm: () => void;
  onClose: () => void;
};

export const BookingGateModal: FC<Props> = ({
  gateType,
  session,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation("sessionManagement");

  const zone = session.timezone_name;
  const start = fromIsoString(session.date_start, { zone });
  const end = modifyTime({
    datetime: start,
    duration: { minute: session.duration_minute },
    operator: "plus",
  });

  const relativeStart = formatDateTime(
    session.date_start,
    DATETIME_FORMATS.RELATIVE,
  );
  const formattedEnd = formatDateTimeFromDate(
    end,
    DATETIME_FORMATS.FULL_DATETIME,
  );

  return (
    <Modal
      open
      size="md"
      title={t(`modals.bookingGate.${gateType}.title`)}
      onClose={onClose}
      confirmButton={{
        label: t("modals.bookingGate.confirmButton"),
        onClick: onConfirm,
      }}
      cancelButton={{
        label: t("modals.bookingGate.closeButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <p>
          {gateType === "overbook" && t("modals.bookingGate.overbook.body")}
          {gateType === "started" &&
            t("modals.bookingGate.started.body", { timeAgo: relativeStart })}
          {gateType === "ended" &&
            t("modals.bookingGate.ended.body", { endDate: formattedEnd })}
        </p>

        {(gateType === "started" || gateType === "ended") && (
          <Alert status="warning" type="weak" layout="banner">
            {t("modals.bookingGate.creditsWarning")}
          </Alert>
        )}
      </div>
    </Modal>
  );
};
