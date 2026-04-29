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
