export type FetchEstablishmentGroupQueryParams = {
  // Pagination
  page?: number;
  page_size?: number; // Default: MAX_ESTABLISHMENT_GROUP_PER_COMPANY

  // Fuzzy search
  search?: string; // Searches in 'name' field
  companyId?: number; // Required for fuzzy search

  // Ordering
  ordering?: string;
  id__in?: number[];
};

export type SearchEstablishmentGroupSearchParams = {
  q?: string;
} & FetchEstablishmentGroupQueryParams;

// Core EstablishmentGroup model
// Model : EstablishmentGroup
// Serializer : EstablishmentGroupSerializer
export type EstablishmentGroup = {
  id: number;
  name: string;
  company_id: number;
  date_created: string; // ISO datetime
  date_updated?: string; // ISO datetime
  disabled?: boolean;
};
