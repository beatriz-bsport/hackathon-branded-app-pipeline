import type { FC } from "react";

import {
  type PaginationProps,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useBillingPlanInvoicesPaginatedSuspenseQuery } from "#src/hooks/api/use-billing-plan-invoices-query";
import { useTranslation } from "#src/utils/i18n";

import { MembershipPlanInvoiceMobile } from "./membership-plan-invoice-mobile";
import { MembershipPlanInvoiceTable } from "./membership-plan-invoice-table";
import type { MembershipPlanInvoiceListProps } from "./types";
import { useMembershipPlanInvoiceRows } from "./use-membership-plan-invoice-rows";

export const MembershipPlanInvoiceList: FC<{ billingPlanId: number }> = ({
  billingPlanId,
}) => {
  const { t } = useTranslation("membership-plan");
  const isMobile = !useMatchMedia("sm");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const { data } = useBillingPlanInvoicesPaginatedSuspenseQuery({
    billing_plan: billingPlanId,
    page: currentPage,
    page_size: currentPageSize,
  });

  const rows = useMembershipPlanInvoiceRows(data.results);
  const totalItems = data.count;

  const paginationProps: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageChange: (page) => setPageSettings(page, currentPageSize),
  };

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("invoiceList.emptyList.title"),
    subtitle: t("invoiceList.emptyList.subtitle"),
  };

  const sharedProps: MembershipPlanInvoiceListProps = {
    rows,
    isEmpty: totalItems === 0,
    emptyConfig,
    paginationProps,
    loadingProps: {},
  };

  return isMobile ? (
    <MembershipPlanInvoiceMobile {...sharedProps} />
  ) : (
    <MembershipPlanInvoiceTable {...sharedProps} />
  );
};
