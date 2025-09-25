import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import { API_URL } from "./constants";

const PASS_API_URL = `${API_URL}/payment-pack`;

export type FetchPassesParams = {
  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;

  /**
   * If true, annotate each Pass with the number of related Consumer Passes.
   */
  count_consumer_payment_packs?: boolean;

  /** Filter passes by their `disabled` field value. */
  disabled?: boolean;

  /** Filter passes within this category. */
  category?: number; // @todo To be implemented in the backend

  /** Include only passes whose IDs are in this list. */
  id__in?: number[];

  /** Exclude passes whose IDs are in this list. */
  id__not_in?: number[];

  /** Include passes compatible with the specified MetaActivity. */
  meta_activity?: number;

  /** Include passes compatible with the specified Offer. */
  offer?: number;

  /** Include passes with VOD (video on demand) access. */
  video?: number;

  /**
   * If true, include expired passes.
   * If false, exclude expired passes.
   */
  include_expired?: boolean;

  /** Filter passes by the `new_member_only` field value. */
  new_member_only?: boolean;
};

export const fetchPassesAPI = (params?: FetchPassesParams): ApiConfig => {
  const { page_size, page, ...otherParams } = params ?? {};
  const finalParams = {
    page_size: page_size ?? DEFAULT_PAGE_SIZE,
    page: page ?? DEFAULT_PAGE,
    ...otherParams,
  };
  return [`${PASS_API_URL}/${buildUrlParams(finalParams)}`];
};

export type SearchPassesParams = Omit<
  FetchPassesParams,
  "page" | "page_size"
> & { q: string };

export const searchPassesAPI = (params?: SearchPassesParams): ApiConfig => {
  return [`${PASS_API_URL}/search/${buildUrlParams(params ?? {})}`];
};
