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
  navigate?: (to: string) => void;
  className?: string;
}

export interface TabConfiguration<
  ListItemProps = { id: string },
  AlertType = Alert,
> {
  id: NotificationTab;
  label: string;
  alertKind: AlertKind;
  ListItemComponent: ComponentType<ListItemProps>;
  transformData: (alert: AlertType, index?: number) => ListItemProps;
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
