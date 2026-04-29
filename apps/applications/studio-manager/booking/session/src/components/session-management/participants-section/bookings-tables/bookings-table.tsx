import clsx from "clsx";
import { FC, useMemo } from "react";

import {
  Avatar,
  Body,
  GenericTableColumn,
  PaginationProps,
  Table,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { ShortcutActionsButton } from "#src/components/session-management/action-buttons/booking/shortcut-actions-button";
import { useSetAttendance } from "#src/hooks/booking/actions/use-set-attendance";
import { useFetchRefinedBookings } from "#src/hooks/booking/fetch/use-fetch-refined-bookings";
import { useSearchBookings } from "#src/hooks/booking/fetch/use-search-bookings";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import {
  setSelectedBooking,
  setSelectedBookingOption,
} from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingListedInformation } from "#src/stores/session-management/types";
import type { RefinedBooking } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";

import { ChipsCell } from "./chips-cell";

enum BookingColumns {
  PRESENT = "present",
  CLIENT = "client",
  MEMBER_DETAILS = "member-details",
  CHIPS = "chips",
  SHORTCUT_ACTIONS = "shortcut-actions",
}

export const BookingsTable: FC<{
  sessionId: number;
  searchQuery: string;
  openModal: (type: SessionManagementModalType, bookingId?: number) => void;
}> = ({ sessionId, searchQuery, openModal }) => {
  const { t } = useTranslation("sessionManagement");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: "bookings" });

  const { mutate: setAttendance, isPending: isSettingAttendance } =
    useSetAttendance();

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

  const selectedBookingId = useSessionManagementStore(
    (state) => state.selectedBookingId,
  );

  const listedInformation = useSessionManagementStore(
    (state) => state.listedInformation,
  );

  const columns: GenericTableColumn<RefinedBooking>[] = [
    {
      header: t("bookingsTable.headers.present"),
      id: BookingColumns.PRESENT,
      type: "custom",
      align: "start",
      render: (row) => (
        <Toggle
          checked={row.attendance}
          id={`attendance-toggle-${row.id}`}
          label=""
          disabled={isSettingAttendance}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={() =>
            setAttendance({
              bookingId: row.id,
              attendance: !row.attendance,
            })
          }
        />
      ),
    },
    {
      header: t("bookingsTable.headers.client"),
      id: BookingColumns.CLIENT,
      type: "custom",
      align: "start",
      render: (row) => {
        const spotName = listedInformation.includes(
          BookingListedInformation.SPOT,
        )
          ? row.spot_information?.name
          : null;

        const passName = listedInformation.includes(
          BookingListedInformation.PASS,
        )
          ? row.passData?.name
          : null;

        const secondaryText = [spotName, passName].filter(Boolean).join(" • ");

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
              <Body size="lg">{row.memberData?.name}</Body>
              {secondaryText && <Body color="weak">{secondaryText}</Body>}
            </div>
          </div>
        );
      },
    },
    {
      header: "",
      id: BookingColumns.CHIPS,
      type: "custom",
      align: "end",
      render: (row) => (
        <ChipsCell
          first_in_company={row.first_in_company}
          memberData={row.memberData}
          recurrence_rule_booking={row.recurrence_rule_booking}
        />
      ),
    },
    {
      header: "",
      id: BookingColumns.SHORTCUT_ACTIONS,
      type: "custom",
      align: "center",
      render: (row) => (
        <ShortcutActionsButton
          sessionId={sessionId}
          bookingId={row.id}
          memberId={row.memberData?.id}
          openModal={openModal}
          participantEmail={row.memberData?.email}
          participantPhone={row.memberData?.phone}
        />
      ),
    },
  ];

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
