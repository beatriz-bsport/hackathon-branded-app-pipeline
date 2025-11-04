import type { DateTime } from 'luxon';
import type { PaginationFilterParams } from '#src/libs/types';
import type { Giftcard, ConsumerGiftcard } from './models';

// ----- Giftcard Form -----

/**
 * Keys that will be injected in the form-data
 */
type GiftcardDataAPIParams = Pick<
  Giftcard,
  | 'name'
  | 'description'
  | 'manager_only'
  | 'expiration_days'
  | 'bookkeeping_account'
  | 'cover'
  | 'available_payment_method_identifiers'
  | 'tags_on_consumer_item_creation'
  | 'price'
>;

export type GiftcardDataAPIKeys = keyof GiftcardDataAPIParams;

export type GiftcardDataAPI = FormData;

// ----- Consumer Giftcard -----

export type ConsumerGiftcardAPI = Pick<
  ConsumerGiftcard,
  | 'background_image'
  | 'message_content'
  | 'message_is_for'
  | 'message_is_from'
  | 'name'
  | 'kind'
> & {
  recipients: string[];
  date_to_send: string;
  force: boolean;
  activation_datetime: DateTime | null;
  price: number | null;
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

// ----- Attribution -----

export type GiftcardAttributeMemberPayload = {
  dst_member: string;
  activation_code?: string;
};

export type GiftcardAttributePrintableCodePayload = {
  dst_member: string;
  code: string;
};
