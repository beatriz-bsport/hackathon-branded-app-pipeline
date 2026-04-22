import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { setBookingAttendanceFilter } from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import {
  BookingAttendanceFilter,
  BookingStatusFilter,
} from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n.js";

export const AttendanceFilter: FC = () => {
  const { t } = useTranslation("sessionManagement");

  const attendance = useSessionManagementStore(
    (state) => state.bookingFilters.attendance,
  );

  const bookingStatus = useSessionManagementStore(
    (state) => state.bookingFilters.status,
  );

  if (bookingStatus === BookingStatusFilter.CANCELLED) return null;

  return (
    <div className="flex gap-sm">
      <Button
        color={
          attendance === BookingAttendanceFilter.PRESENT ? "selected" : "main"
        }
        size="sm"
        intent="default"
        label={t("bookingAttendanceFilter.present")}
        onClick={() =>
          setBookingAttendanceFilter(BookingAttendanceFilter.PRESENT)
        }
      />
      <Button
        color={
          attendance === BookingAttendanceFilter.ABSENT ? "selected" : "main"
        }
        size="sm"
        intent="default"
        label={t("bookingAttendanceFilter.absent")}
        onClick={() =>
          setBookingAttendanceFilter(BookingAttendanceFilter.ABSENT)
        }
      />
    </div>
  );
};
