export type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type GoogleGeocodingResult = {
  address_components: GoogleAddressComponent[];
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
    location_type: string;
  };
  place_id: string;
  types: string[];
};

export type GoogleGeocodingResponse = {
  results: GoogleGeocodingResult[];
  status: string;
};

export type AddressSuggestion = {
  place_id: string;
  generated_address: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  country_code: string;
  geometry: { x: number; y: number };
};
