export type NotificationTab =
  | "billing"
  | "orders"
  | "tasks"
  | "unpaid-appointments"
  | "tutorials"
  | "company-onboarding";

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
