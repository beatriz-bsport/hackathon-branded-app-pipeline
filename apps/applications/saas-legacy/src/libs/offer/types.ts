/*
 * TODO update offer waiting list status codes
 *https://gitlab.com/bsport/bsport-saas/-/issues/2106
 */
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_LOCKED,
} from '@bsport/common/lib/master-data/bookable-status.js';
import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
} from '@bsport/common/lib/master-data/waiting-list-status.js';
import {
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_WAITING_LIST_STATUS_CONVERTIBLE,
  OFFER_BOOKABLE_STATUS_ALREADY_BOOKED,
  OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import type { ImmutableArray } from 'seamless-immutable';
import { OffersGroup } from '#src/libs/group-offer/types';
import { SpotInformation } from '#src/libs/spot-scheduling/types';
import { Level } from '#src/libs/level/types';
import { BroadcastInfo } from '#src/libs/booking/types';
import type { LuxonDateTime } from '#src/types';
import { ErrorAndLoading } from '../types';
import { Establishment, EstablishmentMinimal } from '../establishment/types';
import { MetaActivity } from '../meta-activity/types';
import { Coach, CoachMinimal } from '../associated-coach/types';
import { OFFER_RECURRENCE, BookingWindowStatus } from './constants';
import type { WellhubProductId } from '#src/libs/wellhub/types';

export type OfferFilter = {
  establishments?: number[];
  coaches?: number[];
  levels?: number[];
  available?: boolean;
  activity__in?: number[];
  establishment_group__in?: number[];
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

export type OfferBookingOption = {
  activity: MetaActivity;
  available: boolean;
  coach_override: Coach | null;
  credit_price_override: number;
  credit_price: number;
  date_end: string;
  date_start: string;
  description_override?: string;
  duration_minute: number;
  friends: any[];
  id: number;
  is_full: boolean;
  is_waiting_list_full: boolean;
  name_override?: string;
  price: number;
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
  activity_id: number;
  activity: A;
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  available: boolean;
  blacklist_tags: T[];
  booking_window_end_datetime?: string;
  booking_window_start_datetime?: string;
  booking_window_status?: BookingWindowStatus;
  broadcast_info?: BroadcastInfo;
  broadcast_link: string;
  category: string;
  coach_override?: C;
  coach_payment_rule_id: number | null;
  coach: C;
  company: number;
  cover_main: string;
  credit_price: number;
  custom_level: L;
  date_end: string;
  date_roll_call_last_modified?: string;
  date_start: string;
  description_override?: string;
  duration_minute: number;
  effectif: number;
  establishment: E;
  female?: number;
  full: boolean;
  group: G;
  id: number;
  internal_note?: string;
  is_broadcast: boolean;
  level_id: number;
  level: L;
  linked_hybrid_offer_id: number | null;
  male?: number;
  manager_only: boolean;
  meta_activity_id: number;
  meta_activity: M;
  name_override?: string;
  name: string;
  nb_bookings: number;
  nb_option: number;
  other?: number;
  parent_category: number;
  partner_max_booking_count: number;
  price_coach: number;
  price: number;
  recurrence_id: string;
  roll_call_needs_validation: boolean;
  room_blueprint?: number;
  source: number;
  sync_on_spivi?: boolean;
  tax?: number;
  timezone_name: string;
  title: string;
  validated_booking_count: number;
  waiting_list_max_size: number;
  whitelist_tags: T[];
};

/**
 * @description Represents an Offer following the REST API payload structure, excluding deprecated redux-selector pattern.
 */
export type OfferREST = {
  activity: number;
  activity_name: string;
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  available: boolean;
  blacklist_tags: number[];
  broadcast_link: string;
  category: number;
  coach_override: number | null;
  coach_payment_rule_id: number | null;
  coach: number;
  company: number;
  credit_price_override: number;
  credit_price: number;
  custom_level: number;
  date_roll_call_last_modified: string | null;
  date_start: string;
  duration_minute: number;
  effectif: number;
  establishment: number;
  full: boolean;
  group: number | null;
  has_spivi_booking_error: boolean;
  has_spivi_error: boolean;
  id: number;
  is_broadcast: boolean;
  level: number;
  manager_only: boolean;
  meta_activity_color: string | null;
  meta_activity: number;
  name_override: string | null;
  name: string;
  nb_attendant: number;
  nb_bookings: number;
  nb_non_attendant: number;
  nb_option: number;
  parent_category: number;
  partner_max_booking_count: number;
  roll_call_needs_validation: boolean;
  room_blueprint: number | null;
  source: number;
  sync_on_spivi: boolean;
  timezone_name: string;
  waiting_list_disabled: boolean;
  waiting_list_max_size: number;
  whitelist_tags: number[];
  booking_window_status?: BookingWindowStatus;
  booking_window_start_datetime?: string;
  booking_window_end_datetime?: string;
};

/**
 * @description Represents an Offer following the REST API payload structure, corresponding to the CoachOffersSaasSerializer in bsport-django.
 */
export type OfferSaas = {
  activity_id: number;
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  available: boolean;
  broadcast_info: BroadcastInfo | Record<string, never>;
  category: string;
  coach_override: CoachMinimal | null;
  coach: CoachMinimal;
  cover_main: string | null;
  credit_price_override: number;
  credit_price: number;
  custom_level: number;
  date_end: string;
  date_roll_call_last_modified: string | null;
  date_start: string;
  description_override: string | null;
  duration_minute: number;
  effectif: number;
  etablissement: EstablishmentMinimal;
  id: number;
  internal_note: string | null;
  is_broadcast: boolean;
  is_full: boolean;
  level_id: number;
  level: string;
  manager_only: boolean;
  meta_activity_color: string | null;
  meta_activity_id: number;
  name_override: string | null;
  name: string;
  nb_attendant: number;
  nb_bookings: number;
  nb_non_attendant: number;
  nb_option: number;
  next_offer: number | null;
  parent_category: number;
  previous_offer: number | null;
  price: number | null;
  price_coach: number | null;
  roll_call_needs_validation: boolean;
  room_blueprint: number | null;
  timezone_name: string;
  waiting_list_disabled: boolean;
  waiting_list_max_size: number;
};

export type Offer_FULL = Offer<
  Coach,
  Establishment,
  MetaActivity,
  number,
  number,
  OffersGroup
>;

export type OfferDataListItem = Offer<Coach, Establishment, MetaActivity> & {
  customLevel: Level;
};

type OfferDancing = {
  id: number;
  nb_booked_female: number;
  nb_booked_male: number;
  nb_booked_other: number;
};

export type OfferStatus = {
  id: number;
  offer_status: number;
  bookable_status:
    | typeof OFFER_BOOKABLE_STATUS_BOOKABLE
    | typeof OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON
    | typeof OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE
    | typeof OFFER_BOOKABLE_STATUS_FULL
    | typeof OFFER_BOOKABLE_STATUS_LOCKED
    | typeof OFFER_BOOKABLE_STATUS_ALREADY_BOOKED
    | typeof OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE;
  waiting_list_status:
    | typeof OFFER_WAITING_LIST_STATUS_OPEN
    | typeof OFFER_WAITING_LIST_STATUS_FULL
    | typeof OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED
    | typeof OFFER_WAITING_LIST_STATUS_CONVERTIBLE
    | typeof OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS;
  taken_spots: number[];
  blocked_by_tags: boolean;
  is_registered: boolean;
};

export type OfferStatusWaitingListPosition = {
  id: number;
  waiting_list_position: {
    member_position: number;
    waiting_list_size: number;
  };
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
  byId: { [key: string]: OfferREST };
  calendar: ImmutableArray<Partial<OfferREST>>;
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
  retrieve: ErrorAndLoading & { data: OfferREST | null };
  bulk: ErrorAndLoading;
  similarOffers: ErrorAndLoading & {
    count: number;
    items: OfferREST[];
    lastFetched: Date | null;
    next_page: number;
  };
  next: ErrorAndLoading & {
    item?: OfferREST;
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
  offerStatusWaitinglistPosition: ErrorAndLoading & {
    byId: { [key: string]: OfferStatusWaitingListPosition };
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
  similarOffersReworked: {
    page: number;
    next_page: number | null;
    previous_page: number | null;
    count: number;
    offers: {
      allIds: number[];
      byId: { [key: number]: OfferREST };
    };
  } & ErrorAndLoading;
};

export type OfferFormValues = {
  allowGuestOffer: boolean;
  availableOnPartnership: boolean;
  broadcastLink: string | null;
  calendarSelectedDate?: string;
  /* This value is only here to check if the custom name / description has changed. We use it to compare the field values to the  
  chosenMetaActivity.name and chosenMetaActivity.description */
  chosenMetaActivity?: MetaActivity;
  coach: number;
  coachOverride?: number | null;
  coachOverridePropagateMode?: number;
  coachPaymentRule: number | null;
  creditPriceOverride?: number;
  credits: number;
  dateIntervalEnd?: LuxonDateTime | null;
  dateIntervalStart: LuxonDateTime;
  dates?: number[];
  descriptionOverride?: string;
  durationMinute: number;
  effectif: number;
  establishment: number;
  is_hybrid: boolean;
  isCoachOverridePropagate?: boolean;
  // edit offer
  isEditOffer?: boolean;
  isManagerOnly: boolean;
  isMetaActivityBroadcast: boolean;
  isModifyRecursively?: boolean;
  isNotifyConsumers?: boolean;
  isOfferInGroup: boolean;
  isRecurrence?: boolean;
  isRecurrenceWeekDayDialogOpen?: boolean;
  isShowPartnership: boolean;
  isZoomAppEnabled: boolean;
  level: number;
  nameOverride?: string;
  partnerMaxBookingCount?: number | null;
  recurrence?:
    | OFFER_RECURRENCE.WEEKLY
    | OFFER_RECURRENCE.MONTHLY
    | OFFER_RECURRENCE.DAILY;
  recurrenceWeekDay?: {
    '1': boolean;
    '2': boolean;
    '3': boolean;
    '4': boolean;
    '5': boolean;
    '6': boolean;
    '7': boolean;
  };
  roomBlueprint: number | null;
  roomBlueprintSlots: number | null;
  selectedBlacklistTags: number[];
  selectedMetaActivity?: number;
  selectedSimilarOffers?: number[];
  selectedWhitelistTags: number[];
  syncOfferOnSpivi?: boolean;
  waitingListMaxSize?: number;
  wellhubProductId?: WellhubProductId | null;
  isWellhubProductRequired?: boolean;
};

export type OfferFormRecurrenceWeekDay =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7';

export type OfferCreate = {
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  blacklist_tags: number[];
  broadcast_link: string;
  coach_payment_rule: number | null;
  coach: number;
  credits: number;
  dates: number[];
  description_override?: string;
  duration_minute: number;
  effectif: number;
  establishment: number;
  is_hybrid: boolean;
  level: number;
  manager_only: boolean;
  meta_activity?: number;
  name_override?: string;
  partner_max_booking_count: number;
  room_blueprint?: number;
  sync_on_spivi?: boolean;
  waiting_list_max_size: number;
  wellhub_product_id?: WellhubProductId | null;
  whitelist_tags: number[];
  recurrence_id?: string;
  hour?: number;
};

export type OfferEdit = Omit<OfferCreate, 'dates' | 'credits' | 'is_hybrid'> & {
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  coach_override: number | null;
  credit_price_override?: number;
  credits?: number;
  custom_selection_ids: number[];
  custom_selection: boolean;
  date_start: LuxonDateTime;
  description_override?: string;
  id: number;
  manager_only: boolean;
  meta_activity: number;
  modifyAllDates: boolean;
  name_override?: string;
  notifyConsumers: boolean;
  propagate_coach_override_value: number;
};

export enum MarketplaceOfferStatus {
  BOOKED = 0,
  SOON = 1,
  BOOKABLE = 2,
  WAITING_LIST = 3,
  CANCELLED = 4,
  COMPLETED = 5,
}

export type UserRegistrationParams = {
  check_offer_unicity?: boolean;
};

export type OfferStatusParams = {
  booking_for_invitee_only?: boolean;
};

export enum OfferSummaryVariant {
  DEFAULT = 'default',
  BASKET = 'basket',
  BOOKING = 'booking',
}
export type OfferWithSpotInformation = Offer_FULL & {
  customLevel: Level;
  spot_id?: number;
  spot_information?: SpotInformation;
};

export enum BOOKING_FOR_GUEST_FREQUENCY {
  WEEK = 'every_week',
  MONTH = 'every_month',
  YEAR = 'every_year',
}

export type DeleteOfferPayload = {
  deleteAll: boolean;
  custom_selection: boolean;
  custom_selection_ids: number[];
};

export type RecurrenceResponse = {
  last_offer: {
    id: number;
    date_start: string;
  };
  recurrence_count: number;
  recurrence_id: string;
};
