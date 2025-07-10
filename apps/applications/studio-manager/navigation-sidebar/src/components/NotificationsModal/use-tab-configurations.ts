import { useMemo } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";
import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useTranslation } from "#src/utils/i18n";

import BillingListItem, { type BillingListItemProps } from "./BillingListItem";
import CompanyOnboardingListItem, {
  type CompanyOnboardingListItemProps,
} from "./CompanyOnboardingListItem";
import OrdersListItem, { type OrdersListItemProps } from "./OrdersListItem";
import PrivateBookingIncompleteListItem, {
  type PrivateBookingIncompleteListItemProps,
} from "./PrivateBookingIncompleteListItem";
import TasksListItem, { type TasksListItemProps } from "./TasksListItem";
import TutorialsListItem, {
  type TutorialsListItemProps,
} from "./TutorialsListItem";
import UnpaidAppointmentsListItem, {
  type UnpaidAppointmentsListItemProps,
} from "./UnpaidAppointmentsListItem";
import { DEFAULT_CURRENCY_DISPLAY } from "./constants";
import type {
  CompanyOnboardingAlert,
  InvoiceAlert,
  NewOrderAlert,
  NotificationTab,
  PrivateBookingIncompleteAlert,
  ReminderTaskAlert,
  TabConfiguration,
  TutorialSectionOrLessonAlert,
  UnpaidPrivateBookingAlert,
} from "./types";

export const useTabConfigurations = (navigate?: (to: string) => void) => {
  const { t, i18n } = useTranslation("default");

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const currencySymbol =
    companyTheme?.currency_display || DEFAULT_CURRENCY_DISPLAY;

  return useMemo(
    () =>
      ({
        billing: {
          id: "billing",
          label: t("notifications.tabs.billing"),
          alertKind: ALERT_KINDS.UNEVEN_INVOICE,
          ListItemComponent: BillingListItem,
          requiresCurrency: true,
          translations: {
            loading: t("notifications.billing.loading"),
            emptyTitle: t("notifications.billing.empty.title"),
            emptyDescription: t("notifications.billing.empty.description"),
          },
          transformData: (alert) => ({
            id: alert.data.uuid,
            title: t("notifications.billing.itemTitle"),
            description: t("notifications.billing.itemDescription"),
            paidAmount: alert.data.price_payed,
            dueAmount: alert.data.price_due,
            currencySymbol,
            navigate: navigate,
          }),
        } satisfies TabConfiguration<BillingListItemProps, InvoiceAlert>,
        orders: {
          id: "orders",
          label: t("notifications.tabs.orders"),
          alertKind: ALERT_KINDS.NEW_ORDER,
          ListItemComponent: OrdersListItem,
          requiresCurrency: true,
          translations: {
            loading: t("notifications.orders.loading"),
            emptyTitle: t("notifications.orders.empty.title"),
            emptyDescription: t("notifications.orders.empty.description"),
          },
          transformData: (alert) => ({
            id: String(alert.data.order),
            title: t("notifications.orders.itemTitle"),
            price: alert.data.price,
            name: alert.data.name,
            currencySymbol,
          }),
        } satisfies TabConfiguration<OrdersListItemProps, NewOrderAlert>,
        tasks: {
          id: "tasks",
          label: t("notifications.tabs.tasks"),
          alertKind: ALERT_KINDS.REMINDER_NOTE,
          ListItemComponent: TasksListItem,
          translations: {
            loading: t("notifications.tasks.loading"),
            emptyTitle: t("notifications.tasks.empty.title"),
            emptyDescription: t("notifications.tasks.empty.description"),
          },
          transformData: (alert, index) => ({
            id: `${alert.data.member.id}-${index}`,
            title: alert.data.name,
            description: alert.data.description,
            memberName: alert.data.member.name,
            dateDue: alert.data.date_due,
          }),
        } satisfies TabConfiguration<TasksListItemProps, ReminderTaskAlert>,
        "company-onboarding": {
          id: "company-onboarding",
          label: t("notifications.tabs.companyOnboarding"),
          alertKind: ALERT_KINDS.COMPANY_ONBOARDING,
          ListItemComponent: CompanyOnboardingListItem,
          translations: {
            loading: t("notifications.companyOnboarding.loading"),
            emptyTitle: t("notifications.companyOnboarding.empty.title"),
            emptyDescription: t(
              "notifications.companyOnboarding.empty.description",
            ),
          },
          transformData: (alert, index) => ({
            id: `${alert.alert_kind}-${alert.company}-${index}`,
            type: alert.data.type,
            date: alert.data.date,
            paymentEngineIdentifier: alert.data.payment_engine_identifier,
          }),
        } satisfies TabConfiguration<
          CompanyOnboardingListItemProps,
          CompanyOnboardingAlert
        >,
        "unpaid-appointments": {
          id: "unpaid-appointments",
          label: t("notifications.tabs.unpaidAppointments"),
          alertKind: ALERT_KINDS.UNPAID_PRIVATE_BOOKING,
          ListItemComponent: UnpaidAppointmentsListItem,
          translations: {
            loading: t("notifications.unpaidAppointments.loading"),
            emptyTitle: t("notifications.unpaidAppointments.empty.title"),
            emptyDescription: t(
              "notifications.unpaidAppointments.empty.description",
            ),
          },
          transformData: (alert) => ({
            id: String(alert.data.private_booking),
            memberId: alert.data.member_id,
            title: t("notifications.unpaidAppointments.itemTitle"),
            memberName: alert.data.user_name,
            dateStart: alert.data.date_start,
            creditsDue: alert.data.credits_due ?? 0,
          }),
        } satisfies TabConfiguration<
          UnpaidAppointmentsListItemProps,
          UnpaidPrivateBookingAlert
        >,
        tutorials: {
          id: "tutorials",
          label: t("notifications.tabs.tutorials"),
          alertKind: ALERT_KINDS.NEW_TUTORIAL_SECTION_OR_LESSON,
          ListItemComponent: TutorialsListItem,
          translations: {
            loading: t("notifications.tutorials.loading"),
            emptyTitle: t("notifications.tutorials.empty.title"),
            emptyDescription: t("notifications.tutorials.empty.description"),
          },
          transformData: (alert) => ({
            id: `${alert.data.section_id}-${alert.data.lesson_id}`,
            sectionNames: alert.data.section_names,
            lessonNames: alert.data.lesson_names,
            isNewSection: alert.data.new_section,
            sectionId: alert.data.section_id,
            lessonId: alert.data.lesson_id,
          }),
        } satisfies TabConfiguration<
          TutorialsListItemProps,
          TutorialSectionOrLessonAlert
        >,
        "private-booking-incomplete": {
          id: "private-booking-incomplete",
          label: t("notifications.tabs.privateBookingIncomplete"),
          alertKind: ALERT_KINDS.PRIVATE_BOOKING_INCOMPLETE,
          ListItemComponent: PrivateBookingIncompleteListItem,
          translations: {
            loading: t("notifications.privateBookingIncomplete.loading"),
            emptyTitle: t("notifications.privateBookingIncomplete.empty.title"),
            emptyDescription: t(
              "notifications.privateBookingIncomplete.empty.description",
            ),
          },
          transformData: (alert, index) => ({
            id: `${alert.alert_kind}-${alert.company}-${index}`,
            name: alert.data.name,
            userName: alert.data.user_name,
            dateStart: alert.data.date_start,
            memberId: alert.data.member_id,
            privateBooking: alert.data.private_booking,
          }),
        } satisfies TabConfiguration<
          PrivateBookingIncompleteListItemProps,
          PrivateBookingIncompleteAlert
        >,
      }) satisfies Record<NotificationTab, unknown>,
    [i18n.language, currencySymbol],
  );
};
