export type FetchEstablishmentGroupParams = {
  // Pagination
  page?: number;
  page_size?: number;

  // Fuzzy search
  search?: string;
  companyId?: number;

  // Ordering
  ordering?: string;
  id__in?: number[];
};

export type SearchEstablishmentGroupParams = {
  q?: string;
} & FetchEstablishmentGroupParams;

// Core EstablishmentGroup model
// Already defined in establishments/types.ts, re-export for convenience
export type { EstablishmentGroup } from "#src/establishments/types";
