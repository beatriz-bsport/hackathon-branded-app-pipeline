import type { URLParams } from "@bsport/store-base";

/**
 * Video purchase returned by `/vod/video_purchase/`.
 */
export type VideoPurchase = {
  id: number;
  consumer_payment_pack: number | null;
  private_consumer_pass: number | null;
  video: number;
  credit_price_payed?: number;
  member_id: number;
  date_created: string;
  available: boolean;
};

/**
 * Query parameters for listing video purchases.
 */
export type FetchVideoPurchasesParams = {
  video?: number;
  member_id?: number;
  page?: number;
  page_size?: number;
  ordering?: string;
} & URLParams;
