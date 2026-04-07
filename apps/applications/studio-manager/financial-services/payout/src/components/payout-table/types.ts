export type PayoutTableRow = {
  id: number | string;
  date: string;
  amount: number;
  readableId: string;
  status: number;
  reconciliationStatus?: string;
  onRowClick?: () => void;
};
