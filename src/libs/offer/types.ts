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
} from '@bsport/common/lib/master-data/bookable-status';
import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_WAITING_LIST_STATUS_CONVERTIBLE,
  OFFER_BOOKABLE_STATUS_ALREADY_BOOKED,
  OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import type { ImmutableArray } from 'seamless-immutable';
import { OffersGroup } from '#src/libs/group-offer/types';
import { SpotInformation } from '#src/libs/spot-scheduling/types';
import { Level } from '#src/libs/level/types';
import { BroadcastInfo } from '#src/libs/booking/types';
import type { LuxonDateTime } from '#src/types';
import { ErrorAndLoading } from '../types';
import { Establishment } from '../establishment/types';
import { MetaActivity } from '../meta-activity/types';
import { Coach } from '../associated-coach/types';
import { OFFER_RECURRENCE } from './constants';

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
  custom_level: number;
  additional_coaches: C[];
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
  full: boolean;
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
  linked_hybrid_offer_id: number | null;
  is_broadcast: boolean;
  source: number;
  tax?: number;
  broadcast_info?: BroadcastInfo;
  internal_note?: string;
  name_override?: string;
  description_override?: string;
  validated_booking_count: number;
};

/**
 * @description Represents an Offer following the REST API payload structure, excluding deprecated redux-selector pattern.
 */
export type OfferREST = {
  activity: number;
  additional_coaches: number[];
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  available: boolean;
  blacklist_tags: number[];
  broadcast_link: string;
  category: number;
  coach_override: number | null;
  coach_payment_rule_id: number | null;
  coach: number;
  credit_price_override: number;
  credit_price: number;
  custom_level: number;
  date_roll_call_last_modified: string | null;
  date_start: string;
  duration_minute: number;
  effectif: number;
  establishment_override: number | null;
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
  name: string;
  name_override: string | null;
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
};

export type OfferFormValues = {
  dates?: number[];
  effectif: number;
  waitingListMaxSize?: number;
  level: number;
  establishment: number;
  broadcastLink: string | null;
  credits: number;
  dateIntervalStart: LuxonDateTime;
  dateIntervalEnd?: LuxonDateTime | null;
  durationMinute: number;
  isRecurrence?: boolean;
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
  calendarSelectedDate?: string;
  isRecurrenceWeekDayDialogOpen?: boolean;
  coach: number;
  additionalCoaches: number[];
  coachPaymentRule: number | null;
  isManagerOnly: boolean;
  allowGuestOffer: boolean;
  partnerMaxBookingCount?: number | null;
  availableOnPartnership: boolean;
  selectedWhitelistTags: number[];
  selectedBlacklistTags: number[];
  roomBlueprint: number | null;
  roomBlueprintSlots: number | null;
  isMetaActivityBroadcast: boolean;
  isOfferInGroup: boolean;
  isZoomAppEnabled: boolean;
  isShowPartnership: boolean;
  // edit offer
  isEditOffer?: boolean;
  selectedMetaActivity?: number;
  isNotifyConsumers?: boolean;
  isModifyRecursively?: boolean;
  coachOverride?: number | null;
  creditPriceOverride?: number;
  selectedSimilarOffers?: number[];
  isCoachOverridePropagate?: boolean;
  coachOverridePropagateMode?: number;
  is_hybrid: boolean;
  syncOfferOnSpivi?: boolean;
  nameOverride?: string;
  descriptionOverride?: string;
  /* This value is only here to check if the custom name / description has changed. We use it to compare the field values to the  
  chosenMetaActivity.name and chosenMetaActivity.description */
  chosenMetaActivity?: MetaActivity;
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
  meta_activity?: number;
  dates: number[];
  establishment: number;
  coach: number;
  additional_coaches: number[];
  effectif: number;
  partner_max_booking_count: number;
  waiting_list_max_size: number;
  level: number;
  credits: number;
  duration_minute: number;
  broadcast_link: string;
  coach_payment_rule: number | null;
  available_on_partnership: boolean;
  manager_only: boolean;
  whitelist_tags: number[];
  blacklist_tags: number[];
  allow_guest_offer: boolean;
  room_blueprint?: number;
  is_hybrid: boolean;
  sync_on_spivi?: boolean;
  name_override?: string;
  description_override?: string;
};

export type OfferEdit = Omit<OfferCreate, 'dates' | 'credits' | 'is_hybrid'> & {
  id: number;
  notifyConsumers: boolean;
  available_on_partnership: boolean;
  manager_only: boolean;
  modifyAllDates: boolean;
  custom_selection: boolean;
  custom_selection_ids: number[];
  allow_guest_offer: boolean;
  propagate_coach_override_value: number;
  meta_activity: number;
  credit_price_override?: number;
  date_start: LuxonDateTime;
  coach_override: number | null;
  credits?: number;
  additional_coaches: number[];
  name_override?: string;
  description_override?: string;
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
