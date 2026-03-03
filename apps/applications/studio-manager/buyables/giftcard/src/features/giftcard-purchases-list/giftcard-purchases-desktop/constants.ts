import type { GiftcardPurchaseStatus } from "../giftcard-purchase-status";
import type { PersonCell } from "../types";

/**
 * Define the columns that can be displayed in the table
 * Warning: The order in this object defines the order in the table
 */
export const AVAILABLE_COLUMNS = {
  ISSUE_DATE: "issue-date",
  STATUS: "status",
  BUYER: "buyer",
  RECIPIENT: "recipient",
  EXPIRY_DATE: "expiry-date",
  PRINTABLE_CODE: "printable-code",
  VALUE: "value",
  BALANCE: "balance",
} as const;

export type AvailableColumn =
  (typeof AVAILABLE_COLUMNS)[keyof typeof AVAILABLE_COLUMNS];

export type TableRowData = {
  id: number;

  issueDate: string; // string from backend, not formatted
  status: GiftcardPurchaseStatus;

  buyer: PersonCell;
  recipient: PersonCell | null;

  expiryDate: string | null; // string from backend, not formatted
  /** The initial value of the giftcard */
  value: number; // used as price
  /** What is remaining on the giftcard */
  balance: number; // used as price

  /** If it's a printable card, its code, else null */
  printableCode: string | null;
};
