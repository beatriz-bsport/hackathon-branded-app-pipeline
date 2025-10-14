// #region Appointment Pass

export type FetchAppointmentPassesParams = {
  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;

  /** Include only appointment passes whose IDs are in this list. */
  id__in?: number[];

  /** Filter passes within this category. */
  /**
   * @todo To be implemented in the backend
   * https://linear.app/bsport/issue/COR-799/packs-creation-step-5-allow-to-filter-on-category-for-items
   */
  category?: number | "none";
};

export type SearchAppointmentPassesParams = {
  q: string;
} & Omit<FetchAppointmentPassesParams, "page" | "page_size">;

// #endregion

// ----------------------------------------------------------------------------

// #region Category

export type FetchAppointmentPassCategoriesParams = {
  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;
};

// #endregion
