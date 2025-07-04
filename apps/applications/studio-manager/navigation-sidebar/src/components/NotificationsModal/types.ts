import { type ComponentType } from "react";

import {
  type Alert,
  type AlertKind,
  type CompanyOnboardingAlert,
  type InvoiceAlert,
  type NewOrderAlert,
  type PrivateBookingIncompleteAlert,
  type ReminderTaskAlert,
  type TutorialSectionOrLessonAlert,
  type UnpaidPrivateBookingAlert,
} from "@bsport/store-staff-management-alerting";

export type {
  InvoiceAlert,
  NewOrderAlert,
  ReminderTaskAlert,
  CompanyOnboardingAlert,
  UnpaidPrivateBookingAlert,
  TutorialSectionOrLessonAlert,
  PrivateBookingIncompleteAlert,
};

export type NotificationTab =
  | "billing"
  | "orders"
  | "tasks"
  | "unpaid-appointments"
  | "tutorials"
  | "company-onboarding"
  | "private-booking-incomplete";

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TabConfiguration<
  TListItem = { id: string },
  TAlert extends Alert = Alert,
> {
  id: NotificationTab;
  label: string;
  alertKind: AlertKind;
  ListItemComponent: ComponentType<TListItem>;
  transformData: (alert: TAlert, index?: number) => TListItem;
  requiresCurrency?: boolean;
  translations: {
    loading: string;
    emptyTitle: string;
    emptyDescription: string;
  };
}

export interface GenericNotificationTabProps {
  config: TabConfiguration;
}
