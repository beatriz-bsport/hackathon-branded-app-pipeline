// #region Models

/**
 * Model: PaymentPackCategory
 * Serializer: PaymentPackCategorySerializer
 */
export type PassCategory = {
  id: number;
  name: string;
  company_id: number;
  category_ordering: number;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Params

export type FetchPassCategoriesParams = {
  page?: number;
  page_size?: number;
  id__in?: number[];
};

// #endregion
