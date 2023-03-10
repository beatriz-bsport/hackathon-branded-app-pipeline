import { ErrorAndLoading } from '../types';
import { Establishment } from '../establishment/types';
import { MetaActivity } from '../meta-activity/types';
import { Coach } from '../associated-coach/types';
import { OffersGroup } from '#libs/group-offer/types';

export type OfferFilter = {
  establishments?: number[];
  coaches?: number[];
  levels?: number[];
  metaActivities?: number[];
  establishmentGroup?: number[];
  available?: boolean;
};

export type OfferFilterData = {
  establishment__in?: number[];
  coach__in?: number[];
  level__in?: number[];
  activity__in?: number[];
  establishment_group__in?: number[];
  page?: number;
  page_size?: number;
  whitelist_tags_id__in?: number[];
  blacklist_tags_id__in?: number[];
  with_group?: boolean;
  with_tags?: boolean;
  group_id__in?: number[];
  id__in?: number[];
  ignore_manager_only?: boolean;
  similars__coach_override__isnull?: boolean;
  similars__coach_override__ne?: number;
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

export type OfferMinimal<C = number, E = number, M = number, L = number> = {
  date_start: string;
  duration_minute: number;
  available: boolean;
  establishment: E;
  coach: C;
  coach_override: C;
  activity: number;
  meta_activity: M;
  id: number;
  price: number;
  timezone_name: string;
  level: L;
};

export type OfferDetail = {
  id: number;
  activity: MetaActivity;
  coach_override: Coach | null;
  date_start: string;
  duration_minute: number;
  date_end: string;
  price: number;
  credit_price: number;
  credit_price_override: number;
  available: boolean;
  friends: any[];
  is_full: boolean;
  is_waiting_list_full: boolean;
  timezone_name: boolean;
};

export type Offer<
  C = number,
  E = number,
  M = number,
  A = number,
  T = number,
  G = number,
  L = number,
> = {
  company: number;
  activity: A;
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
  level: L;
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
  room_blueprint?: number;
  whitelist_tags: Array<T>;
  blacklist_tags: Array<T>;
  duration_minute: number;
  group: G;
  allow_guest_offer: boolean;
  male?: number;
  female?: number;
  other?: number;
  roll_call_needs_validation: boolean;
  date_roll_call_last_modified?: string;
};

export type Offer_FULL = Offer<
  Coach,
  Establishment,
  MetaActivity,
  number,
  number,
  OffersGroup
>;

type OfferDancing = {
  id: number;
  nb_booked_female: number;
  nb_booked_male: number;
  nb_booked_other: number;
};

export type OfferStatus = {
  id: number;
  offer_status: number;
  bookable_status: number;
  waiting_list_status: number;
  taken_spots: number[];
  blocked_by_tags: boolean;
};

export type OfferState = ErrorAndLoading & {
  create: ErrorAndLoading;
  edit: ErrorAndLoading;
  calendarByObject: ErrorAndLoading & {
    metaActivity: number[];
    establishment: number[];
  };
  managerFilter: {
    open: boolean;
    filters: OfferFilter;
  };
  byId: { [key: string]: Offer };
  calendar: [];
  paginatedCalendar: {
    next_page: number;
    page: number;
    count: number;
    links: {
      next: string | null;
      previous: string | null;
    };
    results: OfferMinimal[];
  };
  lastFetched: Date;
  byDay: ErrorAndLoading & { allIds: number[] };
  retrieve: ErrorAndLoading & { data: Offer | null };
  bulk: ErrorAndLoading;
  similarOffers: ErrorAndLoading & {
    count: number;
    items: Offer[];
    lastFetched: Date | null;
    next_page: number;
  };
  next: ErrorAndLoading & {
    item?: Offer;
  };
  compatiblePacks: ErrorAndLoading & { items: any[]; lastFetched: Date | null };
  marketplace: ErrorAndLoading & {
    allIds: number[];
    byMetaActivity: {
      [id: number]: {
        count: number;
        nextPage: number;
        allIds: Array<number>;
      };
    };
  };
  genderCount: ErrorAndLoading & {
    byId: { [key: string]: OfferDancing };
    allIds: number[];
  };
  offerStatus: ErrorAndLoading & {
    byId: { [key: string]: OfferStatus };
  };
  registered: ErrorAndLoading & {
    allIds: number[];
  };
  numberOfMassDisabledOffer: ErrorAndLoading & {
    number: number;
  };
  numberOfMassDisabledOfferInGroup: ErrorAndLoading & {
    allIds: number[];
  };
  tagManagement: ErrorAndLoading;
  disable: ErrorAndLoading;
  delete: ErrorAndLoading;
  groups: Record<
    number,
    ErrorAndLoading & {
      allIds: number[];
    }
  > &
    ErrorAndLoading;
  bookingGuest: {
    bookingGuestNumberLeft: number;
  };
  hasPendingReplacementRequest: {
    byOfferId: Record<number, boolean>;
  } & ErrorAndLoading;
  hasRefusedReplacementRequest: {
    byOfferId: Record<number, boolean>;
  } & ErrorAndLoading;
  rollCall: ErrorAndLoading;
  rollCallBulk: ErrorAndLoading;
};
