// @flow

type Location = {
  address: string,
  latitute: string,
  longitude: string,
};

type EasyAccess = {
  id: number,
  lines: Array<string>,
  name: string,
};

export type Establishment = {
  id: number,
  title: string,
  cover: string,
  location: Location,
  specific_info: string,
  easy_access: EasyAccess,
};

type Event_ = {
  date_start: string,
  duration_minutes: number,
  available: boolean,
  activity: number,
  id: number,
  price: string,
};

export type EstablishmentWithOffers = {
  ...Establishment,
  events: Array<Event_>,
};

export type AssociatedEstablishment = {
  id: number,
  establishment: number,
  company: number,
};

export type EstablishmentState = {
  byId: { [number]: Establishment },
  allIds: Array<number>,
  associatedEstablishment: {
    items: Array<AssociatedEstablishment>,
    loading: boolean,
    error: ?Error,
  },
  loading: boolean,
  error: ?Error,
  detail: {
    loading: boolean,
    error: ?Error,
  },
  upsert: {
    loading: boolean,
    error: ?Error,
  },
  // Update
  updated: boolean,
};
