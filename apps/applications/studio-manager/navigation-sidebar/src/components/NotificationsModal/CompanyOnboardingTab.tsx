import { type FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useFetchAlertsByKind } from "#src/api/use-alerts";
import { useTranslation } from "#src/utils/i18n";

import CompanyOnboardingListItem from "./CompanyOnboardingListItem";
import { usePagination } from "./use-pagination";

export const CompanyOnboardingTab: FC = () => {
  const { t } = useTranslation("default");
  const { page, pageSize, onPageChange } = usePagination();

  const {
    alerts: companyOnboardingAlerts,
    count,
    isLoading,
  } = useFetchAlertsByKind({
    alertKind: ALERT_KINDS.COMPANY_ONBOARDING,
    page,
    pageSize,
  });

  const listItems = companyOnboardingAlerts.map((alert, index) => ({
    id: `${alert.alert_kind}-${alert.company}-${index}`,
    type: alert.data.type,
    date: alert.data.date,
    paymentEngineIdentifier: alert.data.payment_engine_identifier,
  }));

  return (
    <List
      id="company-onboarding-notifications-list"
      items={listItems}
      ListItem={CompanyOnboardingListItem}
      loadingProps={{
        isLoading,
        message: t("notifications.companyOnboarding.loading"),
      }}
      paginationProps={{
        currentPage: page,
        rowsPerPage: pageSize,
        totalItems: count,
        onPageChange,
        showRowsPerPageSelector: false,
      }}
      emptyStateProps={{
        isEmpty: !isLoading && companyOnboardingAlerts.length === 0,
        emptyConfig: {
          title: t("notifications.companyOnboarding.empty.title"),
          description: t("notifications.companyOnboarding.empty.description"),
        },
      }}
    />
  );
};
