// #region Appointment Pass

export type FetchAppointmentPassesParams = {
  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;

  /** Include only appointment passes whose IDs are in this list. */
  id__in?: number[];

  /** Filter appointment passes within
   * - the specified category if it's an id
   * - items without category if it's unset
   * - all items if not passed
   */
  category?: number | "unset" | undefined;
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

  /** Include only appointment pass categories whose IDs are in this list. */
  id__in?: number[];
};

// #endregion
