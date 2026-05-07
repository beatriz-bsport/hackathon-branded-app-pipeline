import { Alert, Body, Modal } from "@bsport/kaizen-primitive-core";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  description?: string;
  alert?: { status: "critical" | "warning"; content: string };
  confirmLabel: string;
  confirmColor?: "critical" | "main";
  cancelLabel: string;
  isLoading?: boolean;
};

export const WellhubConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  description,
  alert,
  confirmLabel,
  confirmColor = "critical",
  cancelLabel,
  isLoading,
}: Props) => (
  <Modal
    open={isOpen}
    onClose={onClose}
    title={title}
    size="md"
    confirmButton={{
      color: confirmColor,
      label: confirmLabel,
      onClick: onConfirm,
      disabled: isLoading,
    }}
    cancelButton={{
      label: cancelLabel,
      onClick: onCancel ?? onClose,
    }}
  >
    <div className="flex flex-col gap-sm">
      {description ? <Body htmlVariant="p">{description}</Body> : null}
      {alert ? <Alert status={alert.status}>{alert.content}</Alert> : null}
    </div>
  </Modal>
);
