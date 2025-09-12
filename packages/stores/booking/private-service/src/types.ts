export type PrivateService = {
  id: number;
  name: string;
  description: string;
  private_service_group: number;
  available: boolean;
  establishments: number[];
  coach_capacity_used: number;
  use_full_establishment_capacity: boolean;
  coaches: number[];
  color: string;
  company: number;
  slots: number[];
  establishment_attribution: number;
  is_home_service: boolean;
  coach_attribution: number;
  manager_only: boolean;
  has_own_availability_slots: boolean;
  last_discard_minutes: number;
  last_booking_minutes: number;
  cover_main: string;
  slots_duration_minute: number[];
  availability_padding_start_minutes: number;
  availability_padding_end_minutes: number;
  allow_unpaid_booking: boolean;
  unpaid_whitelist_tags: number[];
  unpaid_blacklist_tags: number[];
  member_whitelist_tags: number[];
  member_blacklist_tags: number[];
  pad_before_booking: boolean;
  available_on_partnership: boolean;
};

export type FetchPrivateServiceParams = {
  mine?: boolean;
};

export type SearchPrivateServiceParams = {
  q: string;
  page?: number;
  pageSize?: number;
} & FetchPrivateServiceParams;
