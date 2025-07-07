import { useMemo } from "react";

import { ALERT_KINDS } from "@bsport/store-staff-management-alerting";

import { useTranslation } from "#src/utils/i18n";

import BillingListItem from "./BillingListItem";
import CompanyOnboardingListItem from "./CompanyOnboardingListItem";
import OrdersListItem from "./OrdersListItem";
import PrivateBookingIncompleteListItem from "./PrivateBookingIncompleteListItem";
import TasksListItem from "./TasksListItem";
import TutorialsListItem from "./TutorialsListItem";
import UnpaidAppointmentsListItem from "./UnpaidAppointmentsListItem";
import type {
  CompanyOnboardingAlert,
  InvoiceAlert,
  NewOrderAlert,
  PrivateBookingIncompleteAlert,
  ReminderTaskAlert,
  TutorialSectionOrLessonAlert,
  UnpaidPrivateBookingAlert,
} from "./types";

export const useTabConfigurations = () => {
  const { t } = useTranslation("default");

  return useMemo(
    () => ({
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
        transformData: (alert: InvoiceAlert) => ({
          id: alert.data.uuid,
          title: t("notifications.billing.itemTitle"),
          description: t("notifications.billing.itemDescription"),
          paidAmount: alert.data.price_payed,
          dueAmount: alert.data.price_due,
        }),
      },
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
        transformData: (alert: NewOrderAlert) => ({
          id: String(alert.data.order),
          title: t("notifications.orders.itemTitle"),
          price: alert.data.price,
          name: alert.data.name,
        }),
      },
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
        transformData: (alert: ReminderTaskAlert) => ({
          id: String(alert.data.member.id),
          title: alert.data.name,
          description: alert.data.description,
          memberName: alert.data.member.name,
          dateDue: alert.data.date_due,
        }),
      },
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
        transformData: (alert: CompanyOnboardingAlert, index?: number) => ({
          id: `${alert.alert_kind}-${alert.company}-${index}`,
          type: alert.data.type,
          date: alert.data.date,
          paymentEngineIdentifier: alert.data.payment_engine_identifier,
        }),
      },
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
        transformData: (alert: UnpaidPrivateBookingAlert) => ({
          id: String(alert.data.private_booking),
          memberId: alert.data.member_id,
          title: t("notifications.unpaidAppointments.itemTitle"),
          memberName: alert.data.user_name,
          dateStart: alert.data.date_start,
          creditsDue: alert.data.credits_due ?? 0,
        }),
      },
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
        transformData: (alert: TutorialSectionOrLessonAlert) => ({
          id: String(alert.data.section_id + alert.data.lesson_id),
          sectionNames: alert.data.section_names,
          lessonNames: alert.data.lesson_names,
          isNewSection: alert.data.new_section,
          sectionId: alert.data.section_id,
          lessonId: alert.data.lesson_id,
        }),
      },
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
        transformData: (
          alert: PrivateBookingIncompleteAlert,
          index?: number,
        ) => ({
          id: `${alert.alert_kind}-${alert.company}-${index}`,
          name: alert.data.name,
          userName: alert.data.user_name,
          dateStart: alert.data.date_start,
          memberId: alert.data.member_id,
          privateBooking: alert.data.private_booking,
        }),
      },
    }),
    [t],
  );
};
