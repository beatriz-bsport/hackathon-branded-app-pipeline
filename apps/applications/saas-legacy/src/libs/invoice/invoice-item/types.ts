import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';

export type InvoiceItem = {
  id: number;
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
  // A specific field for invoice items containing giftcards
  incremental_consumer_giftcard_identifier?: string;
  /** An optional field for invoice items that are linked to a printable gift card */
  consumer_giftcard_kind?: ConsumerGiftcardKind;
};
