// #region Params

export type FetchEstablishmentParams = {
  page?: number;
  page_size?: number;
  id__in?: number[];
  disabled?: boolean;
  company?: number;
};

export type SearchEstablishmentParams = FetchEstablishmentParams & {
  q: string;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Models

export type EstablishmentLocation = {
  address: string;
  address_line_1: string;
  address_line_2: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  geometry: string;
  geocoded_data: Record<string, string>;
};

export type EstablishmentEasyAccess = {
  id: number;
  lines: string[];
  name: string;
};

// Model : Etablissement
// Serializer : EstablishmentSerializer
export type Establishment = {
  id: number;
  title: string;
  cover: string | null;
  location: EstablishmentLocation;
  specific_info: string;
  easy_access: EstablishmentEasyAccess;
  associatedestablishment_set: number[];
  related_company: number;
  tzname: string;
  practical_info: string;
  capacity: number;
  disabled: boolean;
  has_next_slots: boolean;
  establishment_billing_group_id: number | null;
  wellhub_gym: string;
  usc_location_id: number | null;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Mutations

// Write shape for the establishment location. Differs from the read model
// (`EstablishmentLocation`): the backend derives latitude/longitude from a
// writable `geometry: { x, y }` point and ignores the read-only lat/long fields.
export type EstablishmentLocationInput = {
  address?: string;
  address_line_1?: string;
  address_line_2?: string;
  zipcode?: string;
  city?: string;
  state?: string;
  country?: string;
  country_code?: string;
  geometry: { x: number; y: number };
  geocoded_data?: Record<string, string>;
};

export type CreateEstablishmentPayload = {
  title: string;
  location: EstablishmentLocationInput;
  specific_info?: string;
  practical_info?: string;
  capacity?: number;
  // Company + timezone are derived server-side from the authenticated user.
  related_company?: number;
  tzname?: string;
  cover?: File | string | null;
};

export type UpdateEstablishmentPayload = Partial<CreateEstablishmentPayload>;

export type CheckDeleteEstablishmentData = {
  can_destroy: boolean;
  has_upcoming_offers: boolean;
  has_upcoming_private_bookings: boolean;
  establishment_billing_group: {
    is_exclusive: boolean;
    establishment_billing_group_id?: number;
    establishment_billing_group_name?: string;
  };
  establishment_group: {
    has_related_establishment_groups: boolean;
    exclusive_establishment_groups: {
      establishment_group_id: number;
      establishment_group_name: string;
    }[];
  };
  private_service: {
    has_related_private_services: boolean;
    exclusive_private_services: {
      private_service_id: number;
      private_service_name: string;
    }[];
  };
  staff_location: {
    has_related_staff_configurations: boolean;
    has_exclusive_staff_configurations: boolean;
  };
  coach_availability_slot: {
    has_related_coach_availability_slots: boolean;
    exclusive_coaches: {
      coach_id: number;
      coach_name: string;
    }[];
  };
  associated_coach: {
    has_related_associated_coaches: boolean;
    exclusive_coaches: {
      coach_id: number;
      coach_name: string;
    }[];
  };
  payment_pack: {
    related_payment_packs: {
      payment_pack_id: number;
      payment_pack_name: string;
    }[];
    exclusive_payment_packs: {
      payment_pack_id: number;
      payment_pack_name: string;
    }[];
  };
  has_related_availability_slots: boolean;
  has_related_zoom_establishment: boolean;
  marketplace_component_config: {
    has_related_marketplace_component_configs: boolean;
    has_exclusive_marketplace_component_configs: boolean;
  };
  is_integrated_in_partnership: boolean;
  has_related_marketing_notifications: boolean;
};

// #endregion
