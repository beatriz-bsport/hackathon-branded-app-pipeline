import type { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import { GIFTCARD_TYPES } from '../constants';

// ========== BO/MA ==========

// ----- Variants (card_type) -----

type GiftcardType = (typeof GIFTCARD_TYPES)[keyof typeof GIFTCARD_TYPES];

type GiftcardFixedAmount = {
  price: string;
  min_price: null;
  max_price: null;
  card_type: typeof GIFTCARD_TYPES.FIXED;
};

type GiftcardCustomAmount = {
  price: null;
  min_price: number;
  max_price: number;
  card_type: typeof GIFTCARD_TYPES.CUSTOM;
};

type GiftcardVariants<T extends GiftcardType | undefined = undefined> =
  T extends typeof GIFTCARD_TYPES.CUSTOM
    ? GiftcardCustomAmount
    : T extends typeof GIFTCARD_TYPES.FIXED
    ? GiftcardFixedAmount
    : GiftcardFixedAmount | GiftcardCustomAmount;

// ----- Final models -----

/**
 * Shared base between Giftcard and GiftcardTemplate
 */
type GiftcardBase = {
  amount_gifted: string;
  available_payment_method_identifiers: Array<number>;
  cover: string;
  description: string;
  disabled: boolean;
  expiration_days: number | null;
  id: number;
  is_shared_giftcard: boolean;
  manager_only: boolean;
  name: string;
};

/**
 * Generic typing (default): `Giftcard`
 *
 * Typing for a Custom Amount Giftcard: `Giftcard<typeof GIFTCARD_TYPES.CUSTOM>` or `Giftcard<"Free Amount">`
 *
 * Typing for a Fixed Amount Giftcard: `Giftcard<typeof GIFTCARD_TYPES.FIXED>` or `Giftcard<"Fixed">`
 *
 * @todo Remove V2 when all usages of legacy Giftcard have been removed
 */
export type GiftcardV2<T extends GiftcardType | undefined = undefined> = {
  company: number;
  bookkeeping_account: number | null;
  tags_on_consumer_item_creation: Array<number>;
  date_updated: string | null;
} & GiftcardBase &
  GiftcardVariants<T>;

/**
 * Generic typing (default): `GiftcardTemplate`
 *
 * Typing for a Custom Amount GiftcardTemplate: `GiftcardTemplate<typeof GIFTCARD_TYPES.CUSTOM>` or `GiftcardTemplate<"Free Amount">`
 *
 * Typing for a Fixed Amount GiftcardTemplate: `GiftcardTemplate<typeof GIFTCARD_TYPES.FIXED>` or `GiftcardTemplate<"Fixed">`
 *
 * @todo Remove V2 when all usages of legacy GiftcardTemplate have been removed
 */
export type GiftcardTemplateV2<T extends GiftcardType | undefined = undefined> =
  {
    franchisor: number;
    companies: number[];
  } & GiftcardBase &
    GiftcardVariants<T>;

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

export type GiftcardBackgroundImage = {
  id: number;
  image: string; // url
};

// ========== CONSUMER ==========

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
