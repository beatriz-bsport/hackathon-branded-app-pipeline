import type { FC } from "react";

import { useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { MembershipPlanInvoiceMobile } from "./membership-plan-invoice-mobile";
import { MembershipPlanInvoiceTable } from "./membership-plan-invoice-table";
import type { MembershipPlanInvoiceListProps } from "./types";

// Mirrors the responsive switch in MembershipPlanInvoiceList intentionally:
// this renders inside the Suspense boundary before data loads, so it cannot
// share state with the data component. Keep breakpoints in sync if changed.
export const MembershipPlanInvoiceListLoading: FC = () => {
  const { t } = useTranslation("membership-plan");
  const isMobile = !useMatchMedia("sm");

  const sharedProps: MembershipPlanInvoiceListProps = {
    rows: [],
    isEmpty: false,
    emptyConfig: {},
    loadingProps: {
      isLoading: true,
      message: t("invoiceList.loading"),
    },
  };

  return isMobile ? (
    <MembershipPlanInvoiceMobile {...sharedProps} />
  ) : (
    <MembershipPlanInvoiceTable {...sharedProps} />
  );
};
