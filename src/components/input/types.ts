interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
}

export interface GeocodingResult {
  address_components?: AddressComponent[];
  formatted_address?: string;
  geometry?: Geometry;
  place_id?: string;
  types?: string[];
}
