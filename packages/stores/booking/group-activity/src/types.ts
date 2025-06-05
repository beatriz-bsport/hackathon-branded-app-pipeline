/**
 * A MetaActivity is a meta_activity in the backend.
 * It can be a group activity or a workshop, as it's the same object.
 */
export type FetchGroupActivitiesParams = {
  page: number;
  pageSize: number;
  customerEnabled: boolean; // if false, the endpoint should return the archived group activities
  inCategoryIds?: string[]; // optional, used to filter by specific service categories
  notInCategoryIds?: string[]; // optional, used to exclude specific service categories
};

export type SearchGroupActivitiesParams = FetchGroupActivitiesParams & {
  searchQuery?: string;
};

export type MetaActivity<Tag = number> = {
  activities: number[];
  alt_cover_main: string;
  auto_discard_active: boolean;
  auto_discard_hours_before_start: number;
  auto_discard_min_bookings_nb: number;
  category: number;
  color: string;
  company: number;
  cover_main: string;
  custom_restriction_rule: GroupActivityCustomRestriction<Tag>[];
  customer_enabled: boolean;
  description: string;
  establishments: number[];
  first_booking_minutes_until: number;
  id: number;
  images: { id: number; image: string }[];
  is_broadcast: boolean;
  is_workshop: boolean;
  last_booking_minutes: number;
  last_discard_minutes: number;
  metadata: { linked_hybrid_meta_activity_id?: number };
  name: string;
  next_slot: string;
  on_booking_notification: number[];
  ordering_in_category: number;
  parent_category: number;
  rating: string;
  SCT: number;
};

export type GroupActivityCustomRestriction<Tag = number> = {
  first_booking_minutes_until: number;
  last_booking_minutes: number;
  last_discard_minutes: number;
  tags: Tag[];
};
