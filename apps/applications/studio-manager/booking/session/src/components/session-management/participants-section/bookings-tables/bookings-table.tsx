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
  Toggle,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { ShortcutActionsButton } from "#src/components/session-management/action-buttons/booking/shortcut-actions-button";
import { useSetAttendance } from "#src/hooks/booking/actions/use-set-attendance";
import { useFetchRefinedBookings } from "#src/hooks/booking/fetch/use-fetch-refined-bookings";
import { useSearchBookings } from "#src/hooks/booking/fetch/use-search-bookings";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import {
  type SessionManagementModalParams,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals";
import {
  setSelectedBooking,
  setSelectedBookingOption,
} from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingListedInformation } from "#src/stores/session-management/types";
import type { RefinedBooking } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { formatBookingSpotLabel } from "./booking-spot-label";
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
  openModal: (
    type: SessionManagementModalType,
    params?: SessionManagementModalParams,
  ) => void;
  setSearchQuery: (query: string) => void;
}> = ({ sessionId, searchQuery, openModal, setSearchQuery }) => {
  const { t } = useTranslation("sessionManagement");

  const clean = (value?: string | null) => value?.trim() ?? "";

  const joinClean = (
    parts: Array<string | null | undefined>,
    separator: string,
  ) => parts.map(clean).filter(Boolean).join(separator);

  const getSecondaryText = (
    booking: Pick<
      RefinedBooking,
      "spot_information" | "passData" | "credit_consumed"
    >,
  ) => {
    const spotName = listedInformation.includes(BookingListedInformation.SPOT)
      ? formatBookingSpotLabel(
          booking.spot_information,
          t("participantDetails.spot"),
        )
      : "";

    const passName = listedInformation.includes(BookingListedInformation.PASS)
      ? clean(booking.passData?.name)
      : "";

    const noCreditsUsed =
      booking.credit_consumed === 0 && session.credit_price_override !== 0
        ? t("participantDetails.noCreditsUsed")
        : "";

    return joinClean([spotName, passName, noCreditsUsed], " • ");
  };

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: "bookings" });

  const { mutate: setAttendance, isPending: isSettingAttendance } =
    useSetAttendance();

  const { data: session } = useRetrieveSession(sessionId);
  const { activity } = useRetrieveSessionDetails(session);
  const isWorkshop = activity.is_workshop;

  const hasAttendancePermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.attendance"
      : "reservation.activity.allowed_actions.attendance",
  );

  const hasCreateBookingPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.create"
      : "reservation.activity.allowed_actions.create",
  );

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

  const isMobile = !useMatchMedia("lg");

  const columns: GenericTableColumn<RefinedBooking>[] = [
    ...(hasAttendancePermission
      ? [
          {
            header: t("bookingsTable.headers.present"),
            id: BookingColumns.PRESENT,
            type: "custom" as const,
            align: "start" as const,
            render: (row: RefinedBooking) => (
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
                    sessionId,
                  })
                }
              />
            ),
          },
        ]
      : []),
    {
      header: t("bookingsTable.headers.client"),
      id: BookingColumns.CLIENT,
      type: "custom",
      align: "start",
      render: (row) => {
        const secondaryText = getSecondaryText(row);

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
          no_show_penalty_applied={row.no_show_penalty_applied}
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
          consumerPaymentPackId={row.consumer_payment_pack}
          openModal={openModal}
          participantEmail={row.memberData?.email}
          participantPhone={row.memberData?.phone}
          currentSpot={row.spot_id}
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

  const listItems: ListProps["items"] = searchedBookings.map((booking) => {
    const secondaryText = getSecondaryText(booking);

    return {
      id: `booking-${booking.id}`,
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
        if (booking.id === selectedBookingId) {
          setSelectedBooking(null);
          return;
        }
        setSelectedBookingOption(null);
        setSelectedBooking(booking.id);
      },
      customNode: (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-sm"
        >
          {hasAttendancePermission && (
            <Toggle
              checked={booking.attendance}
              id={`attendance-toggle-${booking.id}`}
              label=""
              disabled={isSettingAttendance}
              onChange={() =>
                setAttendance({
                  bookingId: booking.id,
                  attendance: !booking.attendance,
                  sessionId,
                })
              }
            />
          )}
          <ShortcutActionsButton
            sessionId={sessionId}
            bookingId={booking.id}
            memberId={booking.memberData?.id}
            consumerPaymentPackId={booking.consumer_payment_pack}
            openModal={openModal}
            participantEmail={booking.memberData?.email}
            participantPhone={booking.memberData?.phone}
            currentSpot={booking.spot_id}
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
          id="bookings-mobile-list"
          items={listItems}
          paginationProps={paginationProps}
          emptyStateProps={{
            isEmpty: !searchedBookings.length,
            emptyConfig: {
              title: "",
              subtitle: t("bookingsTable.emptyState.title"),
              ...(hasCreateBookingPermission && {
                ctaButtonConfig: {
                  label: t("bookButton"),
                  onClick: () => {
                    openModal(SessionManagementModalType.BOOK);
                  },
                },
              }),
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
            if (booking.id === selectedBookingId) {
              setSelectedBooking(null);
              return;
            }
            setSelectedBookingOption(null);
            setSelectedBooking(booking.id);
          },
        }))}
        paginationProps={paginationProps}
        emptyStateProps={{
          isEmpty: !searchedBookings.length,
          emptyConfig: {
            title: "",
            subtitle: t("bookingsTable.emptyState.title"),
            ...(hasCreateBookingPermission && {
              ctaButtonConfig: {
                label: t("bookButton"),
                onClick: () => {
                  openModal(SessionManagementModalType.BOOK);
                },
              },
            }),
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
