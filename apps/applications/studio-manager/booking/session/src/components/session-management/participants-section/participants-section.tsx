import { FC } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";

import { BookingStatusSegmentedControl } from "#src/components/session-management/filters/booking-status-segmented-control";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingStatusFilter } from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n";

import { BookingsTable } from "./bookings-tables/bookings-table";
import { CancelledBookingsTable } from "./bookings-tables/cancelled-bookings-table";

export const ParticipantsSection: FC<{ sessionId: number }> = ({
  sessionId,
}) => {
  const { t } = useTranslation("sessionManagement");
  const { data: session } = useRetrieveSession(sessionId);

  const bookingsStatusFilters = useSessionManagementStore(
    (state) => state.bookingFilters.status,
  );

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex gap-sm">
        <Title weight="strong" htmlVariant="h3">
          {t("bookingsSectionTitle")}
        </Title>
        <Body size="lg" weight="weak" color="weaker">
          •
        </Body>
        <Body size="lg" weight="weak" color="weaker">
          {t("bookingsSectionSubtitle", {
            validatedBookingsCount: session.validated_booking_count,
            sessionCapacity: session.effectif,
          })}
        </Body>
      </div>
      <div className="flex flex-col gap-md">
        <BookingStatusSegmentedControl />
        {bookingsStatusFilters === BookingStatusFilter.BOOKED ? (
          <BookingsTable sessionId={session.id} />
        ) : (
          <CancelledBookingsTable sessionId={session.id} />
        )}
      </div>
    </div>
  );
};
