import type { WellhubProductId } from '#src/libs/wellhub/types';
import type {
  PartnershipOffer,
  PartnerSpotCappingStrategy,
} from '#src/libs/offer/types';
export type OfferPerformance = {
  id: number;
  nb_bookings: number;
  price_coach: number;
};

export type Profile = {
  name: string;
  first_name: string;
  last_name: string;
  photo: string;
  email: string;
  phonenumber: { phone_number: string };
};

export type Coach = {
  id: number;
  name: string;
  photo: string;
};

export type CoachWithNotes = Coach & {
  notes?: string;
};

export type SCS = {
  id: number;
  name: string;
};

export type ActivitySimplified = {
  id: number;
  parent_category: number;
  meta_activity_id: number;
  name: string;
  level: number;
  etablissement: Establishment;
  next_slot: string;
  coach: Profile;
};

export type Offer = {
  activity_id: number;
  activity: ActivitySimplified;
  allow_guest_offer: boolean;
  available: boolean;
  blacklist_tags: Array<number>;
  broadcast_link: string;
  category: string;
  coach_override?: CoachWithNotes;
  coach_payment_rule_id: number;
  coach: CoachWithNotes;
  cover_main: string;
  credit_price_override: number | null;
  credit_price: number;
  custom_level: number;
  date_end: string;
  date_start: string;
  description_override?: string;
  duration_minute: number;
  effectif: number;
  etablissement: {
    city: { name: string; slug: string };
    cover_thumnail: string;
    cover: string;
    id: number;
    location: { address: string; latitude: number; longitude: number };
    slug: string;
    title: string;
  };
  id: number;
  internal_note: string;
  level_id: number;
  level: string;
  linked_hybrid_offer_id: number | null;
  manager_only: boolean;
  meta_activity_id: number;
  meta_activity: number;
  name_override?: string;
  name: string;
  nb_bookings: number;
  nb_option: number;
  parent_category: number;
  partner_max_booking_count: number;
  partner_spot_capping_strategy?: PartnerSpotCappingStrategy;
  partnership_offers?: PartnershipOffer[];
  price_coach: number;
  price: number;
  room_blueprint: number;
  sync_on_spivi: boolean;
  title: string;
  usc_event_id?: string;
  waiting_list_max_size: number;
  wellhub_product_id?: WellhubProductId | null;
  whitelist_tags: Array<number>;
};

export type MetaActivity = {
  coaches: Array<Coach>;
  cover_main?: string;
  description: string;
  etablissements: Array<Establishment>;
  id: number;
  levels: Array<{ id: number; name: string }>;
  name: string;
  offers: Array<Offer>;
  parent_category: SCS;
};

export type User = {
  id: number;
  name: string;
  photo: string;
};
export type Booking = {
  attendance: boolean;
  date_start: string;
  date: string;
  id: number;
  nb_booking: number;
  offer: Offer;
  source: string;
  status?: boolean;
  user: User;
};

export type Consumer = {
  birthday: string;
  email: string;
  first_name: string;
  frequency?: Object;
  gender: string;
  id: number;
  is_coach: boolean;
  is_complete: boolean;
  is_consumer: boolean;
  last_name: string;
  phonenumber: { phone_number: string };
  photo?: string;
  situation?: Object;
  sports: Array<Object>;
};

export type PaymentPack = {
  id: number;
  unlimited: boolean;
  name: string;
  credits: number;
  base_price: number;
  tax: number;
  company: { name: string };
  max_bookings_per_week: number;
  max_bookings_per_month: number;
  validity_daterange?: { upper: string; lower: string };
  duration_days?: number;
  duration_months?: number;
  duration_years?: number;
  disabled: boolean;
  bookkeeping_account?: number;
};

export type Category = {
  id: number;
};

export type Location = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type Establishment = {
  id: number;
  cover: string;
  title: string;
  specific_info: string;
  activities: Array<ActivitySimplified>;
  location: Location;
};

export type CoachDetailed = {
  name: string;
  id: number;
  photo: string;
  phone: string;
  email: string;
  associated_coach_id: number;
  default_payment_rule_id?: number;
  activities: Array<ActivitySimplified>;
  birthday: string;
  gender: string;
  description: string;
};
