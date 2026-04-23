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

import { useSetAttendance } from "#src/hooks/booking/actions/use-set-attendance";
import { useFetchRefinedBookings } from "#src/hooks/booking/fetch/use-fetch-refined-bookings";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals.js";
import type { RefinedBooking } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";

import { ShortcutActionsButton } from "../../action-buttons/booking/shortcut-actions-button";
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
  openModal: (type: SessionManagementModalType, bookingId?: number) => void;
}> = ({ sessionId, openModal }) => {
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
        const secondaryText = [row.spot_information?.name, row.passData?.name]
          .filter(Boolean)
          .join(" • ");

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

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      disabled: isLoading,
      totalItems: count ?? 0,
      onPageSettingsChange: setPageSettings,
    }),
    [currentPage, currentPageSize, isLoading, count, setPageSettings],
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
        rows={refinedBookings}
        paginationProps={paginationProps}
        emptyStateProps={{
          isEmpty: !count,
          emptyConfig: {
            title: t("bookingsTable.emptyState.title"),
            ctaButtonConfig: {
              label: t("bookButton"),
            },
          },
        }}
        loadingProps={{
          isLoading,
          message: t("bookingsTable.loadingMessage"),
        }}
      />
    </div>
  );
};
