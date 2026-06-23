import { type FC, useState } from "react";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import {
  type PaginationProps,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useBillingPlanInvoicesPaginatedSuspenseQuery } from "#src/hooks/api/use-billing-plan-invoices-query";
import { useTranslation } from "#src/utils/i18n";

import { EditBillingDateModal } from "./edit-billing-date-modal";
import { EditPriceModal } from "./edit-price-modal";
import { MembershipPlanInvoiceMobile } from "./membership-plan-invoice-mobile";
import { MembershipPlanInvoiceTable } from "./membership-plan-invoice-table";
import type {
  MembershipPlanInvoiceListProps,
  MembershipPlanInvoiceRowData,
} from "./types";
import { useMembershipPlanInvoiceRows } from "./use-membership-plan-invoice-rows";

export const MembershipPlanInvoiceList: FC<{ billingPlan: BillingPlan }> = ({
  billingPlan,
}) => {
  const { t } = useTranslation("membership-plan");
  const isMobile = !useMatchMedia("sm");
  const [editingBillingDateRow, setEditingBillingDateRow] =
    useState<MembershipPlanInvoiceRowData | null>(null);
  const [editingPriceRow, setEditingPriceRow] =
    useState<MembershipPlanInvoiceRowData | null>(null);

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const { data } = useBillingPlanInvoicesPaginatedSuspenseQuery({
    billing_plan: billingPlan.id,
    page: currentPage,
    page_size: currentPageSize,
  });

  const rows = useMembershipPlanInvoiceRows(data.results, billingPlan);
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
    onEditBillingDate: setEditingBillingDateRow,
    onEditPrice: setEditingPriceRow,
  };

  return (
    <>
      {isMobile ? (
        <MembershipPlanInvoiceMobile {...sharedProps} />
      ) : (
        <MembershipPlanInvoiceTable {...sharedProps} />
      )}

      <EditBillingDateModal
        key={editingBillingDateRow?.id}
        invoice={editingBillingDateRow}
        billingPlanId={billingPlan.id}
        onClose={() => setEditingBillingDateRow(null)}
      />

      <EditPriceModal
        key={editingPriceRow?.id}
        invoice={editingPriceRow}
        billingPlanId={billingPlan.id}
        onClose={() => setEditingPriceRow(null)}
      />
    </>
  );
};
