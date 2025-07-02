export type NotificationTab =
  | "billing"
  | "orders"
  | "tasks"
  | "unpaid-appointments"
  | "tutorials";

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
