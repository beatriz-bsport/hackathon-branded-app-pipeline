import { FC } from "react";

import { SegmentedControl } from "@bsport/kaizen-primitive-core";

import { setWaitlistFilter } from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { WaitlistFilter } from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n";

export const BookingOptionStatusSegmentedControl: FC = () => {
  const { t } = useTranslation("sessionManagement");
  const bookingOptionStatus = useSessionManagementStore(
    (state) => state.waitlistFilters,
  );

  const onChangeBookingOptionStatusFilter = (value: string) => {
    if (
      value === WaitlistFilter.ON_WAITLIST ||
      value === WaitlistFilter.CANCELLED ||
      value === WaitlistFilter.IS_CONVERTIBLE
    ) {
      setWaitlistFilter(value);
    }
  };

  return (
    <SegmentedControl
      id="booking-status-filter"
      options={[
        {
          label: t("bookingOptionStatusFilter.onWaitlist"),
          value: WaitlistFilter.ON_WAITLIST,
        },
        {
          label: t("bookingOptionStatusFilter.convertible"),
          value: WaitlistFilter.IS_CONVERTIBLE,
        },
        {
          label: t("bookingOptionStatusFilter.removed"),
          value: WaitlistFilter.CANCELLED,
        },
      ]}
      value={bookingOptionStatus}
      onChangeValue={onChangeBookingOptionStatusFilter}
    />
  );
};
