import { ErrorAndLoading } from '../types';
import { Establishment } from '../establishment/types';
import { MetaActivity } from '../meta-activity/types';
import { Coach } from '../associated-coach/types';

export type OfferFilter = {
  establishments?: number[];
  coaches?: number[];
  levels?: number[];
  metaActivities?: number[];
  available?: boolean;
};

export type OfferFilterData = {
  establishment__in?: number[];
  coach__in?: number[];
  level__in?: number[];
  activity__in?: number[];
};

//
// export type ActivitySimplified = {
//   id: number,
//   parent_category: number,
//   meta_activity_id: number,
//   name: string,
//   level: number,
//   etablissement: Establishment,
//   next_slot: string,
//   coach: Profile,
// };

export type OfferMinimal = {
  date_start: string;
  duration_minute: number;
  available: boolean;
  establishment: number;
  coach: number;
  activity: number;
  meta_activity: number;
  id: number;
  price: number;
  timezone_name: string;
};

export type Offer<C = number, E = number, M = number> = {
  company: number;
  activity: number;
  available: boolean;
  title: string;
  id: number;
  activity_id: number;
  category: string;
  waiting_list_max_size: number;
  coach_override?: C;
  coach: C;
  cover_main: string;
  date_end: string;
  date_start: string;
  effectif: number;
  level: string;
  level_id: number;
  meta_activity_id: number;
  name: string;
  nb_option: number;
  nb_bookings: number;
  parent_category: number;
  price: number;
  price_coach: number;
  credit_price: number;
  is_full: boolean;
  establishment_override?: E;
  establishment: E;
  meta_activity: M;
  timezone_name: string;
};

export type Offer_FULL = Offer<Coach, Establishment, MetaActivity>;

type OfferDancing = {
  id: number;
  nb_booked_female: number;
  nb_booked_male: number;
  nb_booked_other: number;
};

export type OfferStatus = {
  offer_status: number;
  bookable_status: number;
  waiting_list_status: number;
};

export type OfferState = ErrorAndLoading & {
  calendarByObject: ErrorAndLoading & {
    metaActivity: number[];
    establishment: number[];
  };
  managerFilter: {
    open: boolean;
    filters: OfferFilter;
  };
  byId: { [key: string]: Offer };
  calendar: OfferMinimal[];
  lastFetched: Date;
  byDay: ErrorAndLoading & { allIds: number[] };
  retrieve: ErrorAndLoading & { data: Offer | null };
  bulk: ErrorAndLoading;
  similarOffers: ErrorAndLoading & {
    items: Offer[];
    lastFetched: Date | null;
    next_page: number;
  };
  compatiblePacks: ErrorAndLoading & { items: any[]; lastFetched: Date | null };
  marketplace: ErrorAndLoading & { allIds: number[] };
  genderCount: ErrorAndLoading & {
    byId: { [key: string]: OfferDancing };
    allIds: number[];
  };
  offerStatus: ErrorAndLoading & {
    byId: { [key: string]: OfferStatus };
  };
};
