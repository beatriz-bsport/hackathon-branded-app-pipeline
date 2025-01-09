import { ErrorAndLoading, PaginationFilterParams } from '#src/libs/types';
import { Member } from '../member/types';
import { DateTime } from 'luxon';

import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';

export type Giftcard = {
  id: number;
  name: string;
  description: string;
  cover: string;
  cover_thumbnail: string;
  expiration_days: number | null;
  price: string; // sent as decimal from backend, thus as a string: "4.54" to avoid round error
  available_payment_method_identifiers: Array<number>; // check bsport-commons payment-methods.ts
  manager_only: boolean;
  disabled: boolean;
  company: number;
  amount_gifted: string; // decimal price
  is_shared_giftcard?: boolean;
  tags_on_consumer_item_creation?: Array<number>;
  bookkeeping_account?: number;
};

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

export type GiftcardTemplate = {
  id: number;
  franchisor: number;
  name: string;
  description: string;
  expiration_days: number | null;
  price: string; // sent as decimal from backend, thus as a string: "4.54" to avoid round error
  available_payment_method_identifiers: Array<number>; // check bsport-commons payment-methods.ts
  manager_only: boolean;
  amount_gifted: string; // decimal price
  companies: Array<number>;
  cover: string;
  tags_on_consumer_item_creation?: Array<number>;
};

export type GiftcardRecipient = {
  date_created: string;
  email_sent_to: string;
  consumer_giftcard: number;
  id: number;
};

export type ConsumerGiftcardPersonnalizationElements = {
  name: string;
  message_is_from: string;
  message_is_for: string;
  message_content: string;
  background_image: string | null;
};

export type GiftcardAttributeMemberPayload = {
  dst_member: string;
  activation_code?: string;
};

export type GiftcardAttributePrintableCodePayload = {
  dst_member: string;
  code: string;
};

export type GiftcardBackgroundImage = {
  id: number;
  image: string; // url
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

export type ConsumerGiftcard<
  G = number,
  SRCM = number,
  DSTM = number,
> = ConsumerGiftcardPersonnalizationElements & {
  id: number;
  src_member: SRCM;
  dst_member: DSTM | null;
  giftcard: G;
  date_created: string;
  date_activated: string | null;
  active: boolean;
  planned_date_send: string;
  invitation_sent: boolean;
  consumed_amount_gifted: string; // decimal price
  price_bought: string; // decimal price
  giftcard_recipients: Array<GiftcardRecipient>;
  activation_code: string;
  reverted?: boolean;
  consumer_giftcard_source: number;
  giftcard_company: number;
  source_company_id: number;
  incremental_identifier: string;
  kind: ConsumerGiftcardKind;
  pdf_link: string | null;
  printable_code: string | null;
  activation_datetime: string | null;
  expiration_date: string | null;
};

export type GiftcardState = {
  giftcard: {
    byId: { [id: number]: Giftcard };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
  };
  consumerGiftcard: {
    byId: { [id: number]: ConsumerGiftcard };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
    page: number;
    count: number;
    asReceiver: {
      allIds: Array<number>;
      loading: boolean;
      error: Error | null;
      page: number;
      count: number;
    };
    asSender: {
      allIds: Array<number>;
      loading: boolean;
      error: Error | null;
      page: number;
      count: number;
    };
    attributeByPrintableCode: {
      loading: boolean;
      error: Error | null;
    };
  };
  giftcardBackgroundImage: {
    byId: { [id: number]: GiftcardBackgroundImage };
    allIds: Array<number>;
    loading: boolean;
    error: Error | null;
  };
  giftcardTemplate: {
    byId: { [id: number]: GiftcardTemplate };
    allIds: Array<number>;
    list: ErrorAndLoading;
    instances: ErrorAndLoading;
  } & ErrorAndLoading;
};

export type WithGiftcard<T> = T & { giftcard: Giftcard | null };
export type WithSender<T> = T & { src_member: Member | null };
export type WithReceiver<T> = T & { dst_member: Member | null };
