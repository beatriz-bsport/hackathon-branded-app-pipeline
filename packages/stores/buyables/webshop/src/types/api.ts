// #region Item

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
  /**
   * @todo To be implemented in the backend
   * https://linear.app/bsport/issue/COR-799/packs-creation-step-5-allow-to-filter-on-category-for-items
   */
  category?: number | "none";
};

export type SearchWebshopItemsParams = Omit<
  FetchWebshopItemsParams,
  "page" | "page_size"
> & { q: string };

// #endregion

// ----------------------------------------------------------------------------

// #region Category

export type FetchWebshopCategoriesParams = {
  /** Page number of the results (for pagination). */
  page?: number;

  /** Number of items per page (for pagination). */
  page_size?: number;
};

// #endregion
