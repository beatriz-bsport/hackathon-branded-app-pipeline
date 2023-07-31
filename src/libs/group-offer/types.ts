import { Offer, OfferStatus } from '#libs/offer/types';
import { ErrorAndLoading } from '../types';

export type GroupOfferState = ErrorAndLoading & {
  byId: Record<number, OffersGroup>;
  allIds: number[];
  count: number;
  preview: ErrorAndLoading & {
    groups: Record<
      number,
      {
        offers_data: Offer[];
        group: OffersGroup;
      }
    >;
  };
  retrieve: ErrorAndLoading & { id: number | null };
  editing: ErrorAndLoading;
  similar: ErrorAndLoading & {
    allIds: number[];
  };
  delete: ErrorAndLoading;
  existing: ErrorAndLoading & {
    exist: boolean;
  };
  offersStatus: {
    byId: {
      [id: number]: {
        [id: number]: OfferStatus;
      };
    };
  } & ErrorAndLoading;
  offersIdsToBeBooked: {
    allIds: number[];
    byGroupId: { [key: number]: number[] };
  } & ErrorAndLoading;
};

export type RecurrenceRuleGroupOffer = {
  count: number;
  frequence: 0 | 1 | 2;
  interval: number | null;
  until: number | null;
};

export type OffersGroup<T = number> = {
  id: number;
  company: number;
  meta_activity: number;
  offers: T[];
  level: number;
  full_booking_only: boolean;
  allow_booking_after_start: boolean;
  available: boolean;
  recurrence_id: string;
  name: string;
  recurrence_rule: RecurrenceRuleGroupOffer;
  manager_only: boolean;
  recurrence_index: number;
  first_offer_date: string;
};

export type OffersGroupFilter = {
  min_date?: string;
  max_date?: string;
  meta_activity__in?: number[];
};

export type GroupPreviewData = {
  group_data: {
    meta_activity: number;
    level: number;
    name: string;
    allow_booking_after_start: boolean;
    full_booking_only: boolean;
    available: boolean;
    manager_only: boolean;
  };
  recurrence_rule: {
    count: number;
    until: string;
    frequence: 0 | 1 | 2 | null;
  } | null;
  offers_data: Offer[];
};

export type MetaActivityFilter = {
  company: number;
  coach__in?: number[];
  establishment__in?: number[];
  establishment_group__in?: number[];
  establishment?: number[];
  level__in?: number[];
  id__in?: number[];
  as_coach?: boolean;
  is_workshop?: boolean;
  customer_enabled?: boolean;
  with_future_slots?: boolean;
};
