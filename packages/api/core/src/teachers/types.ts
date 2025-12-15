export type FetchTeachersParams = {
  associated_coach__in?: number[];
  company?: number;
  disabled?: boolean;
  has_coach_payment_rule_group?: boolean;
  id__in?: number[];

  with_workshop?: boolean;
};

export type PaginatedFetchTeachersParams = FetchTeachersParams & {
  page: number;
  page_size: number;
};

export type FuzzySearchParams = PaginatedFetchTeachersParams & {
  queryString: string;
};

// Correspond to AssociatedCoachSerializer
export type Teacher = {
  associated_coach_id: number; // AssociatedCoach.id
  associatedcoach_set: number[];
  birthday: string | null;
  categories_taught: number[];
  coach_payment_rule_group_id: number | null;
  coach_payment_rule_id: number | null;
  color: string;
  date_joined_company: string | null;
  date_left_company: string | null;
  default_payment_rule_id: number;
  description: string;
  discipline_group: number | null;
  discipline_group_establishment_groups: number[];
  discipline_group_establishments: number[];
  disabled: boolean;
  email: string;
  facebook_url: string;
  firstname: string;
  gender: string;
  has_access_to_coach_space: boolean;
  id: number; // Coach.id
  instagram_url: string;
  is_teaching_all_activities: boolean;
  is_teaching_all_categories: boolean;
  is_teaching_all_workshops: boolean;
  lastname: string;
  meta_activities_taught: number[];
  name: string;
  notes: string | null;
  phone: string;
  photo: string | null;
  private_coach_payment_rule_id: number | null;
  private_slots_coach_payment_rules: {
    private_slot: number;
    coach_payment_rule: number;
  }[];
  rating: string;
  workshops_taught: number[];
  workshop_coach_payment_rule_id: number | null;
};
