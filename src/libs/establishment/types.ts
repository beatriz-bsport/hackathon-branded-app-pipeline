type Location = {
  address: string;
  latitude: string;
  longitude: string;
};

type EasyAccess = {
  id: number;
  lines: Array<string>;
  name: string;
};

export type Establishment = {
  id: number;
  title: string;
  cover: string;
  location: Location;
  specific_info: string;
  easy_access: EasyAccess;
  disabled: boolean;
  associatedestablishment_set: number[];
  tzname: string;
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
};

export type establishmentAddressInput = {
  address: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string;
  zipcode: string;
  location: object;
};
