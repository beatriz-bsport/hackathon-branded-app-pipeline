import { ErrorAndLoading } from '../types';

type MetaActivityImage = {
  id: number;
  image: string;
};

// MetaActivity & Workshop
export type MetaActivity = {
  id: number;
  name: string;
  cover_main: string;
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
  byId: { [key: string]: MetaActivity };
  allIds: number[];
  favorite: ErrorAndLoading & {
    id: string;
  };
  delete: ErrorAndLoading;
  upsert: ErrorAndLoading & {
    data: MetaActivity | null;
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
};
