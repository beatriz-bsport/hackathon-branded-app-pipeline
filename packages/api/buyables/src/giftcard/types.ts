import { type URLParams } from "@bsport/store-base";

export const GIFTCARD_TYPES = {
  CUSTOM: "Free Amount", // Backend constraint
  FIXED: "Fixed",
} as const;

// ----- Variants (type) -----

export type GiftcardType = (typeof GIFTCARD_TYPES)[keyof typeof GIFTCARD_TYPES];

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

export type GiftcardVariants<T extends GiftcardType | undefined = undefined> =
  T extends typeof GIFTCARD_TYPES.CUSTOM
    ? GiftcardCustomAmount
    : T extends typeof GIFTCARD_TYPES.FIXED
      ? GiftcardFixedAmount
      : GiftcardFixedAmount | GiftcardCustomAmount;

// ----- Shared base -----

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

// ----- Models -----

/**
 * Generic typing (default): `Giftcard`
 *
 * Typing for a Custom Amount Giftcard: `Giftcard<typeof GIFTCARD_TYPES.CUSTOM>` or `Giftcard<"Free Amount">`
 *
 * Typing for a Fixed Amount Giftcard: `Giftcard<typeof GIFTCARD_TYPES.FIXED>` or `Giftcard<"Fixed">`
 */
export type Giftcard<T extends GiftcardType | undefined = undefined> = {
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
 */
export type GiftcardTemplate<T extends GiftcardType | undefined = undefined> = {
  franchisor: number;
  companies: number[];
} & GiftcardBase &
  GiftcardVariants<T>;

export type GiftcardImage = {
  id: number;
  image: string; // url
};

export type GiftcardBackgroundListResponse = Array<GiftcardImage>;

// ----- Params -----

export type FetchGiftcardsParams = {
  page: number;
  page_size: number;
  disabled: boolean;
} & URLParams;

export type FetchGiftcardImagesParams = {
  page: number;
  page_size: number;
  company: number;
};

export type UploadGiftcardImageParams = {
  file: File;
  signal: AbortSignal;
  onUploadProgress: (progressEvent: ProgressEvent) => void;
};
