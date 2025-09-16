import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import { API_URL } from "./constants";

const ITEM_API_URL = `${API_URL}/item`;

export type FetchWebshopItemsParams = {
  /** Page number of the results (for pagination). */
  page?: number;

  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Exclude items whose IDs are in this list. */
  id__not_in?: number[];

  /**
   * If true, include items that are:
   * - `sell_only_on_provision = false`, or
   * - `sell_only_on_provision = true` with a positive quantity.
   */
  as_consumer?: boolean;

  /**
   * Only include items linked to this ShopItemTemplate, including variants
   * where the base item belongs to the same template.
   */
  base_shop_item_template?: number;

  /**
   * If true, include only items where `is_buyable = true`
   * (filters out base items, keeps standalone or variant items).
   */
  buyable_shop_item?: boolean;

  /** If defined, include only items belonging to the provided category */
  category?: number;
};

export const fetchWebshopItemsAPI = (
  params: FetchWebshopItemsParams,
): ApiConfig => {
  const { page_size, page, category, ...otherParams } = params ?? {};

  const finalParams = {
    page_size: page_size ?? DEFAULT_PAGE_SIZE,
    page: page ?? DEFAULT_PAGE,
    ...otherParams,
    ...(category ? { subshop: category } : {}),
  };

  return [`${ITEM_API_URL}/${buildUrlParams(finalParams)}`];
};

export type SearchWebshopItemsParams = Omit<
  FetchWebshopItemsParams,
  "page" | "page_size"
> & { q: string };

export const searchWebshopItemsAPI = (
  params: SearchWebshopItemsParams,
): ApiConfig => {
  const { category, ...otherParams } =
    params ?? ({} as SearchWebshopItemsParams);
  const finalParams = {
    ...otherParams,
    ...(category ? { subshop: category } : {}),
  };
  return [`${ITEM_API_URL}/search/${buildUrlParams(finalParams)}`];
};
