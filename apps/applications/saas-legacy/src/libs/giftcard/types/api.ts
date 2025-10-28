import type { DateTime } from 'luxon';
import type { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import type { PaginationFilterParams } from '#src/libs/types';

export type GiftcardDataAPI = {
  cover: string;
  amount_gifted: number;
  available_payment_method_identifiers: Array<number>;
  description: string;
  expiration_days: number | null;
  name: string;
  price: number;
  tags_on_consumer_item_creation: Array<number>;
};

export type GiftcardFormValues = {
  activation_datetime: DateTime | null;
  background_image: string | null;
  date_to_send: string;
  force: boolean;
  message_content: string;
  message_is_for: string;
  message_is_from: string;
  name: string;
  recipients: string[];
  kind: ConsumerGiftcardKind;
};

export type ConsumerGiftcardAPI = Omit<
  GiftcardFormValues,
  'activation_datetime'
> & {
  activation_datetime: string | null;
};

export type GiftcardAttributeMemberPayload = {
  dst_member: string;
  activation_code?: string;
};

export type GiftcardAttributePrintableCodePayload = {
  dst_member: string;
  code: string;
};

export type ConsumerGiftcardFilterParams = {
  as_received?: boolean;
  as_sent?: boolean;
  company?: number;
  giftcard_template?: number;
  has_amount_left?: boolean;
  id__in?: number[];
  in_timeframe?: boolean;
} & PaginationFilterParams;
