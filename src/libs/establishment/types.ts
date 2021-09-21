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
  establishmentGroup: {
    byId: { [key: number]: EstablishmentGroup };
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

export type EstablishmentGroupByAddress = {
  address: string;
  establishmentList: Array<Establishment>;
};

export type EstablishmentListGroupByAddress = Array<EstablishmentGroupByAddress>;
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

export type EstablishmentBillingGroup = {
  id: number;
  name: string;
  company_id: number;
  establishments: Array<Establishment>;
};

export type EstablishmentBillingGroupAPI = {
  id: number;
  name: string;
  company_id: number;
  establishments: Array<number>;
};
