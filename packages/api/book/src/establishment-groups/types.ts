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
  establishment: number[];
};

// ----------------------------------------------------------------------------

export type CreateEstablishmentGroupPayload = {
  name: string;
  establishment: number[];
};

export type UpdateEstablishmentGroupPayload =
  Partial<CreateEstablishmentGroupPayload>;

export type CheckDeleteEstablishmentGroupData = {
  can_destroy: boolean;
  has_related_staff_configurations: boolean;
  associated_coach: {
    has_related_associated_coaches: boolean;
    exclusive_coaches: {
      coach_id: number;
      coach_name: string;
    }[];
  };
  marketplace_component_config: {
    has_related_marketplace_component_configs: boolean;
    has_exclusive_marketplace_component_configs: boolean;
  };
  has_related_marketing_notifications: boolean;
};
