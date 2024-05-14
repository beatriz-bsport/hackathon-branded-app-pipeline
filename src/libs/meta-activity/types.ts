import { ErrorAndLoading, GenericListReducerI } from '#libs/types';

type MetaActivityImage = {
  id: number;
  image: string;
};

// MetaActivity & Workshop
export type MetaActivity<T = number> = {
  id: number;
  name: string;
  cover_main: string;
  alt_cover_main: string;
  rating: string;
  SCT: number;
  parent_category: number;
  images: MetaActivityImage[];
  establishments: number[];
  next_slot: string;
  company: number;
  activities: number[];
  description: string;
  last_booking_minutes: number;
  last_discard_minutes: number;
  first_booking_minutes_until: number;

  is_workshop: boolean;
  is_broadcast: boolean;
  customer_enabled: boolean;
  color: string;
  on_booking_notification: number[];
  auto_discard_active: boolean;
  auto_discard_hours_before_start: number;
  auto_discard_min_bookings_nb: number;

  category: number;
  ordering_in_category: number;
  custom_restriction_rule: Array<MetaActivityCustomRestriction<T>>;
  metadata: {
    linked_hybrid_meta_activity_id?: number;
  };
};
export type MetaActivityCustomRestriction<T = number> = {
  tags: Array<T>;
  last_discard_minutes: number;
  last_booking_minutes: number;
  first_booking_minutes_until: number;
};
export type MetaActivityCategory = {
  id: number;
  name: string;
  company: number;
  category_ordering: number;
};

export type MetaActivityCategoryWithActivities = MetaActivityCategory & {
  items: Array<MetaActivity>;
};

export type MetaActivityState = ErrorAndLoading & {
  cachedIds: { [key: number]: number };
  byId: { [key: string]: MetaActivity };
  allIds: number[];
  favorite: ErrorAndLoading & {
    id: string;
  };
  delete: ErrorAndLoading;
  upsert: ErrorAndLoading & {
    data: MetaActivity | null;
  };
  workshop: {
    allIds: number[];
  };
  metaActivityCategory: {
    byId: { [id: number]: MetaActivityCategory };
    allIds: Array<number>;
    loading: boolean;
    error?: Error;
    upsert: {
      loading: boolean;
      error?: Error;
    };
  };
  disabledMetaActivities: GenericListReducerI;
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

export type OffersGroupFilter = Partial<{
  min_date: string; // Format: YYYY-mm-DD
  max_date: string; // Format: YYYY-mm-DD
  meta_activity__in: number[];
}>;
