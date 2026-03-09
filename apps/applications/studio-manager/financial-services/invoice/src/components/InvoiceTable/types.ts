import type { ChipProps } from "@bsport/kaizen-primitive-core";

export type InvoiceTableRow = {
  id: string;
  link: string;
  uuid: string;
  date: string;
  member: string;
  amount: number;
  type: string;
  status: Array<{
    label: string;
    color: ChipProps["color"];
  }>;
  downloadPdf: {
    uuid: string;
    is_draft: boolean;
    is_receipt_available: boolean;
  };
};
