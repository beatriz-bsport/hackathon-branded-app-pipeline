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

import { ShortcutActionsButton } from "#src/components/session-management/action-buttons/booking/shortcut-actions-button";
import { BookingActionItemId } from "#src/components/session-management/action-buttons/booking/types";
import { useFetchRefinedBookings } from "#src/hooks/booking/fetch/use-fetch-refined-bookings";
import { useSearchBookings } from "#src/hooks/booking/fetch/use-search-bookings";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import {
  setSelectedBooking,
  setSelectedBookingOption,
} from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingListedInformation } from "#src/stores/session-management/types";
import type { RefinedBooking } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";

import { formatBookingSpotLabel } from "./booking-spot-label";
import { ChipsCell } from "./chips-cell";

enum NoShowBookingColumns {
  CLIENT = "client",
  CHIPS = "chips",
  ACTIONS = "actions",
}

export const NoShowBookingsTable: FC<{
  sessionId: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ sessionId, searchQuery, setSearchQuery }) => {
  const { t } = useTranslation("sessionManagement");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: "no-show-bookings" });

  const { data: session } = useRetrieveSession(sessionId);

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

  const listedInformation = useSessionManagementStore(
    (state) => state.listedInformation,
  );

  const isMobile = !useMatchMedia("lg");

  const columns: GenericTableColumn<RefinedBooking>[] = [
    {
      header: t("bookingsTable.headers.client"),
      id: NoShowBookingColumns.CLIENT,
      type: "custom",
      align: "start",
      render: (row) => {
        const spotName =
          listedInformation.includes(BookingListedInformation.SPOT) &&
          session.room_blueprint != null
            ? formatBookingSpotLabel(
                row.spot_information,
                t("participantDetails.spot"),
                t("participantDetails.noSpotAssigned"),
              )
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
      id: NoShowBookingColumns.CHIPS,
      type: "custom",
      align: "end",
      render: (row) => (
        <ChipsCell
          first_in_company={row.first_in_company}
          memberData={row.memberData}
          recurrence_rule_booking={row.recurrence_rule_booking}
          no_show_penalty_applied={row.no_show_penalty_applied}
        />
      ),
    },
    {
      header: "",
      id: NoShowBookingColumns.ACTIONS,
      type: "custom",
      align: "center",
      render: (row) => (
        <ShortcutActionsButton
          sessionId={sessionId}
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

  const listItems: ListProps["items"] = searchedBookings.map((booking) => {
    const spotName =
      listedInformation.includes(BookingListedInformation.SPOT) &&
      session.room_blueprint != null
        ? formatBookingSpotLabel(
            booking.spot_information,
            t("participantDetails.spot"),
            t("participantDetails.noSpotAssigned"),
          )
        : null;
    const passName = listedInformation.includes(BookingListedInformation.PASS)
      ? booking.passData?.name
      : null;
    const secondaryText = [spotName, passName].filter(Boolean).join(" \u2022 ");

    return {
      id: `no-show-booking-${booking.id}`,
      title: booking.memberData?.name ?? "",
      description: secondaryText || undefined,
      avatar: {
        src: booking.memberData?.photo,
        initials: getMemberInitials({
          firstname: booking.memberData?.first_name,
          lastname: booking.memberData?.last_name,
        }),
        shape: "round" as const,
      },
      isActive: booking.id === selectedBookingId,
      onItemClick: () => {
        setSelectedBookingOption(null);
        setSelectedBooking(booking.id);
      },
      customNode: (
        <div onClick={(e) => e.stopPropagation()}>
          <ShortcutActionsButton
            sessionId={sessionId}
            bookingId={booking.id}
            memberId={booking.memberData?.id}
            participantEmail={booking.memberData?.email}
            participantPhone={booking.memberData?.phone}
            allowedItemIds={[
              BookingActionItemId.SEND_MESSAGE,
              BookingActionItemId.COPY_EMAIL,
              BookingActionItemId.COPY_PHONE,
              BookingActionItemId.UPDATE_MEMBER_NOTES,
            ]}
          />
        </div>
      ),
    };
  });

  if (isMobile) {
    return (
      <div
        className={clsx({
          "border-stroke-regular border-stroke-weak rounded-md overflow-hidden":
            !isLoading,
        })}
      >
        <List
          id="no-show-bookings-mobile-list"
          items={listItems}
          paginationProps={paginationProps}
          emptyStateProps={{
            isEmpty: !searchedBookings.length,
            emptyConfig: {
              title: t("bookingsTable.emptyState.emptyNoShowTitle"),
              subtitle: t("bookingsTable.emptyState.emptyNoShowSubtitle"),
            },
            isEmptySearch: hasSearchQuery && !searchedBookings.length,
            emptySearchConfig: {
              title: "",
              subtitle: t("bookingsTable.emptyState.emptySearch"),
              secondaryButtonConfig: {
                label: t("bookingsTable.emptyState.clearSearch"),
                iconLeft: "x",
                onClick: () => {
                  setSearchQuery("");
                },
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
            title: t("bookingsTable.emptyState.emptyNoShowTitle"),
            subtitle: t("bookingsTable.emptyState.emptyNoShowSubtitle"),
          },
          isEmptySearch: hasSearchQuery && !searchedBookings.length,
          emptySearchConfig: {
            title: "",
            subtitle: t("bookingsTable.emptyState.emptySearch"),
            secondaryButtonConfig: {
              label: t("bookingsTable.emptyState.clearSearch"),
              iconLeft: "x",
              onClick: () => {
                setSearchQuery("");
              },
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
