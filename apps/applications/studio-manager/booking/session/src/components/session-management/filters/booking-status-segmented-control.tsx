import { FC } from "react";

import { SegmentedControl } from "@bsport/kaizen-primitive-core";

import { setBookingStatusFilter } from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingStatusFilter } from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n";

export const BookingStatusSegmentedControl: FC = () => {
  const { t } = useTranslation("sessionManagement");
  const bookingStatus = useSessionManagementStore(
    (state) => state.bookingFilters.status,
  );

  const onChangeBookingStatusFilter = (value: string) => {
    if (
      value === BookingStatusFilter.BOOKED ||
      value === BookingStatusFilter.CANCELLED ||
      value === BookingStatusFilter.NO_SHOW
    ) {
      setBookingStatusFilter(value);
    }
  };

  return (
    <SegmentedControl
      id="booking-status-filter"
      fullWidth
      options={[
        {
          label: t("bookingStatusFilter.booked"),
          value: BookingStatusFilter.BOOKED,
        },
        {
          label: t("bookingStatusFilter.cancelled"),
          value: BookingStatusFilter.CANCELLED,
        },
        {
          label: t("bookingStatusFilter.noShow"),
          value: BookingStatusFilter.NO_SHOW,
        },
      ]}
      value={bookingStatus}
      onChangeValue={onChangeBookingStatusFilter}
    />
  );
};
