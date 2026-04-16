import { FC } from "react";

import { BookingStatusCode } from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n.js";

export const CancellationStatus: FC<{
  bookingStatusCode: BookingStatusCode;
  dateCancelled: string;
}> = ({ bookingStatusCode, dateCancelled }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n?.language;

  if (bookingStatusCode === BookingStatusCode.OK) return null;

  const getCancellationStatusText = (bookingStatusCode: BookingStatusCode) => {
    switch (bookingStatusCode) {
      case BookingStatusCode.CANCELLED_BY_CONSUMER:
        return t("bookingsTable.cancellationReason.consumer");
      case BookingStatusCode.CANCELLED_BY_MANAGER:
        return t("bookingsTable.cancellationReason.manager");
      case BookingStatusCode.CANCELLED_BY_SESSION:
        return t("bookingsTable.cancellationReason.studio");
      default:
        return "";
    }
  };

  const cancellationDate = formatDateTimeFromDate(
    fromIsoString(dateCancelled),
    DATETIME_FORMATS.FULL_DATETIME,
    { locale },
  );

  return (
    <div className="flex flex-col gap-2xs items-end">
      <Body size="lg">{getCancellationStatusText(bookingStatusCode)}</Body>
      <Body color="weak">
        {t("bookingsTable.cancellationDate", { cancellationDate })}
      </Body>
    </div>
  );
};
