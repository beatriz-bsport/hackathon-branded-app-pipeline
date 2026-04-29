import clsx from "clsx";
import { FC, useMemo } from "react";

import {
  Avatar,
  Body,
  Button,
  type GenericTableColumn,
  PaginationProps,
  Table,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useFetchRefinedBookingOptions } from "#src/hooks/waitlist/use-fetch-refined-booking-options";
import { useSearchBookingOptions } from "#src/hooks/waitlist/use-search-booking-options.js";
import type { RefinedBookingOption } from "#src/types";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n";

export const WaitList: FC<{ sessionId: number; searchQuery: string }> = ({
  sessionId,
  searchQuery,
}) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: "waiting-list" });

  const {
    isLoading,
    results: refinedBookingOptions,
    count,
  } = useFetchRefinedBookingOptions({
    offer: session.id,
    page: currentPage,
    page_size: currentPageSize,
  });

  const searchedBookingOptions = useSearchBookingOptions(
    refinedBookingOptions,
    searchQuery,
  );

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
    [currentPage, currentPageSize, isLoading, count, setPageSettings],
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

          <Body size="lg">{row.memberData?.name}</Body>
        </div>
      ),
    },
    {
      header: "",
      id: "actions",
      type: "custom",
      align: "end",
      render: () => (
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
            />
          </ResponsiveTooltip>
          <ResponsiveTooltip
            placement="bottom"
            label={t("actions.removeFromWaitlist")}
          >
            <Button
              kind="icon-button"
              icon="trash-01"
              label={t("actions.removeFromWaitlist")}
              intent="default"
              size="md"
              color="main"
            />
          </ResponsiveTooltip>
        </div>
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
        rows={searchedBookingOptions}
        paginationProps={paginationProps}
        hideHeader
        emptyStateProps={{
          isEmpty: !searchedBookingOptions.length,
          emptyConfig: {
            title: t("waitList.emptyState.title"),
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
