import clsx from "clsx";
import { FC, useMemo } from "react";

import { BookingStatusCode } from "@bsport/api-book";
import {
  Avatar,
  Body,
  GenericTableColumn,
  PaginationProps,
  Table,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { ShortcutActionsButton } from "#src/components/session-management/action-buttons/booking/shortcut-actions-button";
import { BookingActionItemId } from "#src/components/session-management/action-buttons/booking/types";
import { useFetchRefinedBookings } from "#src/hooks/booking/fetch/use-fetch-refined-bookings";
import { useSearchBookings } from "#src/hooks/booking/fetch/use-search-bookings";
import {
  setSelectedBooking,
  setSelectedBookingOption,
} from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import type { RefinedBooking } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";

import { CancellationStatus } from "./cancellation-status";

enum BookingColumns {
  CLIENT = "client",
  CANCELLATION_DETAILS = "cancellation-details",
  ACTIONS = "actions",
}

export const CancelledBookingsTable: FC<{
  sessionId: number;
  searchQuery: string;
}> = ({ sessionId, searchQuery }) => {
  const { t } = useTranslation("sessionManagement");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: "cancelled-bookings" });

  const {
    isLoading,
    results: refinedBookings,
    count,
  } = useFetchRefinedBookings({
    in_offer: sessionId,
    page: currentPage,
    page_size: currentPageSize,
  });

  const searchedBookings = useSearchBookings(refinedBookings, searchQuery);

  const hasSearchQuery = searchQuery.trim().length > 0;

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: !hasSearchQuery,
      disabled: isLoading,
      totalItems: hasSearchQuery ? searchedBookings.length : (count ?? 0),
      onPageSettingsChange: setPageSettings,
    }),
    [
      currentPage,
      currentPageSize,
      isLoading,
      count,
      setPageSettings,
      hasSearchQuery,
      searchedBookings.length,
    ],
  );

  const selectedBookingId = useSessionManagementStore(
    (state) => state.selectedBookingId,
  );

  const columns: GenericTableColumn<RefinedBooking>[] = [
    {
      header: t("bookingsTable.headers.client"),
      id: BookingColumns.CLIENT,
      type: "custom",
      align: "start",
      render: (row) => {
        const secondaryText = row.was_refunded
          ? t("bookingsTable.refundedPass", {
              passName: row.passData?.name ?? "",
            })
          : (row.passData?.name ?? "");

        return (
          <div className="flex gap-md items-center">
            <Avatar
              shape="round"
              src={row.memberData?.photo}
              initials={getMemberInitials({
                firstname: row.memberData?.first_name,
                lastname: row.memberData?.last_name,
              })}
            />
            <div className="flex flex-col gap-2xs">
              <Body size="lg" className="line-through">
                {row.memberData?.name}
              </Body>
              {secondaryText && <Body color="weak">{secondaryText}</Body>}
            </div>
          </div>
        );
      },
    },
    {
      header: "",
      id: BookingColumns.CANCELLATION_DETAILS,
      type: "custom",
      align: "end",
      render: (row) => {
        if (
          row.booking_status_code === BookingStatusCode.OK ||
          !row.date_canceled
        )
          return null;
        return (
          <CancellationStatus
            bookingStatusCode={row.booking_status_code}
            dateCancelled={row.date_canceled}
            staffHistory={row.staff_history}
          />
        );
      },
    },
    {
      header: "",
      id: BookingColumns.ACTIONS,
      type: "custom",
      align: "center",
      render: (row) => (
        <ShortcutActionsButton
          sessionId={row.offer}
          bookingId={row.id}
          memberId={row.memberData?.id}
          participantEmail={row.memberData?.email}
          participantPhone={row.memberData?.phone}
          allowedItemIds={[
            BookingActionItemId.SEND_MESSAGE,
            BookingActionItemId.COPY_EMAIL,
            BookingActionItemId.COPY_PHONE,
            BookingActionItemId.UPDATE_MEMBER_NOTES,
          ]}
        />
      ),
    },
  ];

  return (
    <div
      className={clsx({
        "border-stroke-regular border-stroke-weak rounded-md overflow-hidden":
          !isLoading,
      })}
    >
      <Table
        columns={columns}
        rowHeight="lg"
        rows={searchedBookings.map((booking) => ({
          ...booking,
          isActive: booking.id === selectedBookingId,
          onRowClick: () => {
            setSelectedBookingOption(null);
            setSelectedBooking(booking.id);
          },
        }))}
        paginationProps={paginationProps}
        emptyStateProps={{
          isEmpty: !searchedBookings.length,
          emptyConfig: {
            title: t("bookingsTable.emptyState.title"),
            ctaButtonConfig: {
              label: t("bookButton"),
            },
          },
        }}
        loadingProps={{
          isLoading,
          className:
            "min-h-[360px] border-stroke-regular border-stroke-weak rounded-md overflow-hidden",
          message: t("bookingsTable.loadingMessage"),
        }}
      />
    </div>
  );
};
