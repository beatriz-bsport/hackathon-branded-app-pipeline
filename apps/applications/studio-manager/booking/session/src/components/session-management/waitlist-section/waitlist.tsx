import clsx from "clsx";
import { FC, useMemo } from "react";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import {
  type ActionButton,
  Avatar,
  Badge,
  Body,
  Button,
  type GenericTableColumn,
  List,
  type ListProps,
  PaginationProps,
  Table,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import {
  SessionManagementModalParams,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals.js";
import { useFetchRefinedBookingOptions } from "#src/hooks/waitlist/use-fetch-refined-booking-options";
import { useFetchWaitingListConfiguration } from "#src/hooks/waitlist/use-fetch-waitlist-configuration";
import { useSearchBookingOptions } from "#src/hooks/waitlist/use-search-booking-options";
import {
  setSelectedBooking,
  setSelectedBookingOption,
} from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { WaitlistFilter } from "#src/stores/session-management/types";
import type { RefinedBookingOption } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";

export const WaitList: FC<{
  sessionId: number;
  searchQuery: string;
  readOnly?: boolean;
  paginationNamespace?: string;
  openModal?: (
    type: SessionManagementModalType,
    params?: SessionManagementModalParams,
  ) => void;
}> = ({
  sessionId,
  searchQuery,
  readOnly = false,
  paginationNamespace = WaitlistFilter.ON_WAITLIST,
  openModal,
}) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

  const waitlistFilters = useSessionManagementStore(
    (state) => state.waitlistFilters,
  );

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: paginationNamespace });

  const {
    isLoading,
    results: refinedBookingOptions,
    count,
  } = useFetchRefinedBookingOptions({
    offer: session.id,
    page: currentPage,
    page_size: currentPageSize,
  });

  const {
    data: { display_member_position },
  } = useFetchWaitingListConfiguration();

  const searchedBookingOptions = useSearchBookingOptions(
    refinedBookingOptions,
    searchQuery,
  );

  const selectedBookingOptionId = useSessionManagementStore(
    (state) => state.selectedBookingOptionId,
  );

  const hasSearchQuery = searchQuery.trim().length > 0;

  const hasSessionStarted = (() => {
    const startDateTime = fromIsoString(session.date_start, {
      zone: session.timezone_name,
    });
    const now = getLocalNow({ zone: session.timezone_name });
    return now >= startDateTime;
  })();

  const isMobile = !useMatchMedia("lg");

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
          {display_member_position && row.waitingListPosition && (
            <Badge
              size="lg"
              color="default"
              text={`${row.waitingListPosition.member_position}/${row.waitingListPosition.waiting_list_size}`}
            />
          )}
          <Avatar
            shape="round"
            src={row.memberData?.photo}
            initials={getMemberInitials({
              firstname: row.memberData?.first_name,
              lastname: row.memberData?.last_name,
            })}
          />

          <Body size="lg">{row.memberData?.name}</Body>
        </div>
      ),
    },
    ...(readOnly
      ? []
      : [
          {
            header: "",
            id: "actions",
            type: "custom",
            align: "end",
            render: (row) => (
              <div className="flex gap-sm items-center">
                <ResponsiveTooltip
                  placement="bottom"
                  label={t("actions.bookToClass")}
                >
                  <Button
                    kind="icon-button"
                    icon="plus"
                    label={t("actions.bookToClass")}
                    intent="default"
                    size="md"
                    color="main"
                    disabled
                  />
                </ResponsiveTooltip>
                <ResponsiveTooltip
                  placement="bottom"
                  label={
                    hasSessionStarted
                      ? t("actions.impossibleToRemoveFromWaitlist")
                      : t("actions.removeFromWaitlist")
                  }
                >
                  <Button
                    kind="icon-button"
                    icon="trash-01"
                    label={t("actions.removeFromWaitlist")}
                    intent="default"
                    size="md"
                    color="main"
                    disabled={hasSessionStarted || !openModal}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal?.(
                        SessionManagementModalType.DISCARD_BOOKING_OPTION,
                        {
                          bookingOptionId: row.id,
                        },
                      );
                    }}
                  />
                </ResponsiveTooltip>
              </div>
            ),
          } as GenericTableColumn<RefinedBookingOption>,
        ]),
  ];

  const listItems: ListProps["items"] = searchedBookingOptions.map(
    (bookingOption) => {
      const buttons: ActionButton[] = readOnly
        ? []
        : [
            {
              id: `waitlist-book-${bookingOption.id}`,
              kind: "icon-button",
              icon: "plus",
              label: t("actions.bookToClass"),
              intent: "default",
              size: "md",
              color: "main",
              disabled: true,
            },
            {
              id: `waitlist-remove-${bookingOption.id}`,
              kind: "icon-button",
              icon: "trash-01",
              label: t("actions.removeFromWaitlist"),
              intent: "default",
              size: "md",
              color: "main",
              disabled: hasSessionStarted || !openModal,
              onClick: () =>
                openModal?.(SessionManagementModalType.DISCARD_BOOKING_OPTION, {
                  bookingOptionId: bookingOption.id,
                }),
            },
          ];

      return {
        id: `waitlist-${bookingOption.id}`,
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
        customNode:
          display_member_position && bookingOption.waitingListPosition ? (
            <Badge
              size="lg"
              color="default"
              text={`${bookingOption.waitingListPosition.member_position}/${bookingOption.waitingListPosition.waiting_list_size}`}
            />
          ) : undefined,
        buttons,
      };
    },
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
          id="waitlist-mobile-list"
          items={listItems}
          paginationProps={paginationProps}
          emptyStateProps={{
            isEmpty: !searchedBookingOptions.length,
            ...(waitlistFilters === WaitlistFilter.ON_WAITLIST
              ? {
                  emptyConfig: {
                    title: t("waitList.emptyState.title"),
                    ctaButtonConfig: {
                      label: t("bookButton"),
                      onClick: () => {
                        openModal?.(SessionManagementModalType.BOOK);
                      },
                    },
                  },
                }
              : {
                  emptyConfig: { title: t("waitList.emptyState.pending") },
                }),
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
          ...(readOnly
            ? {}
            : {
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
          ...(waitlistFilters === WaitlistFilter.ON_WAITLIST
            ? {
                emptyConfig: {
                  title: t("waitList.emptyState.title"),
                  ctaButtonConfig: {
                    label: t("bookButton"),
                    onClick: () => {
                      openModal?.(SessionManagementModalType.BOOK);
                    },
                  },
                },
              }
            : {
                emptyConfig: { title: t("waitList.emptyState.pending") },
              }),
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
