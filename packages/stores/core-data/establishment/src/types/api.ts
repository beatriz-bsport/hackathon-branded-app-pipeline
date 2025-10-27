//#region Establishment Group

// Query parameters
export type FetchEstablishmentGroupQueryParams = {
  // Pagination
  page?: number;
  page_size?: number; // Default: MAX_ESTABLISHMENT_GROUP_PER_COMPANY

  // Fuzzy search
  search?: string; // Searches in 'name' field
  companyId?: number; // Required for fuzzy search

  // Ordering
  ordering?: string;
};

// URL search params (string representation)
export type SearchEstablishmentGroupSearchParams = {
  q?: string;
} & FetchEstablishmentGroupQueryParams;

//#endregion

//#region Establishment

export type FetchEstablishmentParams = {
  page?: number;
  page_size?: number;
  id__in?: number[];
};

export type SearchEstablishmentParams = FetchEstablishmentParams & {
  q: string;
};

//#endregion
