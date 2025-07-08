import { useMemo } from "react";

import {
  ALERT_KINDS,
  type AlertKind,
  selectAlertCountByKind,
  useAlertingStore,
} from "@bsport/store-staff-management-alerting";

import { useTabConfigurations } from "./use-tab-configurations";

export const useNotificationTabs = () => {
  const tabConfigurations = useTabConfigurations();

  const billingCount = useAlertingStore(
    selectAlertCountByKind(tabConfigurations.billing.alertKind),
  );
  const ordersCount = useAlertingStore(
    selectAlertCountByKind(tabConfigurations.orders.alertKind),
  );
  const tasksCount = useAlertingStore(
    selectAlertCountByKind(tabConfigurations.tasks.alertKind),
  );
  const companyOnboardingCount = useAlertingStore(
    selectAlertCountByKind(tabConfigurations["company-onboarding"].alertKind),
  );
  const unpaidAppointmentsCount = useAlertingStore(
    selectAlertCountByKind(tabConfigurations["unpaid-appointments"].alertKind),
  );
  const tutorialsCount = useAlertingStore(
    selectAlertCountByKind(tabConfigurations.tutorials.alertKind),
  );
  const privateBookingIncompleteCount = useAlertingStore(
    selectAlertCountByKind(
      tabConfigurations["private-booking-incomplete"].alertKind,
    ),
  );

  const countsByTabId: Record<Exclude<AlertKind, 8 | 9>, number> = useMemo(
    () => ({
      [ALERT_KINDS.UNEVEN_INVOICE]: billingCount,
      [ALERT_KINDS.NEW_ORDER]: ordersCount,
      [ALERT_KINDS.REMINDER_NOTE]: tasksCount,
      [ALERT_KINDS.COMPANY_ONBOARDING]: companyOnboardingCount,
      [ALERT_KINDS.UNPAID_PRIVATE_BOOKING]: unpaidAppointmentsCount,
      [ALERT_KINDS.NEW_TUTORIAL_SECTION_OR_LESSON]: tutorialsCount,
      [ALERT_KINDS.PRIVATE_BOOKING_INCOMPLETE]: privateBookingIncompleteCount,
    }),
    [
      billingCount,
      ordersCount,
      tasksCount,
      companyOnboardingCount,
      unpaidAppointmentsCount,
      tutorialsCount,
      privateBookingIncompleteCount,
    ],
  );

  const availableTabs = useMemo(
    () =>
      Object.values(tabConfigurations)
        .filter((config) => {
          const count = countsByTabId[config.alertKind];
          return count > 0;
        })
        .map((config) => ({
          id: config.id,
          label: config.label,
        })),
    [tabConfigurations, countsByTabId],
  );

  return {
    availableTabs,
    countsByTabId,
    tabConfigurations,
  };
};
