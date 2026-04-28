import type { Fetch } from "@bsport/fetch";

export type PaymentFlowModalProps = {
  isOpen: boolean;
  invoiceId: string;
  memberId: number;
  fetch: Fetch;
  onClose: () => void;
  onConfirm?: () => void;
};
