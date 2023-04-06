export type InvoiceItem = {
  id: string;
  price: string;
  invoice: string;
  object_id: number;
  content_type: number;
  subtitle: string;
  name: string;
  reverted: boolean;
  total_price_notax?: string;
  total_price?: string;
  voucher?: string;
};
