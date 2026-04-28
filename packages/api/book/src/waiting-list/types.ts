// === Query Parameters (GET list) ===

export type BookingOptionListParams = {
  consumer?: number;
  offer?: number;
  is_convertible?: boolean;
  company?: number;
  mine?: boolean;
  min_date?: string; // ISO date string, e.g. "2026-04-28"
  member?: number;
  offer_is_workshop?: boolean;
  as_manager?: string;
  no_related_field?: string;
  ordering?: "offer__date_start" | "-offer__date_start";
  page?: number;
  page_size?: number;
};

// === API Response Types === GET waiting-list/booking-option/
export type BookingOption = {
  id: number;
  waiting_list_class: number;
  is_convertible: boolean;
  date: string; // ISO datetime
  consumer: number;
  offer: number;
  cancelled: boolean;
  booking: number | null;
  member: number;
  object_type: "booking";
  level: number;
  establishment: number;
  coach: number;
  meta_activity: number;
  source: number;
};

export type WaitingListPosition = {
  member_position: number;
  waiting_list_size: number;
};

export type BookingOptionPosition = {
  id: number;
  waiting_list_position: WaitingListPosition;
};

// GET waiting-list/booking-option/{id}/

export type BookingOptionDetail = Omit<BookingOption, "offer"> & {
  offer: OfferDetails; // nested object
};

// Types below are not directly related to the waiting list but are used to properly type the booking option
// returned by the detail endpoint.
interface OfferDetails {
  id: number;
  activity: ActivitySummary;
  coach_override: Coach;
  date_start: string;
  duration_minute: number;
  date_end: string;
  price: number;
  credit_price: number;
  credit_price_override: number | null;
  available: boolean;
  friends: [];
  is_full: boolean;
  is_waiting_list_full: boolean;
  group: number;
  timezone_name: string;
  linked_hybrid_offer_id: number | null;
  name_override: string | null;
  description_override: string | null;
}

type Coach = {
  id: number;
  name: string;
  rating: number;
  age: number;
  photo: string | null;
} | null;

type ActivitySummary = {
  id: number;
  meta_activity_id: number | null;
  name: string;
  cover_main: string | null;
  cover_thumbnail: string | null;
  easy_access: {
    id: number;
    lines: string[];
    name: string;
  };
  level: string;
  level_id: number;
  rating: string;
  category: string;
  parent_category: number;
  price_range: number;
  participants: [];
  etablissement: EstablishmentOld;
  coach: Coach;
  next_slot: string | null;
  is_loved: boolean;
  common_price: number | null;
  next_price: number | null;
  company: number;
  company_name: string;
};

interface EstablishmentOld {
  id: number;
  title: string;
  slug: string;
  city: City;
  cover: string | null;
  cover_thumbnail: string | null;
  location: EstablishmentLocation;
  tzname: string;
}
interface City {
  slug: string;
  name: string;
}
interface EstablishmentLocation {
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
  geometry: string; // GeoJSON / WKT point
  geocoded_data: object | null;
}
