// #region Models

/**
 * Model: PrivatePassCategory
 * Serializer: PrivatePassCategorySerializer
 */
export type AppointmentPassCategory = {
  id: number;
  name: string;
  company_id: number;
  category_ordering: number;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Params

export type FetchAppointmentPassCategoriesParams = {
  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;

  /** Include only appointment pass categories whose IDs are in this list. */
  id__in?: number[];
};

// #endregion
