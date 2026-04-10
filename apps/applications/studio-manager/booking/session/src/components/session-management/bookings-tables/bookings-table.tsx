import clsx from "clsx";
import { FC, useMemo } from "react";

import {
  GenericTableColumn,
  PaginationProps,
  Table,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import {
  RefinedBooking,
  useFetchRefinedBookings,
} from "#src/hooks/booking/fetch/use-fetch-refined-bookings.js";
import { useTranslation } from "#src/utils/i18n.js";

enum BookingColumns {
  PRESENT = "present",
  CLIENT = "client",
  CHIPS = "chips",
  SHORTCUT_ACTIONS = "shortcut-actions",
}

export const BookingsTable: FC<{ sessionId: number }> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

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
        <Toggle checked={row.attendance} id="attendance-toggle" label="" />
      ),
    },
    {
      header: t("bookingsTable.headers.client"),
      id: BookingColumns.CLIENT,
      type: "custom",
      align: "start",
      render: (row) => row.memberData?.name ?? "",
    },
    {
      header: "",
      id: BookingColumns.CHIPS,
      type: "custom",
      align: "end",
      render: () => <div>Chips...</div>,
    },
    {
      header: "",
      id: BookingColumns.SHORTCUT_ACTIONS,
      type: "custom",
      align: "center",
      render: () => <div>Actions</div>,
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
