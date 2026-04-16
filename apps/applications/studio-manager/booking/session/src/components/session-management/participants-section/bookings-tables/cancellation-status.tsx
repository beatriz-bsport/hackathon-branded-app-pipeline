import { FC } from "react";

import {
  BookingStaffActionIdentifier,
  BookingStaffHistory,
  BookingStatusCode,
} from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import { Body } from "@bsport/kaizen-primitive-core";

import { useFetchUserRole } from "#src/hooks/user-role/use-fetch-user-roles";
import { useTranslation } from "#src/utils/i18n";

const getLastCancellationStaffHistoryEntry = (
  staffHistory: BookingStaffHistory,
) => {
  if (!staffHistory) return null;

  return staffHistory
    .filter(
      (entry) =>
        entry.action_identifier ===
        BookingStaffActionIdentifier.BOOKING_CANCELLED_BY_STAFF,
    )
    .sort((a, b) => {
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      return -1;
    })[0];
};

export const CancellationStatus: FC<{
  bookingStatusCode: BookingStatusCode;
  dateCancelled: string;
  staffHistory: BookingStaffHistory;
}> = ({ bookingStatusCode, dateCancelled, staffHistory }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n?.language;

  const lastCancellationStaffHistoryEntry =
    getLastCancellationStaffHistoryEntry(staffHistory);

  const { data: userRole } = useFetchUserRole({
    select: (data) =>
      data.find((userRole) =>
        lastCancellationStaffHistoryEntry?.staff_id
          ? userRole.id === lastCancellationStaffHistoryEntry.staff_id
          : undefined,
      ),
  });

  if (bookingStatusCode === BookingStatusCode.OK) return null;

  const getCancellationStatusText = (bookingStatusCode: BookingStatusCode) => {
    switch (bookingStatusCode) {
      case BookingStatusCode.CANCELLED_BY_CONSUMER:
        return t("bookingsTable.cancellationReason.consumer");
      case BookingStatusCode.CANCELLED_BY_MANAGER:
        return userRole
          ? t("bookingsTable.cancellationReason.manager", {
              managerName: `${userRole.first_name} ${userRole.last_name}`,
            })
          : t("bookingsTable.cancellationReason.studio");
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
