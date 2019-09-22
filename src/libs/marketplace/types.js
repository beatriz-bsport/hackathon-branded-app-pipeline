// @flow

export type Offer = {
  id: number,
  activity: number,
  available: boolean,
  coach_override: number,
  credit_price_override: number,
  date_start: string,
  duration_minute: number,
  effectif: number,
  establishment_override: number,
  recurrence_id: number,
  waiting_list_max_size: number,
  bookings: string,
  booking_options: number,
};
export type Establishment = {
  id: number,
  location: {
    address: string,
    latitude: string,
    longitude: string,
  },
  title: string,
  slug: string,
  cover: string,
  specific_info: string,
  practical_info: string,
  customer_enabled: boolean,
  city: number,
  easy_access: number,
};
export type Activity = {
  id: number,
  SCT: number,
  coach: number,
  company: number,
  establishment: string,
  level: number,
  meta_activity: number,
  credit_price: number,
};
export type Coach = {
  id: number,
  name: string,
  avatar: string,
  medianRating: string,
  description: string,
  instagram_url: string,
  facebook_url: string,
};
export type MetaActivity = {
  id: number,
  name: string,
  cover_main: string,
  rating: string,
  SCT: number,
  next_slot: string,
  company: number,
  description: string,
  last_booking_minutes: number,
  last_discard_minutes: number,
};

export type Level = {
  id: number,
  name: string,
};

export type PaymentPack = {
  id: number,
  name: string,
  price: string,
  base_price: string,
  tax: string,
  credits: number,
  unlimited: boolean,
  max_bookings_per_week: number,
  validity_daterange: *,
  duration_days: ?number,
  duration_months: ?number,
  duration_years: ?number,
  disabled: boolean,
  manager_only: boolean,
  new_member_only: boolean,
  company: number,
  SCTs: Array<number>,
  metaActivities: Array<number>,
  establishments: Array<number>,
  categories: Array<number>,
};

export type MarketPlaceState = {
  offers: {
    items: Array<Offer>,
    loading: boolean,
    error: ?Error,
  },
  metaActivities: {
    items: Array<MetaActivity>,
    loading: boolean,
    error: ?Error,
  },
  coaches: {
    items: Array<Coach>,
    loading: boolean,
    error: ?Error,
  },
  establishments: {
    items: Array<Establishment>,
    loading: boolean,
    error: ?Error,
  },
  paymentPack: {
    items: Array<PaymentPack>,
    loading: boolean,
    error: ?Error,
  },
};
