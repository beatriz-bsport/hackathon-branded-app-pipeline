import type { FC } from "react";

import {
  type PaginationProps,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { useBillingPlansPaginatedSuspenseQuery } from "#src/hooks/api/use-billing-plans-query";
import { useTranslation } from "#src/utils/i18n";

import { MembershipPlanMobileList } from "./membership-plan-mobile-list";
import { MembershipPlanTable } from "./membership-plan-table";
import { MembershipPlanListProps } from "./types";
import { useMembershipPlanRows } from "./use-membership-plan-rows";

/**
 * Membership plan list for a contract. Fetches its own data through a suspense
 * query (no props injection) and renders the table on desktop, the list on
 * mobile. Wrap it in a suspense boundary with `MembershipPlanListLoading`.
 */
export const MembershipPlanList: FC<{ contractId: number }> = ({
  contractId,
}) => {
  const { t } = useTranslation("contract-details");
  const isMobile = !useMatchMedia("sm");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const { data } = useBillingPlansPaginatedSuspenseQuery({
    contract: contractId,
    ordering: "-first_billing_date",
    page: currentPage,
    page_size: currentPageSize,
  });

  const rows = useMembershipPlanRows(data.results);
  const totalItems = data.count;

  const paginationProps: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: (page, pageSize) => {
      if (pageSize !== currentPageSize) {
        setPageSettings(DEFAULT_PAGE, pageSize);
      } else {
        setPageSettings(page, pageSize);
      }
    },
    showRowsPerPageSelector: true,
  };

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("overview.membershipPlanList.emptyList.title"),
    subtitle: t("overview.membershipPlanList.emptyList.subtitle"),
  };

  const sharedProps: MembershipPlanListProps = {
    rows,
    isEmpty: totalItems === 0,
    emptyConfig,
    paginationProps,
    loadingProps: {
      isLoading: false,
    },
  };

  return isMobile ? (
    <MembershipPlanMobileList {...sharedProps} />
  ) : (
    <MembershipPlanTable {...sharedProps} />
  );
};
