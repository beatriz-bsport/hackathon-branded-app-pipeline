import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import type { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';

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

export type BaseInvoiceItem = {
  id: number;
  name: string;
  price: string;
  tax?: string;
  company: number;

  buyable_item_id: number;
  buyable_item_identifier: QuicksaleBasketItem; // matches QuicksaleBasketItem
  hasCustomPrice?: boolean;
  voucher: number;
  voucher_reason: string;
  editable: boolean;

  // Not shared
  reverted?: boolean;
  object_id?: number;
  // giftcard items
  incremental_consumer_giftcard_identifier?: string;
  consumer_giftcard_kind?: ConsumerGiftcardKind;
  // shop items
  color?: string;
  size?: string;
};
