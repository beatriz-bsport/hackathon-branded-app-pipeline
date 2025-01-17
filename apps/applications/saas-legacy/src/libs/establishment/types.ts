export type Location = {
  address: string;
  latitude: string;
  longitude: string;
};

export type EasyAccess = {
  id: number;
  lines: Array<string>;
  name: string;
};

export type Establishment = {
  associatedestablishment_set: number[];
  capacity?: number;
  cover: string;
  disabled: boolean;
  easy_access: EasyAccess;
  establishment_billing_group_id: number | null;
  has_next_slots?: boolean;
  id: number;
  location: Location;
  practical_info?: string;
  related_company?: number;
  specific_info: string;
  title: string;
  tzname: string;
  wellhub_gym?: string;
  usc_location_id?: string;
};

export type EstablishmentSelectOption = {
  label: string;
  value: string | number;
  establishmentList?: Establishment[];
};

export type EstablishmentWithAssociatedId = {
  id: number;
  title: string;
  cover: string;
  location: Location;
  specific_info: string;
  easy_access: EasyAccess;
  disabled: boolean;
  associatedestablishment_set: number[];
  tzname: string;
  establishment_billing_group_id: number | null;
  associated_establishment_id: number;
};

type Event_ = {
  date_start: string;
  duration_minutes: number;
  available: boolean;
  activity: number;
  id: number;
  price: string;
};

export type EstablishmentWithOffers = {
  events: Array<Event_>;
} & Establishment;

export type AssociatedEstablishment = {
  id: number;
  establishment: number;
  company: number;
  disabled: boolean;
  partnership_merged_as: number;
};

export type EstablishmentState = {
  byId: { [key: string]: Establishment };
  allIds: Array<number>;
  associatedEstablishment: {
    items: Array<AssociatedEstablishment>;
    loading: boolean;
    error?: Error;
  };
  loading: boolean;
  error?: Error;
  detail: {
    loading: boolean;
    error?: Error;
  };
  favorite: {
    loading: boolean;
    error?: Error;
    id: string;
  };
  upsert: {
    loading: boolean;
    error?: Error;
  };
  bulkRetrieve: {
    loading: boolean;
    error?: Error;
  };
  updated: boolean;
  establishmentGroup: {
    byId: { [key: number]: EstablishmentGroupAPI };
    allIds: Array<number>;
    loading: boolean;
    error?: Error;
    upsert: {
      loading: boolean;
      error?: Error;
    };
  };
  establishmentBillingGroup: {
    byId: { [key: number]: EstablishmentBillingGroup };
    allIds: Array<number>;
    loading: boolean;
    error?: Error;
    upsert: {
      loading: boolean;
      error?: Error;
    };
  };
  byAssociatedEstablishmentId: { [key: number]: Establishment };
};

export type EstablishmentAddressInput = {
  address: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string;
  zipcode: string;
  state: string;
  location: object;
};

export type EstablishmentGroupByAddress = {
  address: string;
  establishmentList: Array<Establishment>;
};

export type EstablishmentListGroupByAddress =
  Array<EstablishmentGroupByAddress>;
export type EstablishmentGroupAPI = {
  id?: number;
  name: string;
  company_id?: number;
  establishment: Array<number>;
};

export type EstablishmentGroup = {
  id: number;
  name: string;
  company_id: number;
  establishment: Array<Establishment>;
};

export type EstablishmentGroupSelectOption = {
  label: string;
  value: number | string;
  establishmentGroupList?: EstablishmentGroup[];
};

export type EstablishmentBillingGroup = {
  id: number;
  name: string;
  company_id: number;
  establishments: Array<Establishment>;
  address: string;
  disabled: boolean;
};

export type EstablishmentBillingGroupAPI = {
  id: number;
  name: string;
  company_id: number;
  establishments: Array<number>;
  address: string;
  disabled: boolean;
};

export type WithEstablishment<T> = T & { establishment: Establishment };

export type WithEstablishmentBillingGroup<T> = T & {
  establishment_billing_group: EstablishmentBillingGroup;
};

export type FetchEstablishmentParams = {
  id__in?: number[];
  associated_establishment__in?: number[];
  meta_activity?: number;
  company?: number;
  franchisor?: number;
  ordering?: string;
  disabled?: boolean;
  with_workshop?: boolean;
  page_size?: number;
};

/**
 * Represents the location details of an establishment as defined in EstablishmentLocationSerializer of bsport-django.
 */
type EstablishmentLocation = {
  address_line_1: string;
  address_line_2: string;
  address: string;
  city: string;
  country_code: string;
  country: string;
  geocoded_data: GeocodedData;
  geometry: string | null;
  latitude: number;
  longitude: number;
  state: string;
  zipcode: string;
};

type Geometry = {
  location_type: string;
  location: LocationMinimal;
  place_id: string;
  viewport: Viewport;
};

type LocationMinimal = {
  lat: number;
  lng: number;
};

type Viewport = {
  northeast: LocationMinimal;
  southwest: LocationMinimal;
};

type GeocodedData = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: PlusCode;
  types: string[];
};

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PlusCode = {
  global_code: string;
  compound_code: string;
};

/**
 * Represents the minimal details of an establishment as defined in EstablishmentSerializerOld of bsport-django.
 */
export type EstablishmentMinimal = {
  city: City;
  cover_thumbnail: string | null;
  cover: string | null;
  id: number;
  location: EstablishmentLocation;
  slug: string;
  title: string;
  tzname: string;
};

type City = {
  name: string;
  slug: string;
};
