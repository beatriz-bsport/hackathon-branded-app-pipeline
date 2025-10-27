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
