// #region Pass

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

  /** Filter passes within
   * - the specified category if it's an id
   * - items without category if it's unset
   * - all items if not passed
   */
  category?: number | "unset" | undefined;

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

export type SearchPassesParams = Omit<
  FetchPassesParams,
  "page" | "page_size"
> & { q: string };

// #endregion

// ----------------------------------------------------------------------------

// #region PassCategory

export type FetchPassCategoriesParams = {
  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;
};

// #endregion
