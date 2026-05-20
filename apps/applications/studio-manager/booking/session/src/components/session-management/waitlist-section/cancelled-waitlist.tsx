import clsx from "clsx";
import { FC, useMemo } from "react";

import {
  Avatar,
  Body,
  GenericTableColumn,
  List,
  type ListProps,
  PaginationProps,
  Table,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useFetchRefinedBookingOptions } from "#src/hooks/waitlist/use-fetch-refined-booking-options";
import { useSearchBookingOptions } from "#src/hooks/waitlist/use-search-booking-options";
import {
  setSelectedBooking,
  setSelectedBookingOption,
} from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { RefinedBookingOption } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";

export const CancelledWaitlist: FC<{
  sessionId: number;
  searchQuery: string;
  readOnly?: boolean;
}> = ({ sessionId, searchQuery, readOnly = false }) => {
  const { t } = useTranslation("sessionManagement");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: "cancelled-waiting-list" });

  const {
    isLoading,
    results: refinedBookingOptions,
    count,
  } = useFetchRefinedBookingOptions({
    offer: sessionId,
    page: currentPage,
    page_size: currentPageSize,
  });

  const searchedBookingOptions = useSearchBookingOptions(
    refinedBookingOptions,
    searchQuery,
  );

  const selectedBookingOptionId = useSessionManagementStore(
    (state) => state.selectedBookingOptionId,
  );

  const isMobile = !useMatchMedia("lg");

  const hasSearchQuery = searchQuery.trim().length > 0;

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      disabled: isLoading,
      totalItems: hasSearchQuery ? searchedBookingOptions.length : (count ?? 0),
      onPageSettingsChange: setPageSettings,
      showRowsPerPageSelector: !hasSearchQuery,
    }),
    [
      currentPage,
      currentPageSize,
      isLoading,
      count,
      setPageSettings,
      hasSearchQuery,
      searchedBookingOptions.length,
    ],
  );
  const columns: GenericTableColumn<RefinedBookingOption>[] = [
    {
      header: "",
      id: "client",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="flex gap-md items-center">
          <Avatar
            shape="round"
            src={row.memberData?.photo}
            initials={getMemberInitials({
              firstname: row.memberData?.first_name,
              lastname: row.memberData?.last_name,
            })}
          />

          <Body size="lg" className="line-through">
            {row.memberData?.name}
          </Body>
        </div>
      ),
    },
  ];

  const listItems: ListProps["items"] = searchedBookingOptions.map(
    (bookingOption) => ({
      id: `cancelled-waitlist-${bookingOption.id}`,
      title: bookingOption.memberData?.name ?? "",
      avatar: {
        src: bookingOption.memberData?.photo,
        initials: getMemberInitials({
          firstname: bookingOption.memberData?.first_name,
          lastname: bookingOption.memberData?.last_name,
        }),
        shape: "round" as const,
      },
      isActive: readOnly
        ? undefined
        : bookingOption.id === selectedBookingOptionId,
      onItemClick: readOnly
        ? undefined
        : () => {
            if (bookingOption.id === selectedBookingOptionId) {
              setSelectedBookingOption(null);
              return;
            }
            setSelectedBooking(null);
            setSelectedBookingOption(bookingOption.id);
          },
    }),
  );

  if (isMobile) {
    return (
      <div
        className={clsx({
          "border-stroke-regular border-stroke-weak rounded-md overflow-hidden":
            !isLoading,
        })}
      >
        <List
          id="cancelled-waitlist-mobile-list"
          items={listItems}
          paginationProps={paginationProps}
          emptyStateProps={{
            isEmpty: !searchedBookingOptions.length,
            emptyConfig: {
              title: t("waitList.emptyState.removed"),
            },
          }}
          loadingProps={{
            isLoading,
            message: t("bookingsTable.loadingMessage"),
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx({
        "border-stroke-regular border-stroke-weak rounded-md overflow-hidden":
          !isLoading,
      })}
    >
      <Table
        columns={columns}
        rowHeight="sm"
        rows={searchedBookingOptions.map((bookingOption) => ({
          ...bookingOption,
          ...(!readOnly && {
            isActive: bookingOption.id === selectedBookingOptionId,
            onRowClick: () => {
              if (bookingOption.id === selectedBookingOptionId) {
                setSelectedBookingOption(null);
                return;
              }
              setSelectedBooking(null);
              setSelectedBookingOption(bookingOption.id);
            },
          }),
        }))}
        paginationProps={paginationProps}
        hideHeader
        emptyStateProps={{
          isEmpty: !searchedBookingOptions.length,
          emptyConfig: {
            title: t("waitList.emptyState.removed"),
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
