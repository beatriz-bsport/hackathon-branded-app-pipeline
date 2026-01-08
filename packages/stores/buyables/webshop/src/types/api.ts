// #region Item

export type FetchWebshopItemsParams = {
  /** Page number of the results (for pagination). */
  page?: number;

  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Include only webshop items whose IDs are in this list. */
  id__in?: number[];

  /** Include or exclude base shop items */
  is_base_item?: boolean;

  /** Include or exclude variant items */
  is_variant?: boolean;

  /** Include only items matching the provided color */
  color?: string;

  /** Include only items matching the provided size */
  size?: string;

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

  /** Filter webshop items within
   * - the specified category if it's an id
   * - items without category if it's unset
   * - all items if not passed
   */
  category?: number | "unset" | undefined;
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

  /** Include only webshop categories whose IDs are in this list. */
  id__in?: number[];
};

// #endregion
