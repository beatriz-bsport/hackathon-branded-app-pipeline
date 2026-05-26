import { clsx } from "clsx";
import { FC } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import {
  Body,
  Icon,
  Title,
  Tooltip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary.js";
import { AttendanceFilter } from "#src/components/session-management/filters/attendance-filter";
import { BookingStatusSegmentedControl } from "#src/components/session-management/filters/booking-status-segmented-control";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import type {
  SessionManagementModalParams,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingStatusFilter } from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n";

import { AttendanceValidationAlert } from "./attendance-validation-alert";
import { BookingsTable } from "./bookings-tables/bookings-table";
import { CancelledBookingsTable } from "./bookings-tables/cancelled-bookings-table";
import { NoShowBookingsTable } from "./bookings-tables/no-show-bookings-table";

export const ParticipantsSection: FC<{
  sessionId: number;
  searchQuery: string;
  openModal: (
    type: SessionManagementModalType,
    params?: SessionManagementModalParams,
  ) => void;
}> = ({ sessionId, searchQuery, openModal }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const isMobile = !useMatchMedia("lg");
  const { data: session } = useRetrieveSession(sessionId);
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const bookingsStatusFilters = useSessionManagementStore(
    (state) => state.bookingFilters.status,
  );

  const confirmationDateLabel = session.date_roll_call_last_modified
    ? formatDateTimeFromDate(
        fromIsoString(session.date_roll_call_last_modified!),
        DATETIME_FORMATS.FULL_DATETIME,
        { locale: i18n.language },
      )
    : "";

  return (
    <div className="flex flex-col gap-lg">
      <div
        className={clsx("flex gap-sm", {
          "flex-col": isMobile,
          "items-center": !isMobile,
        })}
      >
        <Title weight="strong" htmlVariant="h3">
          {t("bookingsSectionTitle")}
        </Title>
        {!isMobile && (
          <Body size="lg" weight="weak" color="weaker">
            •
          </Body>
        )}
        <Body size="lg" weight="weak" color="weaker">
          {t("bookingsSectionSubtitle", {
            validatedBookingsCount: session.validated_booking_count,
            sessionCapacity: session.effectif,
          })}
        </Body>
        {!!session.date_roll_call_last_modified && (
          <div className="flex items-center gap-sm">
            {isMobile ? (
              <Body size="lg" weight="weak" color="weaker">
                {t("attendanceAlert.confirmedLabelMobile", {
                  date: confirmationDateLabel,
                })}
              </Body>
            ) : (
              <>
                <Body size="lg" weight="weak" color="weaker">
                  •
                </Body>
                <Body size="lg" color="weaker">
                  {t("attendanceAlert.confirmedLabel")}
                </Body>
                <Tooltip
                  label={t("attendanceAlert.confirmedTooltip", {
                    date: confirmationDateLabel,
                  })}
                  placement="top"
                >
                  <Icon icon="info-circle" size="sm" />
                </Tooltip>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-md">
        {companyTheme?.is_roll_call_mandatory && (
          <AttendanceValidationAlert sessionId={sessionId} />
        )}
        <BookingStatusSegmentedControl />
        <AttendanceFilter />
        <QueryBoundary>
          {bookingsStatusFilters === BookingStatusFilter.BOOKED ? (
            <BookingsTable
              sessionId={session.id}
              openModal={openModal}
              searchQuery={searchQuery}
            />
          ) : bookingsStatusFilters === BookingStatusFilter.CANCELLED ? (
            <CancelledBookingsTable
              sessionId={session.id}
              searchQuery={searchQuery}
              openModal={openModal}
            />
          ) : (
            <NoShowBookingsTable
              sessionId={session.id}
              searchQuery={searchQuery}
            />
          )}
        </QueryBoundary>
      </div>
    </div>
  );
};
